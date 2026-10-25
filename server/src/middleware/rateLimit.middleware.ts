import rateLimit from "express-rate-limit";

const tooMany = (message: string) => ({ success: false, message });

// Create project: 5 per minute per IP
export const apiLimit = rateLimit({
    windowMs: 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: tooMany("Too many requests, please try again in a minute"),
})

// Login: 10 failed attempts per 15 minutes per IP (stops password guessing).
// Successful logins are not counted, so real users never get locked out.
export const loginLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    skipSuccessfulRequests: true,
    standardHeaders: true,
    legacyHeaders: false,
    message: tooMany("Too many failed login attempts, please try again in 15 minutes"),
})

// Signup: 5 accounts per hour per IP (stops fake account spam)
export const signupLimit = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: tooMany("Too many signup attempts, please try again in an hour"),
})
