import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/Apperror";

type Role = "STUDENT" | "MENTOR" | "ADMIN";

export function requireRole(...role: Role[]) {

    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return next(new AppError(403, "please Login"))
        }
        if (!role.includes(req.user.role)) {
            return next(new AppError(403, "access denied"))
        }
        next()
    }


}