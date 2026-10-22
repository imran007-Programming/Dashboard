import "dotenv/config"
const required = (name: string): string => {
    const value = process.env[name]
    if (!value) {
        throw new Error(`${name} is not defined in .env file`)
    }
    return value;
}

export const env = {
    PORT: Number(process.env.PORT) || 5000,
    NODE_ENV: process.env.NODE_ENV || "development",
    CLIENT_URL: process.env.CLIENT_URL || "http://localhost:3000",

    DATABASE_URL: required("DATABASE_URL"),
    JWT_SECRET: required("JWT_SECRET"),
    JWT_REFRESH: required("JWT_REFRESH")
}