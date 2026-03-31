import { Router } from "express";
import { createpaymetIntent } from "../controllers/payment.controller.js";

const router=Router()

router.post("/create-payment-intent",createpaymetIntent)

export default router