import mongoose from "mongoose";
import { Category } from "../models/category.model.js";
import { Product } from "../models/product.model.js";

const categorAdd = async (data) => {
    const { title } = data;
    if (!title) {
        return { status: 422, message: "category name is required!!" }
    }
    const existingcat = await Category.findOne({ title: title })
    if (existingcat) {
        return { status: 409, message: "category already exists!!" }
    }
    const category = await Category.create({
        title,
        isActive: true
    })
    if (!category) {
        return { status: 500, message: "something went wrong in create category" }
    }
    return { status: 201, message: "category added successfully", category: category }
}

const categoryUpdate = async (data) => {
    let updateData = {}
    const allowedFields = ["title", "isActive"];

    if (!mongoose.Types.ObjectId.isValid(data.id)) {
        return { status: 400, message: "invalid id!!" }
    }

    allowedFields.forEach(field => {
        if (data.body[field] !== undefined) {
            updateData[field] = data.body[field]
        }
    });

    const category = await Category.findByIdAndUpdate(
        { _id: new mongoose.Types.ObjectId(data.id) },
        {
            $set: updateData
        },
        {
            new: true,
            runValidators: true
        }
    )
    if (!category) {
        return { status: 404, message: "category not found!!" }
    }
    return { status: 200, message: "category updated successfully", category: category }
}

const categoryDelete = async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return { status: 422, message: "invalid id!!" }
    }
    await Product.deleteMany({ category: new mongoose.Types.ObjectId(id) })
    const deletedcat = await Category.findByIdAndDelete(id)
    if (!deletedcat) {
        return { status: 500, message: "category not found" }
    }
    return { status: 200, message: "category deleted successfully", category: deletedcat }
}

const categoryGet = async (data) => {
    const { id } = data
    const filter = {}
    if (id) {
        filter._id = new mongoose.Types.ObjectId(id)
    }
    const categories = await Category.find(filter)
    if (!categories) {
        return { status: 404, message: "categories not found!!" }
    }
    return { status: 200, message: "categories", categories: categories }
}

export { categorAdd, categoryDelete, categoryUpdate, categoryGet }