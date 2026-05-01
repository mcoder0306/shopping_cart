import { model, Schema } from "mongoose";

const categorySchema=new Schema({
    title:{
        type:String,
        required:true,
        unique:true
    },
   
    isActive:{
        type:Boolean,
        default:true
    }
},
{
    timestamps:true
})

export const Category=model("Category",categorySchema)