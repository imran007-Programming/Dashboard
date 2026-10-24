import bcrypt from "bcrypt";

import { signAccessToken, signRefreshToken } from "../../utils/jwt";
import { SignupInput, LoginInput } from "./auth.schema";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/Apperror";



type Role = "STUDENT" | "MENTOR" | "ADMIN";

function issueTokens(user: { id: string; role: Role }) {
    const payload = { userId: user.id, role: user.role };
    return {
        accessToken: signAccessToken(payload),
        refreshToken: signRefreshToken(payload),
    };
}

function toPublicUser(user: { id: string; name: string; email: string; role: Role }) {
    return { id: user.id, name: user.name, email: user.email, role: user.role };
}

export async function signupUser(input: SignupInput) {
    console.log(input)
    const exists = await prisma.user.findUnique({ where: { email: input.email } });
    if (exists) {
        throw new AppError(409, "An account with this email already exists");
    }

    const hashed = await bcrypt.hash(input.password, 10);

    const user = await prisma.user.create({
        data: {
            name: input.name,
            email: input.email,
            password: hashed,
            role: input.role,
        },
    });

    return { user: toPublicUser(user), ...issueTokens(user) };
}

export async function loginUser(input: LoginInput) {
    const user = await prisma.user.findUnique({ where: { email: input.email } });

    // if user not getting throw error
    if (!user) {
        throw new AppError(401, "Invalid email or password");
    }

    const valid = await bcrypt.compare(input.password, user.password);
    if (!valid) {
        throw new AppError(401, "Invalid email or password");
    }

    return { user: toPublicUser(user), ...issueTokens(user) };
}