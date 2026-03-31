import express from "express"
import { verifyJWT } from "../middlewares/auth.js"
import { getDashboardData } from "../controllers/dashboard.controller.js"
const router = express.Router()

router.get("/getDashboardData",verifyJWT,getDashboardData)

export default router
