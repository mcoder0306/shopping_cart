import express from "express";

import {
    getAllData,
    getSingleData,
    createData,
    updateData,
    deleteData
} from "../controllers/dynamic.controller.js";
import multer from "multer";

const upload = multer({ dest: "uploads/" });
const router = express.Router();

router.get("/:modelName", getAllData);
router.get("/:modelName/:id", getSingleData);
router.post("/:modelName", upload.single('image'), createData);
router.put("/:modelName/:id", upload.single('image'), updateData);
router.delete("/:modelName/:id", deleteData);

export default router;