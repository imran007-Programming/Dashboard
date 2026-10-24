import { z } from "zod";
import { paginationQuerySchema, sortBySchema } from "../../utils/queryBuilder";

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

// All fields are optional, but at least one is required
export const updateProjectSchema = createProjectSchema
    .partial()
    .refine((data) => Object.keys(data).length > 0, {
        error: "Provide at least one field to update",
    });

// Mentor/admin review: PATCH /api/project/:id/status
export const updateStatusSchema = z.object({
    status: z.enum(["PENDING", "APPROVED", "REJECTED"], {
        error: "Status must be PENDING, APPROVED or REJECTED",
    }),
});

export const projectIdSchema = z.object({
    id: z.uuid({ error: "Invalid project id" }),
});

// GET /api/project?page=1&limit=10&search=todo&status=PENDING&sortBy=createdAt&sortOrder=desc
export const projectQuerySchema = paginationQuerySchema.extend({
    status: z
        .enum(["PENDING", "APPROVED", "REJECTED"], {
            error: "Status must be PENDING, APPROVED or REJECTED",
        })
        .optional(),

    userId: z.uuid({ error: "Invalid user id" }).optional(),

    sortBy: sortBySchema(["createdAt", "updatedAt", "name"], "createdAt"),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type UpdateStatusInput = z.infer<typeof updateStatusSchema>;
export type ProjectQuery = z.infer<typeof projectQuerySchema>;