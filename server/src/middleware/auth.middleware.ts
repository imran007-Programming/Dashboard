import { NextFunction, Request, Response } from "express";
import { ACCESS_COOKIES } from "../utils/cookies";
import { AppError } from "../utils/Apperror";
import { verifyAccessToken } from "../utils/jwt";

export const authGuard = (req: Request, res: Response, next: NextFunction) => {

    try {
        const token = req.cookies[ACCESS_COOKIES]
        if (!token) {
            throw new AppError(401, "Please login first")
        }
        req.user = verifyAccessToken(token);
        next()
    } catch (error) {
        if (error instanceof AppError) return next(error);
        next(new AppError(401, "Token Invalid"))
    }
}