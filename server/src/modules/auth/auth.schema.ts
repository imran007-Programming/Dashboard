import { z } from "zod";

export const signupSchema = z.object({
    name: z
        .string({ error: (issue) => issue.input === undefined ? "Name is required" : undefined })
        .trim()
        .min(2, { error: "Name must be at least 2 characters" })
        .max(50, { error: "Name must be at most 50 characters" }),

    email: z
        .string({ error: (issue) => issue.input === undefined ? "Email is required" : undefined })
        .trim()
        .toLowerCase()
        .pipe(z.email({ error: "Please provide a valid email" })),

    password: z
        .string({ error: (issue) => issue.input === undefined ? "Password is required" : undefined })
        .min(6, { error: "Password must be at least 6 characters" })
        .max(100, { error: "Password must be at most 100 characters" }),

    // Admin can't sign up, admin account comes from the seed
    role: z
        .enum(["STUDENT", "MENTOR"], { error: "Role must be STUDENT or MENTOR" })
        .default("STUDENT"),
});

export const loginSchema = z.object({
    email: z
        .string({ error: (issue) => issue.input === undefined ? "Email is required" : undefined })
        .trim()
        .toLowerCase()
        .pipe(z.email({ error: "Please provide a valid email" })),

    password: z
        .string({ error: (issue) => issue.input === undefined ? "Password is required" : undefined })
        .min(1, { error: "Password is required" }),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
