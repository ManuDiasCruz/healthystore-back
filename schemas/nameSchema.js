import joi from "joi"

export const schema = joi.object({
    name: joi.string().required(),
    quantity: joi.string().required()
});