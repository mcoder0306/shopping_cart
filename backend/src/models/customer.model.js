import { model, Schema } from "mongoose";

const customerSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        unique: true
    },

    isActive: {
        type: Boolean,
        default: true
    }
},
    {
        timestamps: true
    })

export const Customer = model("Customer", customerSchema)