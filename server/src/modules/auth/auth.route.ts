import { Router } from "express";
import { signupUser } from "./auth.service";
import { login, logout, refresh, signup } from "./auth.controller";

const router = Router()

router.post("/signup", signup)
router.post("/login", login)
router.post("/refresh", refresh)
router.post("/logout", logout)

export const authRoutes = router;