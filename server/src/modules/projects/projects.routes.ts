import { Router } from "express";

import { changeProjectStatus, createProject, deleteProject, getAllProjects, getSingleProject, updateProject } from "./projects.controller";
import { authGuard } from "../../middleware/auth.middleware";
import { apiLimit } from "../../middleware/rateLimit.middleware";
import { requireRole } from "../../middleware/auth.role";

const router = Router();

router.post("/", apiLimit, authGuard, requireRole("STUDENT"), createProject);
router.get("/", authGuard, getAllProjects);
router.get("/:id", authGuard, getSingleProject);
router.patch("/:id", authGuard, requireRole("STUDENT"), updateProject);
router.patch("/:id/status", authGuard, requireRole("MENTOR", "ADMIN"), changeProjectStatus);
router.delete("/:id", authGuard, requireRole("STUDENT", "MENTOR", "ADMIN"), deleteProject);

export const projectRoutes = router;