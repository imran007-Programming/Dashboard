import { Router } from "express";
import { authRoutes } from "../modules/auth/auth.route";
import { projectRoutes } from "../modules/projects/projects.routes";

const router = Router()

const moduleRoutes = [
    { path: "/auth", route: authRoutes },
    { path: "/project", route: projectRoutes }
]

moduleRoutes.forEach(({ path, route }) => {
    router.use(path, route)
})

export default router;