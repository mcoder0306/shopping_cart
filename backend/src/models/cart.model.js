import mongoose, { model, Schema } from "mongoose";

const cartSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product"
            },
            qty: {
                type: Number,
            },
            price: {
                type: Number
            }
        }
    ],
    total: {
        type: Number,
        default: 0
    },
    paymentMethod: {
        type: String,
    },
    paymentStatus: {
        type: String,
        enum: ["pending","cancelled","failed","completed"]
    },
    orderStatus: {
        type: String,
        enum: ["draft", "completed"]
    },
    sourceCords: {
        lat: Number,
        lng: Number
    },
    destinationCords: {
        lat: Number,
        lng: Number
    }

},
    {
        timestamps: true
    })

export const Cart = model("Cart", cartSchema)