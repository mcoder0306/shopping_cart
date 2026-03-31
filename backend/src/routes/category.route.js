import express from "express"
import { addCategory, deleteCategory, getAllCategories, updateCategory } from "../controllers/category.controller.js"
const router = express.Router()

router.post("/addCategory", addCategory)
router.put("/updateCategory/:id", updateCategory)
router.delete("/deleteCategory/:id", deleteCategory)
router.get("/getAllCategories", getAllCategories)

export default router