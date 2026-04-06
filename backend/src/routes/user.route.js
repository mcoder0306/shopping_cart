import express from "express"
import { getUserById, logout, updateDetails } from "../controllers/user.controller.js";
import { validate } from '../middlewares/validate.js'
import { updateDetailsValidator } from "../validators/user.validator.js";
const router = express.Router();

router.post("/logout", logout)
router.get("/getUser", getUserById)
router.patch("/updateDetails", validate(updateDetailsValidator), updateDetails)
//todo: update role route

export default router