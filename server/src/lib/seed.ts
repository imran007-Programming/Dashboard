import bcrypt from "bcrypt";
import { prisma } from "./prisma";

// Same password for all demo accounts
export const DEMO_PASSWORD = "123456";

const demoUsers = [
    { name: "Demo Admin", email: "admin@gmail.com", role: "ADMIN" },
    { name: "Demo Mentor", email: "mentor@gmail.com", role: "MENTOR" },
    { name: "Demo Student", email: "student@gmail.com", role: "STUDENT" },
] as const;

// Runs on every server start. Upsert keeps it safe to run again,
// and resets role/password so the demo logins always work.
export async function seedDemoUsers() {
    const password = await bcrypt.hash(DEMO_PASSWORD, 10);

    for (const user of demoUsers) {
        await prisma.user.upsert({
            where: { email: user.email },
            update: { name: user.name, role: user.role, password },
            create: { ...user, password },
        });
    }

    console.log(`🌱 Demo users ready: ${demoUsers.map((u) => u.email).join(", ")}`);
}
