import express from "express"
import { addCategory, deleteCategory, getAllCategories, updateCategory } from "../controllers/category.controller.js"
import { validate } from "../middlewares/validate.js"
import { addCategoryValidator, deleteCategoryValidator, getAllCategoriesValidator, updateCategoryValidator } from "../validators/category.validator.js"
const router = express.Router()

router.post("/addCategory", validate(addCategoryValidator), addCategory)
router.put("/updateCategory/:id", validate(updateCategoryValidator), updateCategory)
router.delete("/deleteCategory/:id", validate(deleteCategoryValidator), deleteCategory)
router.get("/getAllCategories",validate(getAllCategoriesValidator), getAllCategories)

export default router