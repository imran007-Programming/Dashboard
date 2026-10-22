import app from "./app";
import { env } from "./config/env";
import { prisma } from "./lib/prisma.ts"


const bootStrap = async () => {
    try {
        await prisma.$connect();
        console.log("✅ Database Connected Successfully");

        app.listen(env.PORT, () => {
            console.log(`🚀 server is running on ${env.PORT}`)
        });
    } catch (error) {
        console.log("database connection failed", error)
        await prisma.$disconnect();
        process.exit(1)
    }


}

bootStrap()

process.on("SIGINT", async () => {
    await prisma.$disconnect();
    process.exit(0)
})