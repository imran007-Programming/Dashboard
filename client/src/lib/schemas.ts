import { z } from "zod";

// Same rules and messages as the server schemas:
//   server/src/modules/projects/projects.schema.ts
//   server/src/modules/auth/auth.schema.ts
// The client checks first for fast feedback; the server checks again because
// anyone can call the API directly. If you change a rule, change it in both places.

export const createProjectSchema = z.object({
  name: z
    .string({ error: "Project name is required" })
    .trim()
    .min(3, { error: "Name must be at least 3 characters" })
    .max(100, { error: "Name must be at most 100 characters" }),

  repoUrl: z
    .string({ error: "Repository URL is required" })
    .trim()
    .pipe(z.url({ error: "Please provide a valid repository URL" }))
    .refine((url) => url.startsWith("https://github.com/"), {
      error: "Repository URL must be a GitHub link",
    }),

  liveLink: z
    .string({ error: "Live link is required" })
    .trim()
    .pipe(z.url({ error: "Please provide a valid live link" })),

  description: z
    .string({ error: "Description is required" })
    .trim()
    .min(20, { error: "Description must be at least 20 characters" })
    .max(1000, { error: "Description must be at most 1000 characters" }),
});

export const signupSchema = z.object({
  name: z
    .string({ error: (issue) => (issue.input === undefined ? "Name is required" : undefined) })
    .trim()
    .min(2, { error: "Name must be at least 2 characters" })
    .max(50, { error: "Name must be at most 50 characters" }),

  email: z
    .string({ error: (issue) => (issue.input === undefined ? "Email is required" : undefined) })
    .trim()
    .toLowerCase()
    .pipe(z.email({ error: "Please provide a valid email" })),

  password: z
    .string({ error: (issue) => (issue.input === undefined ? "Password is required" : undefined) })
    .min(6, { error: "Password must be at least 6 characters" })
    .max(100, { error: "Password must be at most 100 characters" }),

  role: z.enum(["STUDENT", "MENTOR"], { error: "Role must be STUDENT or MENTOR" }).default("STUDENT"),
});

export const loginSchema = z.object({
  email: z
    .string({ error: (issue) => (issue.input === undefined ? "Email is required" : undefined) })
    .trim()
    .toLowerCase()
    .pipe(z.email({ error: "Please provide a valid email" })),

  password: z
    .string({ error: (issue) => (issue.input === undefined ? "Password is required" : undefined) })
    .min(1, { error: "Password is required" }),
});

// { name: "Name must be at least 3 characters", ... } — first message per field,
// same shape the API's `errors` array turns into
export function zodFieldErrors(error: z.ZodError): Record<string, string> {
  const result: Record<string, string> = {};
  for (const issue of error.issues) {
    const field = issue.path.join(".");
    if (!(field in result)) result[field] = issue.message;
  }
  return result;
}
