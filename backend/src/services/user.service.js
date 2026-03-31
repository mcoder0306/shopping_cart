import { User } from "../models/user.model.js";

const getUser = async (data) => {
    const id = data;
    const user = await User.findById(id).select("-password -refreshToken");
    if (!user) {
        return { status: 404, message: "user not found!!" }
    }
    return { status: 200, user: user, message: "user fetched successfully" }
}

const updateUserDetails = async (data) => {
    if (!data.name) {
        return { status: 422, message: "name cant be blank!!" }
    }
    const user = await User.findById(data.id).select("-password -refreshToken")
    if (!user) {
        return { status: 404, message: "user not found!!" }
    }
    user.name = data.name
    await user.save({ validateBeforeSave: false })
    return { status: 200, message: "user details updated successfully", user: user }
}

export { getUser, updateUserDetails }