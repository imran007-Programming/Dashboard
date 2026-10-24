import { Response } from "express";
import { PaginationMeta } from "./queryBuilder";

interface SuccesResponse<T> {
    statusCode: number;
    message: string;
    meta?: PaginationMeta;
    data?: T
}


export const sendRespons = <T>(res: Response, { statusCode = 200, message = "Success", meta, data }: SuccesResponse<T>) => {
    return res.status(statusCode).json({
        success: true,
        message,
        ...(meta && { meta }),
        data: data ?? null
    })

}

