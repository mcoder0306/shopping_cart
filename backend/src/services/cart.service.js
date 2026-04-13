import mongoose from "mongoose";
import { Cart } from "../models/cart.model.js";
import { User } from "../models/user.model.js"
import { Product } from "../models/product.model.js";

const addProductToCart = async (data) => {
    //check for existing usercart
    const existingCart = await Cart.findOne(
        {
            $and: [
                { user: data?.userId },
                { orderStatus: "draft" }
            ]
        }
    )
    if (existingCart) {
        //check if existing cart then for existing product
        for (const dataitem of data.items) {
            const product = await Product.findById(dataitem.productId);
            if (!product) {
                return { status: 404, message: "product not found!!" }
            }
            const existingProduct = existingCart.items.find((item) => (
                item.product.equals(new mongoose.Types.ObjectId(dataitem.productId))
            ))
            if (existingProduct) {
                //if product already in cart check if qty received is 0 then delete from cart

                if (dataitem.qty === 0) {
                    existingCart.items = existingCart.items.filter((item) => (
                        item.product.toString() !== dataitem.productId
                    ))
                }
                //if qty received non 0 then update qty
                else {
                    existingProduct.qty = dataitem.qty
                }
            }
            //if product is not there in cart add that product 
            else {
                existingCart.items.push({ product: dataitem.productId, qty: dataitem.qty, price: dataitem.price })
            }
        }


        existingCart.total = existingCart.items.reduce(
            (acc, item) => acc + item.qty * item.price,
            0
        );

        await existingCart.save({ validateBeforeSave: false })
        await existingCart.populate({ path: 'items.product', populate: { path: 'category' } })
        return { status: 201, message: "product added to cart", cart: existingCart }
    }
    //if usercart is not already there create one
    else {
        if (data.items[0].qty === 0) {
            return { status: 422, message: "qty cant be 0!!" }
        }
        const newCart = await Cart.create({
            user: data?.userId,
            items: [{ product: data.items[0].productId, qty: data.items[0].qty, price: data.items[0].price }],
            total: data.items[0].price,
            paymentStatus: "pending",
            orderStatus: "draft"
        })

        if (!newCart) {
            return { status: 500, message: "something went wrong in new cart" }
        }
        await newCart.populate({ path: 'items.product', populate: { path: 'category' } })
        return { status: 201, message: "product added to cart", cart: newCart }
    }
}

const deletProductFromCart = async (data) => {
    if (!mongoose.Types.ObjectId.isValid(data.productId)) {
        return { status: 400, message: "invalid id!!" }
    }
    const cartId = await Cart.findOne(
        { $and: [{ user: data.userId }, { orderStatus: "draft" }] }
    )
    const cart = await Cart.findByIdAndUpdate(
        cartId._id,
        {
            $pull: {
                items: {
                    product: data.productId
                }
            }
        },
        { new: true }
    );
    if (!cart) {
        return { status: 500, message: "something went wrong in deleting from cart!!" }
    }
    let total = 0
    for (let item of cart.items) {
        total += item.price * item.qty
    }
    cart.total = total
    await cart.save({ validateBeforeSave: false })
    await cart.populate({ path: 'items.product', populate: { path: 'category' } })
    return { status: 200, message: "product removed from cart", cart: cart }
}

const getUserCart = async (data) => {
    if (!mongoose.Types.ObjectId.isValid(data.userId)) {
        return { status: 400, message: "invalid id!!" }
    }
    const user = await User.findById(data.userId);
    if (!user) {
        return { status: 404, message: "user not found!!" }
    }
    const query = {
        $and: [
            { user: data.userId },
            { orderStatus: data.status }
        ]
    };
    const cart = data.status === 'draft'
        ? await Cart.findOne(query).populate({ path: 'items.product', populate: { path: 'category' } })
        : await Cart.find(query).populate({ path: 'items.product', populate: { path: 'category' } });

    if (!cart || (Array.isArray(cart) && cart.length === 0)) {
        return { status: 200, message: "empty cart", cart: data.status === 'draft' ? { items: [] } : [] }
    }
    return { status: 200, message: "cart", cart: cart }
}

const mergeGuestCart = async (data) => {
    let cart = await Cart.findOne({
        $and: [
            { user: data.userId },
            { orderStatus: "draft" }
        ]
    }
    )
    const total = data.items.reduce((total, item) => {
        return total + (item.price * item.qty)
    }, 0)
    if (!cart) {
        cart = await Cart.create({
            user: data.userId,
            items: data.items,
            total: total,
            paymentStatus: "pending",
            orderStatus: "draft"
        })
    }
    else {
        data.items.forEach((cartitem) => {
            const existingItem = cart.items.find(
                item => item.product.equals(new mongoose.Types.ObjectId(cartitem.product))
            )
            if (existingItem) {
                existingItem.qty += cartitem.qty
            }
            else {
                cart.items.push(cartitem)
            }
        })
    }
    cart.total = cart.items.reduce((acc, item) => acc + item.qty * item.price, 0)
    await cart.save({ validateBeforeSave: false })
    await cart.populate({ path: 'items.product', populate: { path: 'category' } })
    return { status: 200, message: "cart", cart: cart }

}

const updateCart = async (data) => {
    const { paymentMethod, paymentStatus, orderStatus, lat, lng, total } = data.body;
    const cart = await Cart.findOne({
        $and: [
            { user: new mongoose.Types.ObjectId(data.userId) },
            { orderStatus: "draft" }
        ]
    })
    if (!cart) {
        return { status: 404, message: "cart not found!!" }
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
    cart.paymentMethod = paymentMethod
    cart.paymentStatus = paymentStatus
    cart.orderStatus = orderStatus
    cart.sourceCords = {
        lat: 23.0069372,
        lng: 72.5208415
    }
    cart.destinationCords = {
        lat,
        lng
    };
    cart.total = total
    await cart.save({ validateBeforeSave: false })
    await cart.populate({ path: 'items.product', populate: { path: 'category' } })

    return { status: 200, message: "cart", cart: cart }
}

const getCords = async ({ orderId }) => {
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
        return { status: 400, message: "invalid id!!" }
    }
    const order = await Cart.findById(orderId)
    if (!order) {
        return { status: 404, message: "order not found!!" }
    }

    return {
        status: 200, message: "cords", cords: {
            sourceCords: order.sourceCords,
            destinationCords: order.destinationCords
        }
    }

}

export { addProductToCart, deletProductFromCart, getUserCart, mergeGuestCart, updateCart, getCords }