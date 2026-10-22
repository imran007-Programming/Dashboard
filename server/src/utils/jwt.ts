import jwt from "jsonwebtoken"
import { env } from "../config/env"

export interface Jwtpayload {
    userId: string;
    role: "ADMIN" | "STUDENT" | "MENTOR"

}


export const signAccessToken = (payload: Jwtpayload) => {
    return jwt.sign(payload, env.JWT_SECRET, { expiresIn: "15m" })
}
export const signRefreshToken = (payload: Jwtpayload) => {
    return jwt.sign(payload, env.JWT_SECRET, { expiresIn: "7d" })
}

export const verifyAccessToken = (token: string) => {
    return jwt.verify(token, env.JWT_SECRET)
}
export const verifyRefreshToken = (token: string) => {
    return jwt.verify(token, env.JWT_SECRET)
}