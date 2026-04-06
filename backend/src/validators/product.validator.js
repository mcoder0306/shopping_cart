import Joi from "joi";

const addProductValidator = {
    body: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        price: Joi.number().positive().required(),
        stock: Joi.number().integer().min(0).required(),
        category: Joi.string().required()
    })
}

const updateProductValidator = {
    params: Joi.object({
        id: Joi.string().required()
    }),
    body: Joi.object({
        title: Joi.string(),
        description: Joi.string(),
        price: Joi.number().positive(),
        stock: Joi.number().integer().min(0),
        category: Joi.string()
    }).min(1)
}

const deleteProductValidator = {
    params: Joi.object({
        id: Joi.string().required()
    })
}

const getProductsValidator = {
    query: Joi.object({
        id: Joi.string(),
        category: Joi.string(),
        price: Joi.number().positive(),
        query: Joi.string(),
    })
}

export { addProductValidator, updateProductValidator, deleteProductValidator, getProductsValidator }