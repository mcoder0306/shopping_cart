import Joi from "joi";

const createpaymetIntentValidator = {
    body: Joi.object({
        total: Joi.number().positive().required(),
        cartId: Joi.string().required()
    })
}

export { createpaymetIntentValidator }