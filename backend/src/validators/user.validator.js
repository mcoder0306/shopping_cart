import Joi from "joi";

const updateDetailsValidator = {
    body: Joi.object({
        name: Joi.string().required(),
        phone: Joi.string().pattern(/^[0-9]{10}$/).allow('', null).messages({
            "string.pattern.base": "Phone must be 10 digits"
        })
    })
}

const addAddressValidator = {
    body: Joi.object({
        name: Joi.string()
            .min(2)
            .max(50)
            .required()
            .messages({
                "string.empty": "Name is required"
            }),

        phone: Joi.string()
            .pattern(/^[0-9]{10}$/)
            .required()
            .messages({
                "string.pattern.base": "Phone must be 10 digits"
            }),

        city: Joi.string()
            .required(),

        state: Joi.string()
            .required(),

        pincode: Joi.string()
            .pattern(/^[0-9]{6}$/)
            .required()
            .messages({
                "string.pattern.base": "Pincode must be 6 digits"
            }),

        addressLine: Joi.string()
            .min(5)
            .max(200)
            .required(),

        label: Joi.string()
            .valid("home", "work", "other")
            .default("home"),

    }).unknown(false)
}
const updateAddressValidator = {
    params: Joi.object({
        addressId: Joi.string().required()
    }),
    body: Joi.object({
        name: Joi.string().min(2).max(50),

        phone: Joi.string()
            .pattern(/^[0-9]{10}$/)
            .messages({
                "string.pattern.base": "Phone must be 10 digits"
            }),

        city: Joi.string(),

        state: Joi.string(),

        pincode: Joi.string()
            .pattern(/^[0-9]{6}$/)
            .messages({
                "string.pattern.base": "Pincode must be 6 digits"
            }),

        addressLine: Joi.string().min(5).max(200),

        label: Joi.string().valid("home", "work", "other"),

        isDefault: Joi.boolean()
    })
        .min(1)
        .required()
        .unknown(false)
};

const deleteAddressValidator = {
    params: Joi.object({
        addressId: Joi.string().required()
    }),
}

export { updateDetailsValidator, addAddressValidator, updateAddressValidator, deleteAddressValidator }