import express from "express"
import { changePassword, login, refreshToken, register } from "../controllers/auth.controller.js";

const router= express.Router();

router.post("/register",register)
router.post("/login",login)
router.post("/refreshToken",refreshToken)
router.patch("/changePassword", changePassword)

export default router
