import { z } from "zod";

export type SortOrder = "asc" | "desc";

export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

// Common query params for any list API: ?page=1&limit=10&search=abc&sortOrder=desc
export const paginationQuerySchema = z.object({
    page: z.coerce
        .number({ error: "Page must be a number" })
        .int()
        .min(1, { error: "Page must be at least 1" })
        .default(1),

    limit: z.coerce
        .number({ error: "Limit must be a number" })
        .int()
        .min(1, { error: "Limit must be at least 1" })
        .max(100, { error: "Limit must be at most 100" })
        .default(10),

    search: z.string().trim().min(1).optional(),

    sortOrder: z
        .enum(["asc", "desc"], { error: "sortOrder must be asc or desc" })
        .default("desc"),
});

// sortBy field list is different for each module
export const sortBySchema = <const T extends readonly [string, ...string[]]>(fields: T, defaultField: T[number]) =>
    z
        .enum(fields, { error: `sortBy must be one of: ${fields.join(", ")}` })
        .default(defaultField as never);

// Builds skip, take and orderBy for prisma findMany
export function buildPagination<TSortBy extends string>(options: {
    page: number;
    limit: number;
    sortBy: TSortBy;
    sortOrder: SortOrder;
}) {
    const { page, limit, sortBy, sortOrder } = options;

    return {
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sortBy]: sortOrder } as Record<TSortBy, SortOrder>,
    };
}

// Case-insensitive search on multiple fields, use it as where.OR
export function buildSearchFilter<TWhere>(search: string, fields: (keyof TWhere & string)[]) {
    return fields.map((field) => ({
        [field]: { contains: search, mode: "insensitive" },
    })) as TWhere[];
}

export function buildMeta(page: number, limit: number, total: number): PaginationMeta {
    return {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
    };
}
