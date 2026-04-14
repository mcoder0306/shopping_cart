import { model, Schema } from "mongoose";

const addressSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    pincode: {
        type: String,
        required: true
    },
    addressLine: {
        type: String,
        required: true
    },
    label: {
        type: String,
        enum: ['home', 'work', 'other'],
        default: 'home'
    },
    isDefault: {
        type: Boolean,
        default: false
    }
});

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
        addresses: [addressSchema],
        phone: {
            type: String,
        },
        image: {
            type: String
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