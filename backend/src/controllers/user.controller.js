import { addUserAddress, deleteUserAddress, deleteUserProfileImage, getUser, getUserAddresses, updateUserAddress, updateUserDetails } from "../services/user.service.js";
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
        const response = await updateUserDetails({ id: req.userId, data: req.body, file: req.file })
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

const addAddress = async (req, res) => {
    try {
        const id = req.userId;
        const response = await addUserAddress({ id: id, body: req.body })
        if (response.status === 201) {
            return successResponse(res, response.status, response.message, response.user)
        }
        else {
            return errorResponse(res, response.status, response.message)
        }

    } catch (error) {
        return errorResponse(res, 400, "error in add address", error)
    }
}

const updateAddress = async (req, res) => {
    try {
        const userId = req.userId;
        const { addressId } = req.params
        const response = await updateUserAddress({ userId: userId, addressId: addressId, body: req.body })
        if (response.status === 200) {
            return successResponse(res, response.status, response.message, response.addresses)
        }
        else {
            return errorResponse(res, response.status, response.message)
        }

    } catch (error) {
        return errorResponse(res, 400, "error in update address", error)
    }
}

const deleteAddress = async (req, res) => {
    try {
        const userId = req.userId;
        const { addressId } = req.params
        const response = await deleteUserAddress({ userId: userId, addressId: addressId })
        if (response.status === 200) {
            return successResponse(res, response.status, response.message, response.addresses)
        }
        else {
            return errorResponse(res, response.status, response.message)
        }

    } catch (error) {
        return errorResponse(res, 400, "error in delete address", error)
    }
}

const getAllAddresses = async (req, res) => {
    try {
        const userId = req.userId;
        const response = await getUserAddresses(userId)
        if (response.status === 200) {
            return successResponse(res, response.status, response.message, response.addresses)
        }
        else {
            return errorResponse(res, response.status, response.message)
        }

    } catch (error) {
        return errorResponse(res, 400, "error in getting addresses", error)
    }
}

const deleteProfileImage = async (req, res) => {
    try {
        const response = await deleteUserProfileImage(req.userId)
        if (response.status === 200) {
            return successResponse(res, response.status, response.message, response.user)
        } else {
            return errorResponse(res, response.status, response.message)
        }
    } catch (error) {
        return errorResponse(res, 400, "error deleting profile image", error)
    }
}

export { logout, updateDetails, getUserById, addAddress, updateAddress, deleteAddress, getAllAddresses, deleteProfileImage }