import { Request, Response, NextFunction } from "express";
import { signupSchema, loginSchema } from "./auth.schema";
import { signupUser, loginUser } from "./auth.service";

import { verifyRefreshToken, signAccessToken } from "../../utils/jwt";
import { ACCESS_COOKIES, accessCookiesOptions, clearAuthCookies, REFRESH_COOKIES, setAuthCookies } from "../../utils/cookies";
import { sendRespons } from "../../utils/response";
import { AppError } from "../../utils/Apperror";

export async function signup(req: Request, res: Response, next: NextFunction) {
    try {
        const input = signupSchema.parse(req.body);
        console.log("signupUser input:", input);
        const { user, accessToken, refreshToken } = await signupUser(input);

        setAuthCookies(res, accessToken, refreshToken);
        sendRespons(res, {
            statusCode: 201,
            message: "Signup successful",
            data: user
        })

    } catch (err) {
        next(err);
    }
}

export async function login(req: Request, res: Response, next: NextFunction) {
    try {
        const input = loginSchema.parse(req.body);
        const { user, accessToken, refreshToken } = await loginUser(input);

        setAuthCookies(res, accessToken, refreshToken);
        sendRespons(res, {
            statusCode: 200,
            message: "Login successful",
            data: user
        })
    } catch (err) {
        next(err);
    }
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
    try {
        const token = req.cookies[REFRESH_COOKIES];
        if (!token) {
            throw new AppError(401, "Please log in");
        }

        // Take only userId and role (decoded token also has iat/exp)
        const { userId, role } = verifyRefreshToken(token);
        const accessToken = signAccessToken({ userId, role });

        res.cookie(ACCESS_COOKIES, accessToken, accessCookiesOptions);
        sendRespons(res, {
            statusCode: 200,
            message: "Access token refreshed successfully"
        })
    } catch {
        next(new AppError(401, "Session expired, please log in again"));
    }
}

export function logout(req: Request, res: Response) {
    clearAuthCookies(res);
    sendRespons(res, {
        statusCode: 200,
        message: "Logout successful"
    })
}