import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const generateTokens = (user) => {
    const id = user._id ? user._id : user.id
    const accessToken = jwt.sign(
        { id: id, name: user.name },
        process.env.ACCESS_SECRET,
        { expiresIn: "15m" }
    )

    const refreshToken = jwt.sign(
        { id: id, name: user.name },
        process.env.REFRESH_SECRET,
        { expiresIn: "7d" }
    )

    return { accessToken, refreshToken }
}

const registerUser = async (data) => {
    const { name, email, password } = data;
    if (!name || !email || !password) {
        return { status: 422, message: "all fields are required!!" }
    }
    const existingUser = await User.findOne({
        $or: [
            { name: name },
            { email: email }
        ]
    })
    if (existingUser) {
        return { status: 409, message: "user already exists with this name or email!!" }
    }
    const hashPass = await bcrypt.hash(password, 10)
    const user = await User.create({
        name,
        email,
        password: hashPass,
        isAdmin: false
    })
    if (!user) {
        return { status: 500, message: "something went wrong in create user" }
    }
    const { accessToken, refreshToken } = generateTokens(user)
    user.refreshToken = refreshToken
    await user.save({ validateBeforeSave: false })

    const createdUser = await User.findById(user._id).select("-password -refreshToken")
    if (!createdUser) {
        return { status: 404, message: "user not found!!" }
    }

    return { refreshToken: refreshToken, accessToken: accessToken, createdUser: createdUser, status: 201, message: "user registration successfull" }
}

const loginUser = async (data) => {
    const { email, password } = data
    if (!email || !password) {
        return { status: 422, message: "all fields are required!!" }
    }
    const user = await User.findOne({ email: email })
    if (!user) {
        return { status: 404, message: "user not found!!" }
    }
    const verifyPassword = await bcrypt.compare(password, user.password);

    if (!verifyPassword) {
        return { status: 400, message: "invalid password!!" }
    }

    const { accessToken, refreshToken } = generateTokens(user)
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    const finduser = await User.findById(user._id).select("-password -refreshToken")
    return { status: 200, message: "user login successfull", finduser: finduser, refreshToken: refreshToken, accessToken: accessToken }
}

const refreshAccessToken = async (token) => {
    if (!token) {
        return { status: 401, message: "No refresh token" };
    }

    let decoded;
    try {
        decoded = jwt.verify(token, process.env.REFRESH_SECRET);
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            return { status: 401, message: "Refresh token expired. Login again." };
        }
        return { status: 403, message: "Invalid refresh token" };
    }

    const foundUser = await User.findById(decoded.id);

    if (!foundUser) {
        return { status: 404, message: "User not found" };
    }

    if (foundUser.refreshToken !== token) {
        return { status: 403, message: "Refresh token mismatch" };
    }

    const { accessToken, refreshToken } = generateTokens(foundUser);

    foundUser.refreshToken = refreshToken;
    await foundUser.save({ validateBeforeSave: false });


    return {
        status: 200,
        message: "token refreshed successfully",
        accessToken,
        refreshToken
    };
};

const changeUserPassword = async (data) => {
    const { email, oldPassword, newPassword } = data;

    const user = await User.findOne({ email: email })
    if (!user) {
        return { status: 404, message: "user not found" }
    }
    const comppass = await bcrypt.compare(oldPassword, user.password)
    if (!comppass) {
        return { status: 422, message: "incorrect old password!!" }
    }
    const hashpass = await bcrypt.hash(newPassword, 10)
    user.password = hashpass;
    await user.save({ validateBeforeSave: false })
    return { status: 200, message: "password changed successfully", user: user }
}

export { registerUser, loginUser, refreshAccessToken, changeUserPassword }