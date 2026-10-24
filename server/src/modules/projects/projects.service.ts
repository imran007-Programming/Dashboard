
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/Apperror";
import { Prisma } from "../../../generated/prisma/client";
import { buildMeta, buildPagination, buildSearchFilter } from "../../utils/queryBuilder";
import { CreateProjectInput, ProjectQuery, UpdateProjectInput, UpdateStatusInput } from "./projects.schema";

type Role = "STUDENT" | "MENTOR" | "ADMIN";

// The logged-in user making the request
type Requester = { userId: string; role: Role };

// Include owner's public info only (no password)
const projectOwner = {
    user: { select: { id: true, name: true, email: true } },
};

export async function createProjectForUser(userId: string, input: CreateProjectInput) {

    console.log("userId:", userId);
    console.log("input:", input);
    const exists = await prisma.project.findUnique({
        where: { repoUrl: input.repoUrl },
    });

    if (exists) {
        throw new AppError(409, "This repository has already been submitted");
    }

    return prisma.project.create({
        data: {
            name: input.name,
            repoUrl: input.repoUrl,
            liveLink: input.liveLink,
            description: input.description,
            userId,
        },
    });
}

export async function findProjects(query: ProjectQuery, requester: Requester) {
    const { page, limit, search, status, userId, sortBy, sortOrder } = query;
    const { skip, take, orderBy } = buildPagination({ page, limit, sortBy, sortOrder });

    const where: Prisma.ProjectWhereInput = {};

    if (status) {
        where.status = status;
    }

    if (search) {
        where.OR = buildSearchFilter<Prisma.ProjectWhereInput>(search, ["name", "description"]);
    }

    // Students see only their own projects, mentors/admins can filter by userId
    if (requester.role === "STUDENT") {
        where.userId = requester.userId;
    } else if (userId) {
        where.userId = userId;
    }

    const [projects, total] = await prisma.$transaction([
        prisma.project.findMany({
            where,
            include: projectOwner,
            orderBy,
            skip,
            take,
        }),
        prisma.project.count({ where }),
    ]);

    return {
        meta: buildMeta(page, limit, total),
        projects,
    };
}

export async function findProjectById(id: string, requester: Requester) {
    const project = await prisma.project.findUnique({
        where: { id },
        include: projectOwner,
    });

    if (!project) {
        throw new AppError(404, "Project not found");
    }

    if (requester.role === "STUDENT" && project.userId !== requester.userId) {
        throw new AppError(403, "You do not have access to this project");
    }

    return project;
}

export async function updateProjectForUser(id: string, requester: Requester, input: UpdateProjectInput) {
    const project = await prisma.project.findUnique({ where: { id } });

    if (!project) {
        throw new AppError(404, "Project not found");
    }

    if (project.userId !== requester.userId) {
        throw new AppError(403, "You can only edit your own project");
    }

    if (input.repoUrl && input.repoUrl !== project.repoUrl) {
        const exists = await prisma.project.findUnique({
            where: { repoUrl: input.repoUrl },
        });

        if (exists) {
            throw new AppError(409, "This repository has already been submitted");
        }
    }

    return prisma.project.update({
        where: { id },
        data: input,
        include: projectOwner,
    });
}

// Only mentors and admins reach this (checked in the route)
export async function updateProjectStatus(id: string, input: UpdateStatusInput) {
    const project = await prisma.project.findUnique({ where: { id } });

    if (!project) {
        throw new AppError(404, "Project not found");
    }

    return prisma.project.update({
        where: { id },
        data: { status: input.status },
        include: projectOwner,
    });
}

export async function deleteProjectForUser(id: string, requester: Requester) {
    const project = await prisma.project.findUnique({ where: { id } });

    if (!project) {
        throw new AppError(404, "Project not found");
    }

    // Owner can delete their own project, mentor and admin can delete any
    if (project.userId !== requester.userId && requester.role === "STUDENT") {
        throw new AppError(403, "You can only delete your own project");
    }

    await prisma.project.delete({ where: { id } });
}
