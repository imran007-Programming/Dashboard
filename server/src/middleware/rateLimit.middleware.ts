import rateLimit from "express-rate-limit";

export const apiLimit = rateLimit({
    windowMs: 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "To many request, try again after sometimes later"
    }
})