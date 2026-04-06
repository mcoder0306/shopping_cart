import { Router } from "express";
import { createpaymetIntent } from "../controllers/payment.controller.js";
import { validate } from "../middlewares/validate.js";
import { createpaymetIntentValidator } from "../validators/payment.validator.js";

const router = Router()

router.post("/create-payment-intent", validate(createpaymetIntentValidator), createpaymetIntent)

export default router