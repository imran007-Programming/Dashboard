import { Request, Response, NextFunction } from "express";
import { createProjectSchema, projectIdSchema, projectQuerySchema, updateProjectSchema, updateStatusSchema } from "./projects.schema";
import {
    createProjectForUser,
    deleteProjectForUser,
    findProjectById,
    findProjects,
    updateProjectForUser,
    updateProjectStatus,
} from "./projects.service";
import { sendRespons } from "../../utils/response";

// req.user is set by authGuard
const getRequester = (req: Request) => ({
    userId: req.user!.userId,
    role: req.user!.role,
});

export async function createProject(req: Request, res: Response, next: NextFunction) {
    try {
        const input = createProjectSchema.parse(req.body);
        const project = await createProjectForUser(req.user!.userId, input);

        return sendRespons(res, {
            statusCode: 201,
            message: "project created successfully",
            data: project
        });
    } catch (err) {
        next(err);
    }
}

export async function getAllProjects(req: Request, res: Response, next: NextFunction) {
    try {
        const query = projectQuerySchema.parse(req.query);
        const { meta, projects } = await findProjects(query, getRequester(req));

        return sendRespons(res, {
            statusCode: 200,
            message: "Projects retrieved successfully",
            meta,
            data: projects
        });
    } catch (err) {
        next(err);
    }
}

export async function getSingleProject(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = projectIdSchema.parse(req.params);
        const project = await findProjectById(id, getRequester(req));

        return sendRespons(res, {
            statusCode: 200,
            message: "Project retrieved successfully",
            data: project
        });
    } catch (err) {
        next(err);
    }
}

export async function updateProject(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = projectIdSchema.parse(req.params);
        const input = updateProjectSchema.parse(req.body);
        const project = await updateProjectForUser(id, getRequester(req), input);

        return sendRespons(res, {
            statusCode: 200,
            message: "Project updated successfully",
            data: project
        });
    } catch (err) {
        next(err);
    }
}

export async function changeProjectStatus(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = projectIdSchema.parse(req.params);
        const input = updateStatusSchema.parse(req.body);
        const project = await updateProjectStatus(id, input);

        return sendRespons(res, {
            statusCode: 200,
            message: `Project marked as ${input.status.toLowerCase()}`,
            data: project
        });
    } catch (err) {
        next(err);
    }
}

export async function deleteProject(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = projectIdSchema.parse(req.params);
        await deleteProjectForUser(id, getRequester(req));

        return sendRespons(res, {
            statusCode: 200,
            message: "Project deleted successfully"
        });
    } catch (err) {
        next(err);
    }
}
