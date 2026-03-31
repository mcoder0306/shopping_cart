import express from "express"
import { addToCart, deleteFromCart, getCart, getOrderCords, mergeCart, updateCartStatus } from "../controllers/cart.controller.js"
import { optionalJWT } from "../middlewares/optionalAuth.js"
import { verifyJWT } from "../middlewares/auth.js"
const router = express.Router()

router.post("/addToCart/:productId", optionalJWT, addToCart)
router.delete("/deleteFromCart/:productId/:userId", deleteFromCart)
router.get("/getCart/:status",optionalJWT, getCart)
router.post("/mergeCart",verifyJWT, mergeCart)
router.post("/updateCart",verifyJWT,updateCartStatus)
router.get("/getOrderCords/:orderId",verifyJWT,getOrderCords)
export default router