import Joi from "joi"

const registerValidator = {
    body: Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().lowercase().required(),
        password: Joi.string().min(6).required(),
        confirm_password: Joi.string()
            .valid(Joi.ref('password'))
            .required()
            .messages({
                'any.only': 'Passwords do not match'
            }),
    })
}

const loginValidator = {
    body: Joi.object({
        email: Joi.string().email().lowercase().required(),
        password: Joi.string().min(6).required(),
    })
}

const changePasswordValidator = {
    body: Joi.object({
        email: Joi.string().email().lowercase().required(),
        oldPassword: Joi.string().min(6).required(),
        newPassword: Joi.string()
            .min(6)
            .invalid(Joi.ref('oldPassword'))
            .required()
            .messages({
                "any.invalid": "New password cannot be same as old password"
            })
    })
}

export { registerValidator, loginValidator, changePasswordValidator }