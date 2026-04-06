import Joi from "joi";

const addCategoryValidator = {
    body: Joi.object({
        title: Joi.string().required(),
    })
}

const updateCategoryValidator = {
    params: Joi.object({
        id: Joi.string().required()
    }),
    body: Joi.object({
        title: Joi.string(),
        isActive: Joi.boolean()
    }).min(1)
}

const deleteCategoryValidator = {
    params: Joi.object({
        id: Joi.string().required()
    }),
}

const getAllCategoriesValidator = {
    query: Joi.object({
        id: Joi.string()
    })
}

export { addCategoryValidator, updateCategoryValidator, deleteCategoryValidator, getAllCategoriesValidator }