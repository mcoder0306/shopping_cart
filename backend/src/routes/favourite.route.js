import express from "express"
import { addToFavourite, getFavourites } from "../controllers/favourite.controller.js"
import { validate } from "../middlewares/validate.js"
import { addToFavouriteValidator } from "../validators/favourite.validator.js"
const router = express.Router()

router.post("/addTofavourite/:productId",validate(addToFavouriteValidator), addToFavourite)
router.get("/getFavourites", getFavourites)

export default router