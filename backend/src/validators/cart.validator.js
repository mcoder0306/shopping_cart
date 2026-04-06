import Joi from "joi"

const addTocartValidator = {
    params: Joi.object({
        productId: Joi.string().required()
    }),
    body: Joi.object({
        qty: Joi.number().integer().required(),
        price: Joi.number().positive().required()
    })
}

const deleteFromCartValidator = {
    params: Joi.object({
        productId: Joi.string().required(),
    })
}

const getCartValidator = {
    params: Joi.object({
        status: Joi.string().valid("draft", "completed").required()
    })
}

const mergeCartValidator = {
    body: Joi.object({
        items: Joi.array().items(
            Joi.object({
                product: Joi.string().required(),
                qty: Joi.number().integer().min(1).required(),
                price: Joi.number().positive().required()
            })
        )
    })
}

const updateCartStatusValidator = {
    body: Joi.object({
        paymentMethod: Joi.string().valid("cod", "upi", "card").required(),
        paymentStatus: Joi.string().valid("pending", "cancelled", "failed", "completed"),
        orderStatus: Joi.string().valid("draft", "completed"),
        lat: Joi.number().min(-90).max(90).required(),
        lng: Joi.number().min(-180).max(180).required(),
        total: Joi.number().positive().required()
    })
}

const getOrderCordsValidator = {
    params: Joi.object({
        orderId: Joi.string().required()
    })
}

export { addTocartValidator, deleteFromCartValidator, getCartValidator, mergeCartValidator, updateCartStatusValidator, getOrderCordsValidator }