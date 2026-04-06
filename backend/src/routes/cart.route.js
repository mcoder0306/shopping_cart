import express from "express"
import { addToCart, deleteFromCart, getCart, getOrderCords, mergeCart, updateCartStatus } from "../controllers/cart.controller.js"
import { optionalJWT } from "../middlewares/optionalAuth.js"
import { verifyJWT } from "../middlewares/auth.js"
import { validate } from "../middlewares/validate.js"
import { addTocartValidator, deleteFromCartValidator, getCartValidator, getOrderCordsValidator, mergeCartValidator, updateCartStatusValidator } from "../validators/cart.validator.js"
const router = express.Router()

router.post("/addToCart/:productId", optionalJWT, validate(addTocartValidator), addToCart)
router.delete("/deleteFromCart/:productId", validate(deleteFromCartValidator), optionalJWT, deleteFromCart)
router.get("/getCart/:status", optionalJWT, validate(getCartValidator), getCart)
router.post("/mergeCart", verifyJWT, validate(mergeCartValidator), mergeCart)
router.post("/updateCart", verifyJWT, validate(updateCartStatusValidator), updateCartStatus)
router.get("/getOrderCords/:orderId", verifyJWT,validate(getOrderCordsValidator), getOrderCords)
export default router