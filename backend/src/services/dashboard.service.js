import { Cart } from "../models/cart.model.js"
import { Category } from "../models/category.model.js"
import { Order } from "../models/order.model.js"
import { Product } from "../models/product.model.js"
import { User } from "../models/user.model.js"

const getData = async (userId) => {
    //get user
    const user = await User.findById(userId)
    //if isAdmin false then show error
    if (!user.isAdmin) {
        return { status: 401, message: "you dont have access to this page!!" }
    }
    //else show data 
    //get orders,categories,products
    const categories = await Category.find()
    if (!categories) {
        return { status: 500, message: "something went wrong in getting categories" }
    }
    const products = await Product.find().populate("category").sort({ createdAt: -1 })
    if (!products) {
        return { status: 500, message: "something went wrong in getting products" }
    }
    const orders = await Cart.find().populate('items.product').populate('user').sort({ createdAt: -1 });
    if (!orders) {
        return { status: 500, message: "something went wrong in getting orders" }
    }
    const totalRevenue = orders.reduce((total, order) => {
        return total += order.total
    }, 0)
    const users = await User.find({ isAdmin: false }).sort({ createdAt: -1 })
    return {
        status: 200, message: "dashboard data", data: {
            catcount: categories.length,
            productcount: products.length,
            ordercount: orders.length,
            customercount: users.length,
            totalRevenue: totalRevenue,
            categories: categories,
            products: products,
            orders: orders,
            users: users
        }
    }

}
const getOrderById = async (userId, orderId) => {
    const user = await User.findById(userId)
    if (!user.isAdmin) {
        return { status: 401, message: "you dont have access to this page!!" }
    }

    const order = await Cart.findById(orderId).populate('items.product').populate('user');
    if (!order) {
        return { status: 404, message: "order not found" }
    }

    return { status: 200, message: "order fetched", data: order }
}

export { getData, getOrderById }