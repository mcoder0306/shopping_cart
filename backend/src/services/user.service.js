import { User } from "../models/user.model.js";
import mongoose from "mongoose";
import { deleteImage } from "../utils/deleteImage.js";

const getUser = async (data) => {
    const id = data;
    const user = await User.findById(id).select("-password -refreshToken");
    if (!user) {
        return { status: 404, message: "user not found!!" }
    }
    return { status: 200, user: user, message: "user fetched successfully" }
}

const updateUserDetails = async (params) => {
    const { id, data, file } = params;
    const { name, phone } = data || {};
    const updateData = {}

    if (name !== undefined) {
        updateData.name = name;
    }

    if (phone !== undefined) {
        updateData.phone = phone;
    }

    const user = await User.findById(id);
    if (!user) {
        return { status: 404, message: "user not found!!" }
    }

    if (file) {
        if (user.image) {
            await deleteImage(user.image);
        }
        updateData.image = file.path;
    }

    const updatedUser = await User.findByIdAndUpdate(
        id,
        {
            $set: updateData
        },
        {
            new: true
        }
    ).select("-password -refreshToken");

    return { status: 200, message: "user details updated successfully", user: updatedUser }
}

const deleteUserProfileImage = async (id) => {
    const user = await User.findById(id);
    if (!user) {
        return { status: 404, message: "user not found!!" }
    }
    if (!user.image) {
        return { status: 400, message: "No profile image to delete" }
    }
    await deleteImage(user.image);
    const updatedUser = await User.findByIdAndUpdate(
        id,
        { $set: { image: null } },
        { new: true }
    ).select("-password -refreshToken");
    return { status: 200, message: "profile image deleted successfully", user: updatedUser }
}

const addUserAddress = async (data) => {
    const user = await User.findById(data.id).select("-password -refreshToken");
    if (!user) {
        return { status: 404, message: "user not found!!" }
    }
    const newAddress = data.body
    if (user.addresses.length === 0) {
        newAddress.isDefault = true
    }
    user.addresses.push(newAddress)
    await user.save()
    return { status: 201, message: "address added successfully", user: user }
}

const updateUserAddress = async (data) => {
    const user = await User.findById(data.userId).select("-password -refreshToken");
    if (!user) {
        return { status: 404, message: "user not found!!" }
    }

    const addressIndex = user.addresses.findIndex(
        addr => addr._id.toString() === data.addressId
    );
    if (addressIndex === -1) {
        return { status: 404, message: "Address not found" };
    }

    const updateData = data.body;
    if (updateData.isDefault) {
        user.addresses = user.addresses.map(addr => ({
            ...addr.toObject(),
            isDefault: false
        }));
    }

    user.addresses[addressIndex] = {
        ...user.addresses[addressIndex].toObject(),
        ...updateData
    };

    const hasDefault = user.addresses.some(addr => addr.isDefault);
    if (!hasDefault && user.addresses.length > 0) {
        user.addresses[0].isDefault = true;
    }

    await user.save();
    return { status: 200, message: "address updated successfully", addresses: user.addresses }
}

const deleteUserAddress = async (data) => {
    const user = await User.findById(data.userId).select("-password -refreshToken");
    if (!user) {
        return { status: 404, message: "user not found!!" }
    }

    const addressIndex = user.addresses.findIndex(
        addr => addr._id.toString() === data.addressId
    );
    if (addressIndex === -1) {
        return { status: 404, message: "Address not found" };
    }

    const deleted = user.addresses[addressIndex]
    user.addresses.splice(addressIndex, 1)

    // If deleted was default → assign new default
    if (deleted?.isDefault && user.addresses.length > 0) {
        user.addresses[0].isDefault = true;
    }

    await user.save();

    return { status: 200, message: "address deleted successfully", addresses: user.addresses }
}

const getUserAddresses = async (userId) => {
    const user = await User.findById(userId).select("addresses");
    if (!user) {
        return { status: 404, message: "user not found!!" }
    }
    const addresses = user.addresses.sort((a, b) => b.isDefault - a.isDefault);
    return { status: 200, message: "address fetched successfully", addresses: addresses }
}

export { getUser, updateUserDetails, deleteUserProfileImage, addUserAddress, updateUserAddress, deleteUserAddress, getUserAddresses }