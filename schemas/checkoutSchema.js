import joi from "joi"

export const checkoutSignUpSchema = joi.object({
    address: joi.string().required(),
    cpf: joi.string().pattern(/^[0-9]{8}$/).required(),
    payment: joi.valid('Cartão','Pix').required()
});