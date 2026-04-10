import { model, Schema } from "mongoose";

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        address: {
            type: String,
        },
        phone: {
            type: String,
        },
        isActive: {
            type: Boolean,
            default: true
        },
        isAdmin: {
            type: Boolean,
            default: false
        },
        refreshToken: {
            type: String,
        },

    },
    {
        timestamps: true
    })

export const User = model("User", userSchema);