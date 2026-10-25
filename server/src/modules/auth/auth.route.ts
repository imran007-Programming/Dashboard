import { Router } from "express";
import { signupUser } from "./auth.service";
import { login, logout, refresh, signup } from "./auth.controller";
import { loginLimit, signupLimit } from "../../middleware/rateLimit.middleware";

const router = Router()

router.post("/signup", signupLimit, signup)
router.post("/login", loginLimit, login)
router.post("/refresh", refresh)
router.post("/logout", logout)

export const authRoutes = router;