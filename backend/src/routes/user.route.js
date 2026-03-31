import express from "express"
import { getUserById, logout, updateDetails } from "../controllers/user.controller.js";
const router = express.Router();

router.post("/logout", logout)
router.get("/getUser", getUserById)
router.patch("/updateDetails", updateDetails)
//todo: update role route

export default router