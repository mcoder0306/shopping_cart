import { getData, getOrderById as getOrderByIdService } from "../services/dashboard.service.js"
import { errorResponse, successResponse } from "../utils/response.js"

const getDashboardData = async (req, res) => {
    try {
        const response = await getData(req?.userId)
        if (response.status === 200) {
            return successResponse(res, response.status, response.message, response.data)
        }
        else {
            return errorResponse(res, response.status, response.message)
        }
    } catch (error) {
        return errorResponse(res, 400, "error in getting dashboard data", error)
    }
}

const getOrderById = async (req, res) => {
    try {
        const response = await getOrderByIdService(req?.userId, req.params.id)
        if (response.status === 200) {
            return successResponse(res, response.status, response.message, response.data)
        }
        else {
            return errorResponse(res, response.status, response.message)
        }
    } catch (error) {
        return errorResponse(res, 400, "error in getting order data", error)
    }
}

export { getDashboardData, getOrderById }