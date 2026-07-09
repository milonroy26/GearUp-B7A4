import axios from 'axios';
import httpStatus from 'http-status';
import { OrderStatus, PaymentStatus } from '../../../generated/prisma/enums';
import config from '../../config';
import { AppError } from '../../interfaces/customError';
import { prisma } from '../../lib/prisma';


const initiatePaymentInDB = async (rentalOrderId: string, userId: string) => {

    // Finding and verifying the order
    const order = await prisma.rentalOrder.findUnique({
        where: { id: rentalOrderId },
        include: { customer: true },
    });

    if (!order) {
        throw new AppError(httpStatus.NOT_FOUND, 'Rental order not found');
    }

    if (order.customerId !== userId) {
        throw new AppError(httpStatus.FORBIDDEN, 'You cannot pay for someone else\'s order');
    }

    const transactionId = `TXN-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // SSLCommerz- request body
    const paymentData = {
        store_id: config.ssl_commerz_store_id,
        store_passwd: config.ssl_commerz_store_password,
        total_amount: order.totalPrice,
        currency: 'BDT',
        tran_id: transactionId,
        success_url: `${process.env.BACKEND_URL}/api/payments/success?tranId=${transactionId}`,
        fail_url: `${process.env.BACKEND_URL}/api/payments/fail?tranId=${transactionId}`,
        cancel_url: `${process.env.BACKEND_URL}/api/payments/cancel?tranId=${transactionId}`,
        ipn_url: `${process.env.BACKEND_URL}/api/payments/ipn`,
        cus_name: order.customer.name,
        cus_email: order.customer.email,
        cus_add1: 'Dhaka, Bangladesh',
        cus_phone: '01700000000',
        cus_country: 'Bangladesh',
        shipping_method: 'NO',
        product_name: 'Sports Gear Rental',
        product_category: 'Equipment',
        product_profile: 'general',
    };

    // Sending requests to the SSLCommerz Sandbox API
    const sslUrl = 'https://sandbox.sslcommerz.com/gwprocess/v4/api.php';
    const response = await axios.post(sslUrl, paymentData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    if (response.data?.status === 'SUCCESS') {
        // Creating a pending payment record in our database
        await prisma.payment.create({
            data: {
                transactionId,
                amount: order.totalPrice,
                method: 'SSLCommerz',
                status: PaymentStatus.PENDING,
                rentalOrderId: order.id,
            },
        });

        // Sending gateway URL to redirect customer
        return { paymentUrl: response.data.GatewayPageURL };
    } else {
        throw new AppError(httpStatus.BAD_REQUEST, 'SSLCommerz session initiation failed');
    }
};

const handlePaymentSuccessInDB = async (transactionId: string) => {
    return await prisma.$transaction(async (tx) => {
        const payment = await tx.payment.findUnique({
            where: { transactionId },
        });

        if (!payment) {
            throw new AppError(httpStatus.NOT_FOUND, 'Transaction not found');
        }

        // COMPLETED payment status
        const updatedPayment = await tx.payment.update({
            where: { transactionId },
            data: {
                status: PaymentStatus.COMPLETED,
                paidAt: new Date(),
            },
        });

        // Rental order status changed to PAID
        await tx.rentalOrder.update({
            where: { id: payment.rentalOrderId },
            data: { status: OrderStatus.PAID },
        });

        return updatedPayment;
    });
};

const handlePaymentFailInDB = async (transactionId: string) => {
    return await prisma.payment.update({
        where: { transactionId },
        data: { status: PaymentStatus.FAILED },
    });
};

export const PaymentServices = {
    initiatePaymentInDB,
    handlePaymentSuccessInDB,
    handlePaymentFailInDB,
};