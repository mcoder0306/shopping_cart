import { addProductToFavourite, getFavouriteProducts } from "../services/favourite.service.js"
import { errorResponse, successResponse } from "../utils/response.js"

const addToFavourite = async (req, res) => {
    try {
        const { productId } = req.params
        const userId = req.userId
        const response = await addProductToFavourite({ productId: productId, userId: userId })
        if (response.status === 201 || response.status === 200) {
            return successResponse(res, response.status, response.message, response.favourite)
        }
        else {
            return errorResponse(res, response.status, response.message)
        }

    } catch (error) {
        return errorResponse(res, 400, "error in add to favourite!!", error)
    }
}

const getFavourites = async (req, res) => {
    try {
        const userId = req.userId;
        const response = await getFavouriteProducts(userId)
        if (response.status === 200) {
            return successResponse(res, response.status, response.message, response.favourites)
        }
        else {
            return errorResponse(res, response.status, response.message)
        }
    } catch (error) {
        return errorResponse(res, 400, "error in getting favourites!!", error)
    }
}
export { addToFavourite, getFavourites }