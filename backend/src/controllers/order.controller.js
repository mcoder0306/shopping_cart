import { addUserOrder, getOrdersOfUser } from "../services/orders.service.js";
import { errorResponse, successResponse } from "../utils/response.js";

const addOrder = async (req, res) => {
    try {
        const { paymentMethod } = req.body;
        const user = req?.userId
        const response = await addUserOrder({ paymentMethod: paymentMethod, user: user })
        if (response.status === 200 || response.status === 201) {
            return successResponse(res, response.status, response.message, response.order)
        }
        else {
            return errorResponse(res, response.status, response.message)
        }
    } catch (error) {
        return errorResponse(res, 400, "error in adding order", error)
    }
}

const getUserOrders = async (req, res) => {
    try {
        const response = await getOrdersOfUser(req.userId)
        if (response.status === 200) {
            return successResponse(res, response.status, response.message, response.orders)
        }
        else {
            return errorResponse(res, response.status, response.message)
        }

    } catch (error) {
        return errorResponse(res, 400, "error in getting user orders", error)
    }
}

export { addOrder, getUserOrders }