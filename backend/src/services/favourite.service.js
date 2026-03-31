import mongoose from "mongoose"
import { Favourite } from "../models/favourite.model.js"

const addProductToFavourite = async (data) => {
    if (!mongoose.Types.ObjectId.isValid(data.productId)) {
        return { status: 400, message: "invalid id!!" }
    }
    let favouriteProduct = await Favourite.find({
        product: new mongoose.Types.ObjectId(data.productId),
        user: new mongoose.Types.ObjectId(data.userId)
    })
    if (favouriteProduct.length === 0) {
        favouriteProduct = await Favourite.create({
            product: data.productId,
            user: data.userId
        })
    }
    else {
        favouriteProduct = await Favourite.deleteOne({
            product: new mongoose.Types.ObjectId(data.productId),
            user: new mongoose.Types.ObjectId(data.userId)
        })
        return { status: 200, message: "favourite removed", favourite: favouriteProduct }

    }
    if (!favouriteProduct) {
        return { status: 500, message: "something went wrong in create favourite!!" }
    }
    return { status: 201, message: "favourite", favourite: favouriteProduct }
}

const getFavouriteProducts = async (userId) => {
    const favourites = await Favourite.find({
        user: userId
    }).populate({
        path: 'product',
        populate: {
            path: 'category'
        }
    });
    if (favourites.length === 0) {
        return { status: 200, message: "favourites not found!!", favourites: favourites }
    }
    return { status: 200, message: "no favourite items", favourites: favourites }
}

export { addProductToFavourite, getFavouriteProducts }