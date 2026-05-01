import express from "express"
import { verifyJWT } from "../middlewares/auth.js"
import { createEntry, getEntries, getEntryById, updateEntry, deleteEntry, getAdminConfigs } from "../controllers/admin.controller.js";
const router = express.Router()

import multer from "multer";
const upload = multer({ dest: "uploads/" });

router.get("/configs/list", verifyJWT, getAdminConfigs);
router.post("/:name", verifyJWT, upload.single("image"), createEntry);
router.get("/:name", verifyJWT, getEntries);
router.get("/:name/:id", verifyJWT, getEntryById);
router.put("/:name/:id", verifyJWT, upload.single("image"), updateEntry);
router.delete("/:name/:id", verifyJWT, deleteEntry);

export default router
