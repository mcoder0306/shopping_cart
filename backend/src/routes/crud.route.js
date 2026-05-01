import express from "express";
import { getAll, getById, create, update, remove } from "../controllers/crud.controller.js";
import multer from "multer";

const upload = multer({ dest: "uploads/" });
const router = express.Router();

router.get("/:module", getAll);
router.get("/:module/:id", getById);
router.post("/:module", upload.single("image"), create);
router.put("/:module/:id", upload.single("image"), update);
router.delete("/:module/:id", remove);

export default router;
