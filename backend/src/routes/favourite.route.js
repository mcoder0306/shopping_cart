import express from "express"
import { addToFavourite, getFavourites } from "../controllers/favourite.controller.js"
const router = express.Router()

router.post("/addTofavourite/:productId", addToFavourite)
router.get("/getFavourites", getFavourites)

export default router