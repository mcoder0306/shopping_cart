import express from "express"
import { addOrder, getUserOrders } from "../controllers/order.controller.js"
import { verifyJWT } from "../middlewares/auth.js"
const router = express.Router()

router.post("/addOrder", verifyJWT, addOrder)
router.get("/getUserOrders", verifyJWT, getUserOrders)

export default router
