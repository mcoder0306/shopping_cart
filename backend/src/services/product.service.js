import mongoose from "mongoose";
import { Product } from "../models/product.model.js";
import { deleteImage } from "../utils/deleteImage.js";
import { Category } from "../models/category.model.js";

const productCreate = async (data) => {
    const { title, description, price, stock, category } = data.info;
    const image = data.image?.path
    const cat = await Category.findById(category)
    if (!cat) {
        return { status: 404, message: "category not found!!" }
    }
    if (!title && !description && !category && !stock && !price && !image) {
        return { status: 422, message: "all fields are required!!" }
    }
    else if (parseInt(price) === 0 && parseInt(stock) === 0) {
        return { status: 422, message: "price and stock cant be 0!!" }
    }
    const existingpro = await Product.findOne({ title: title })
    if (existingpro) {
        return { status: 409, message: "product already exists!!" }
    }
    else {
        const product = await Product.create({
            title,
            description,
            price,
            image,
            stock,
            category
        })
        if (!product) {
            return { status: 500, message: "something went wrong in create product!!" }
        }
        return { status: 201, message: "product created successfully", product: product }
    }
}

const productUpdate = async (data) => {
    if (!mongoose.Types.ObjectId.isValid(data.id)) {
        return { status: 400, message: "invalid id!!" }
    }
    const updateData = {}
    const allowedFields = ["title", "description", "price", "stock", "category"]
    allowedFields.forEach((field) => {
        if (data.body[field] !== undefined) {
            updateData[field] = data.body[field]
        }
    })
    let image;
    if (data.file) {
        image = data.file?.path;
    }
    const product = await Product.findByIdAndUpdate(
        { _id: new mongoose.Types.ObjectId(data.id) },
        {
            $set: updateData
        },
        {
            new: true
        }
    )
    if (!product) {
        return { status: 404, message: "product not found!!" }
    }
    const imagepath = product.image
    if (image) {
        deleteImage(imagepath)
        product.image = image
    }
    await product.save({ validateBeforeSave: false })
    return { status: 200, message: "product updated successfully", product: product }
}

const productDelete = async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return { status: 400, message: "invalid id!!" }
    }
    const deletedproduct = await Product.findByIdAndDelete(id)
    if (!deletedproduct) {
        return { status: 404, message: "product not found!!" }
    }
    deleteImage(deletedproduct.image)
    return { status: 200, message: "product deleted successfully", deletedproduct: deletedproduct }
}

const productsGet = async (data) => {
    const { category, price, query, id } = data
    const filter = {}
    if (category) {
        filter.category = category
    }
    if (id) {
        filter._id = new mongoose.Types.ObjectId(id)
    }
    if (query) {
        filter.$or = [
            { title: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } }
        ]
    }
    if (price) {
        const [min, max] = price.split('-')
        const minprice = parseInt(min)
        const maxprice = parseInt(max)

        filter.price =
        {
            $gte: minprice,
            $lte: maxprice
        }
    }
    const getproducts = await Product.find(filter).populate({ path: 'category', match: { isActive: true } })
    const products = getproducts.filter(p => p.category);
    if (products.length === 0) {
        return { status: 200, message: "no product found!!", products: products }
    }
    return { status: 200, message: "products", products: products }
}

export { productCreate, productUpdate, productDelete, productsGet }