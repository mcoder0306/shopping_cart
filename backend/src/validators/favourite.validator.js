import Joi from "joi";

const addToFavouriteValidator={
    params:Joi.object({
        productId:Joi.string().required()
    })
}
export {addToFavouriteValidator}