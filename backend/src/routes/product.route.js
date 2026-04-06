import express from "express"
import { addProduct, deleteProduct, getProducts, updateProduct } from "../controllers/product.controller.js"
import multer from 'multer'
import { validate } from '../middlewares/validate.js'
import { addProductValidator, deleteProductValidator, getProductsValidator, updateProductValidator } from "../validators/product.validator.js"
const upload = multer({ dest: "uploads/" })
const router = express.Router()


router.post("/addProduct", upload.single('image'), validate(addProductValidator), addProduct);
router.put("/updateProduct/:id", upload.single('image'), validate(updateProductValidator), updateProduct);
router.delete("/deleteProduct/:id", validate(deleteProductValidator), deleteProduct)
router.get("/getProducts",validate(getProductsValidator), getProducts)

export default router;