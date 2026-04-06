import Joi from "joi";

const updateDetailsValidator={
    body:Joi.object({
        name:Joi.string().required()
    })
}

export {updateDetailsValidator}