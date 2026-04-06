import { addProductToCart, deletProductFromCart, getCords, getUserCart, mergeGuestCart, updateCart } from "../services/cart.service.js";
import { errorResponse, successResponse } from "../utils/response.js";

const addToCart = async (req, res) => {
    //make changes for guest user and auth user
    try {
        const { productId } = req.params;
        const { qty, price } = req.body;
        const response = await addProductToCart({ userId: req?.userId, items: [{ productId: productId, qty: qty, price: price }] })
        if (response.status === 201 || response.status === 200) {
            return successResponse(res, response.status, response.message, response.cart)
        }
        else {
            return errorResponse(res, response.status, response.message)
        }
    } catch (error) {
        return errorResponse(res, 400, "error in add to cart", error)
    }

}

const deleteFromCart = async (req, res) => {
    try {
        const { productId } = req.params
        const userId=req?.userId
        const response = await deletProductFromCart({ productId: productId, userId: userId })
        if (response.status === 200) {
            return successResponse(res, response.status, response.message, response.cart)
        }
        else {
            return errorResponse(res, response.status, response.message)
        }
    } catch (error) {
        return errorResponse(res, 400, "error in delete cart", error)
    }
}

const getCart = async (req, res) => {
    try {
        const userId = req?.userId;
        const { status } = req.params;
        const response = await getUserCart({ userId: userId, status: status })
        if (response.status === 200) {
            return successResponse(res, response.status, response.message, response.cart)
        }
        else {
            return errorResponse(res, response.status, response.message)
        }
    } catch (error) {
        return errorResponse(res, 400, "error in get cart", error)
    }
}

const mergeCart = async (req, res) => {
    try {
        const { items } = req.body;
        const userId = req?.userId;
        const response = await mergeGuestCart({ items: items, userId: userId })
        if (response.status === 200 || response.status === 201) {
            return successResponse(res, response.status, response.message, response.cart)
        }
        else {
            return errorResponse(res, response.status, response.message)
        }
    } catch (error) {
        return errorResponse(res, 400, "error in adding to guest cart", error)
    }
}

const updateCartStatus = async (req, res) => {
    try {
        const userId = req.userId
        const response = await updateCart({ userId: userId, body: req.body })
        if (response.status === 200 || response.status === 201) {
            return successResponse(res, response.status, response.message, response.cart)
        }
        else {
            return errorResponse(res, response.status, response.message)
        }
    } catch (error) {
        return errorResponse(res, 400, "error in updating cart", error)
    }
}

const getOrderCords = async (req, res) => {
    try {
        const orderId = req.params
        const response = await getCords(orderId)
        if (response.status === 200) {
            return successResponse(res, response.status, response.message, response.cords)
        }
        else {
            return errorResponse(res, response.status, response.message)
        }
    } catch (error) {
        return errorResponse(res, 400, "error in getting cords", error)
    }
}


export { addToCart, deleteFromCart, getCart, mergeCart, updateCartStatus, getOrderCords }