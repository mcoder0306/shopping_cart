import mongoose, { model, Schema } from "mongoose";

const favouriteSchema = new Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    },
    {
        timestamps: true
    })

export const Favourite = model("Favourite", favouriteSchema)