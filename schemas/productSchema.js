import joi from "joi"

export const productSchema = joi.object({
    name: joi.string().min(3).max(30).required(),
    description: joi.string().required(),
    value: joi.number().required(),
    image: joi.string().uri(),
    category: joi.valid('food', 'beverage', 'vitamin', 'suplement').required()
});