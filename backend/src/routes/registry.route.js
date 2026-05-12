import express from "express";
import { getModuleConfig, getSidebarModules, syncRegistryController } from "../controllers/registry.controller.js";

const router = express.Router();

router.post("/syncRegistry", syncRegistryController);

router.get("/getSidebarModules", getSidebarModules);

router.get("/getModuleConfig/:modelName", getModuleConfig);

export default router;