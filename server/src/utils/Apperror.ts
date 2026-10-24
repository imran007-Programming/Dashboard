export class AppError extends Error {
    public statusCode: number
    constructor(statusCode: number, message: string) {
        super(message);
        this.statusCode = statusCode
        this.name = "AppError"


        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}