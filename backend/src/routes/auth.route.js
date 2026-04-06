import express from "express"
import { changePassword, login, refreshToken, register } from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validate.js";
import { changePasswordValidator, loginValidator, registerValidator } from "../validators/auth.validator.js";

const router = express.Router();

router.post("/register", validate(registerValidator), register)
router.post("/login",validate(loginValidator), login)
router.post("/refreshToken", refreshToken)
router.patch("/changePassword",validate(changePasswordValidator), changePassword)

export default router
