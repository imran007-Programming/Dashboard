import app from "./app";
const PORT = process.env.PORT || 5000
import { prisma } from "../lib/prisma"
const bootStrap = async () => {
    try {
        await prisma.$connect();
        console.log("✅ Database Connected Successfully");

        app.listen(PORT, () => {
            console.log(`🚀 server is running on ${PORT}`)
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