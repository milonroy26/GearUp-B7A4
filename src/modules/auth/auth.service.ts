import bcrypt from "bcryptjs";

import { SignOptions } from 'jsonwebtoken';
import config from "../../config";
import { AppError } from "../../interfaces/customError";
import { prisma } from "../../lib/prisma";
import { jwtUtils } from "../../utils/jwt";
import { LoginInput } from "./auth.validation";

//* Register User
const registerUserIntoDB = async (userData: any) => {
    const { name, email, password, role } = userData;

    //* Check if user already exists
    const existingUser = await prisma.user.findUnique({
        where: {
            email
        }
    });

    if (existingUser) {
        throw new AppError(400, 'Email already registered');
    }

    //* Hash the password
    const hashedPassword = await bcrypt.hash(password, config.bcrypt_salt_rounds);

    //* Create new user
    const newUser = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role
        }
    });

    return newUser;
}

//* Login User

const loginUserIntoDb = async (loginData: LoginInput) => {

    const { email, password } = loginData;

    //* Check if user exists
    const user = await prisma.user.findUnique({
        where: {
            email
        }
    })

    if (!user || user.isDeleted) {
        throw new AppError(401, 'Invalid email or password');
    }

    //* Compare password
    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
        throw new AppError(401, 'Invalid email or password');
    }

    const jwtPayload = {
        userId: user.id,
        role: user.role
    }

    //* Generate JWT token
    const accessToken = jwtUtils.createToken(jwtPayload, config.jwt_access_secret, config.jwt_access_expires_in as SignOptions);

    return accessToken;
}


export const AuthService = {
    registerUserIntoDB,
    loginUserIntoDb
}