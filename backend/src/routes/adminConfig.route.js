import express from "express"
import { verifyJWT } from "../middlewares/auth.js"
import { getAdminConfig, getAllAdminConfigs } from "../controllers/adminConfig.controller.js";
const router = express.Router()

router.get("/:name", getAdminConfig);
router.get("/", getAllAdminConfigs);

export default router
