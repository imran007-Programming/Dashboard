import jwt, { JwtPayload } from "jsonwebtoken"
import { env } from "../config/env"

// export interface Jwtpayload {
//     userId: string;
//     role: "ADMIN" | "STUDENT" | "MENTOR"

// }


export const signAccessToken = (payload: JwtPayload) => {
    return jwt.sign(payload, env.JWT_SECRET, { expiresIn: "15m" })
}
export const signRefreshToken = (payload: JwtPayload) => {
    return jwt.sign(payload, env.JWT_REFRESH, { expiresIn: "7d" })
}

export const verifyAccessToken = (token: string): JwtPayload => {
    return jwt.verify(token, env.JWT_SECRET) as JwtPayload
}
export const verifyRefreshToken = (token: string): JwtPayload => {
    return jwt.verify(token, env.JWT_REFRESH) as JwtPayload
}