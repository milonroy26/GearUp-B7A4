import { prisma } from "../../lib/prisma";


const getDashboardMetricsFromDB = async () => {

    const [totalUsers, totalGears, totalOrders, revenueData] = await Promise.all([
        prisma.user.count({ where: { role: 'CUSTOMER' } }),
        prisma.gearItem.count(),
        prisma.rentalOrder.count(),
        prisma.payment.aggregate({
            where: { status: 'COMPLETED' },
            _sum: { amount: true }
        })
    ]);

    // recent 5 transactions
    const recentTransactions = await prisma.payment.findMany({
        take: 5,
        orderBy: { paidAt: 'desc' },
        include: {
            rentalOrder: {
                include: { customer: { select: { name: true } } }
            }
        }
    });

    return {
        summary: {
            totalCustomers: totalUsers,
            totalProducts: totalGears,
            totalOrders: totalOrders,
            totalRevenue: revenueData._sum.amount || 0,
        },
        recentTransactions,
    };
};

export const AdminServices = {
    getDashboardMetricsFromDB,
};