import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/Apperror";
import { Prisma } from "../../generated/prisma/client";
import { ZodError } from "zod";

export const globalErrorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";

    // 1 custom AppError
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
        });
    }

    // zod validation error (body, params, query)
    if (err instanceof ZodError) {
        return res.status(400).json({
            success: false,
            message: err.issues[0]?.message || "Validation failed",
            errors: err.issues.map((issue) => ({
                field: issue.path.join("."),
                message: issue.message,
            })),
        });
    }

    //2 prisma error
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        switch (err.code) {
            case "P2002": {
                // Unique constraint violation
                const target = (err.meta?.target as string[])?.join(", ") || "field";
                statusCode = 409;
                message = `Duplicate value: '${target}' already exists.`;
                break;
            }
            case "P2025": {
                // Record not found
                statusCode = 404;
                message = (err.meta?.cause as string) || "Record not found.";
                break;
            }
            case "P2003": {
                // Foreign key constraint failure
                statusCode = 400;
                message = "Related record does not exist (Foreign key failed).";
                break;
            }
            default: {
                statusCode = 400;
                message = `Database Error: ${err.message}`;
            }
        }

        return res.status(statusCode).json({
            success: false,
            message,
        });
    }

    // 3. Prisma Validation Error
    if (err instanceof Prisma.PrismaClientValidationError) {
        return res.status(400).json({
            success: false,
            message: "Invalid or missing fields provided for database query.",
        });
    }

    // 4(Crash / Unexpected)
    console.error("💥 UNEXPECTED ERROR:", err);

    return res.status(500).json({
        success: false,
        message: "Something went wrong on the server!",
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
};