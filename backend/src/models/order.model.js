import mongoose, { model, Schema } from "mongoose";

const orderSchema=new Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    items:[
        {
            product:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"Product"
            },
            qty:Number,
            price:Number
        }
    ],
    paymentMethod:{
        type:String,
        required:true
    },
    total:{
        type:Number,
        required:true
    }
},
{
    timestamps:true
})

export const Order=model("Order",orderSchema)