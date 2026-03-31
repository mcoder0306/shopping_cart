import express from "express"
import { addProduct, deleteProduct, getProducts, updateProduct } from "../controllers/product.controller.js"
import multer from 'multer'
const upload=multer({dest:"uploads/"})
const router = express.Router()


router.post("/addProduct",upload.single('image'),addProduct);
router.put("/updateProduct/:id",upload.single('image'), updateProduct);
router.delete("/deleteProduct/:id", deleteProduct)
router.get("/getProducts", getProducts)

export default router;