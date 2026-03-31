import { User } from "../models/user.model.js";
import { changeUserPassword, loginUser, refreshAccessToken, registerUser } from "../services/auth.service.js";
import { errorResponse, successResponse } from "../utils/response.js";
import jwt from "jsonwebtoken"


const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
}

const register = async (req, res) => {
    try {
        const response = await registerUser(req.body)
        if (response.status === 201) {
            return res.status(response.status)
                .cookie("refreshToken", response.refreshToken, options)
                .cookie("accessToken", response.accessToken, options)
                .json({ message: response.message, data: response.createdUser })
        }
        else {
            return errorResponse(res, response.status, response.message)
        }
    } catch (error) {
        if (error.code === 11000) {
            return errorResponse(res, 409, "email already exists!!")
        }
        else {
            return errorResponse(res, 400, "error in register user", error)
        }
    }
}

const login = async (req, res) => {
    try {
        const response = await loginUser(req.body)
        if (response.status === 200) {
            return res.status(response.status)
                .cookie("refreshToken", response.refreshToken, options)
                .cookie("accessToken", response.accessToken, options)
                .json({ message: response.message, data: response.finduser })
        }
        else {
            return errorResponse(res, response.status, response.message)
        }
    } catch (error) {
        return errorResponse(res, 400, "error in login", error)
    }
}

const refreshToken = async (req, res) => {
    try {
        const token = req.cookies.refreshToken
        if(!token){
            return errorResponse(res,400,"no refresh token token!!")
        }        
        const response = await refreshAccessToken(token)
        if (response.status === 200) {
            res.status(response.status)
                .cookie("refreshToken", response.refreshToken, options)
                .cookie("accessToken", response.accessToken, options)
                .json({ message: response.message })
        }
        else {
            return errorResponse(res, response.status, response.message)
        }

    } catch (error) {
        return errorResponse(res, 400, "invalid or expired refresh token", error)
    }
}

const changePassword = async (req, res) => {
    try {
        const response = await changeUserPassword(req.body)
        if (response.status === 200) {
            return successResponse(res, response.status, response.message, response.user)
        }
        else {
            return errorResponse(res, response.status, response.message)
        }
    } catch (error) {
        return errorResponse(res, 400, "error in changepassword", error)
    }
}


export { register, login, refreshToken, changePassword }