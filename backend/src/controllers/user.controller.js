import { getUser, updateUserDetails } from "../services/user.service.js";
import { errorResponse, successResponse } from "../utils/response.js";

const logout = async (req, res) => {
    try {
        res.clearCookie("accessToken").clearCookie("refreshToken")
        return successResponse(res, 200, "loggedout successfully!!")
    } catch (error) {
        return errorResponse(res, 400, "error in logout", error)
    }
}


const updateDetails = async (req, res) => {
    try {
        const { name } = req.body;
        const response = await updateUserDetails({ id: req.userId, name: name })
        if (response.status === 200) {
            return successResponse(res, response.status, response.message, response.user)
        }
        else {
            return errorResponse(res, response.status, response.message)
        }
    } catch (error) {
        return errorResponse(res, 400, "error in update details", error)
    }
}

const getUserById = async (req, res) => {
    try {
        const response = await getUser(req.userId)
        if (response.status === 200) {
            return successResponse(res, response.status, response.message, response.user)
        }
        else {
            return errorResponse(res, response.status, response.message)
        }
    } catch (error) {
        return errorResponse(res, 400, "error in getuser", error)
    }
}

export { logout, updateDetails, getUserById }