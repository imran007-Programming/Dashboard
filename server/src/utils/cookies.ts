import { CookieOptions, Response } from "express";
import { env } from "../config/env";
const isProd = env.NODE_ENV === "production"

const baseOptions: CookieOptions = {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax"
}
export const ACCESS_COOKIES = "accessToken"
export const REFRESH_COOKIES = "refreshToken"

export const accessCookiesOptions: CookieOptions = {
    ...baseOptions,
    path: "/",
    maxAge: 15 * 60 * 1000
}

export const refreshTokenOptions: CookieOptions = {
    ...baseOptions,
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000

}

export const setAuthCookies = (res: Response, accessToken: string, refreshToken: string) => {

    res.cookie(ACCESS_COOKIES, accessToken, accessCookiesOptions)
    res.cookie(REFRESH_COOKIES, refreshToken, refreshTokenOptions)

}

// Delete  tokens (AccessToken, RefreshToken) from cookies
export function clearAuthCookies(res: Response) {
    res.clearCookie(ACCESS_COOKIES, accessCookiesOptions)
    res.clearCookie(REFRESH_COOKIES, refreshTokenOptions)

}