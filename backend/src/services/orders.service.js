import mongoose from "mongoose"
import { Cart } from "../models/cart.model.js"
import { Order } from "../models/order.model.js"
import { Product } from "../models/product.model.js"

const addUserOrder = async (data) => {
    const { user, paymentMethod } = data
    const cart = await Cart.findOne({
        user: new mongoose.Types.ObjectId(user),
        orderStatus: "draft"
    })

    if (!cart || cart.items.length === 0) {
        return { status: 400, message: "Cart is empty or not found!" }
    }

    for (const item of cart.items) {
        const product = await Product.findById(item.product);
        if (!product || product.stock < item.qty) {
            return { status: 400, message: `Insufficient stock for ${product?.title || 'product'}` }
        }
    }

    // Update stock
    for (const item of cart.items) {
        await Product.findByIdAndUpdate(
            item.product,
            {
                $inc: {
                    stock: -item.qty
                }
            }
        )
    }

    const order = await Order.create({
        user: user,
        items: cart.items,
        total: cart.total,
        paymentMethod: paymentMethod
    })

    if (!order) {
        return { status: 500, message: "Something went wrong in creating order!" }
    }

    await Cart.findOneAndDelete({ _id: cart._id })

    return { status: 201, message: "Order created successfully", order: order }
}

const getOrdersOfUser = async (user) => {
    const orders = await Order.find({ user: user }).populate('items.product')
    if (!orders) {
        return { status: 404, message: "orders not found" }
    }
    return { status: 200, message: "orders fetched", orders: orders }
}

export { addUserOrder, getOrdersOfUser }