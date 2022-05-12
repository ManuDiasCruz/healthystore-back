import {productSchema} from "../schemas/productSchema.js"

export async function validateProduct(req, res, next){
    console.log("ValidateProduct")
    const {error} = productSchema.validate(req.body)
    if (error) return res.sendStatus(422) // unprocessable entity

    next()
}

/* export async function validateTransaction(req, res, next){
    const transactionSchema = joi.object({
        description: joi.string().required(),
        value: joi.number().required(),
        type: joi.valid('credit', 'debt').required()
    })

    const transaction = req.body
    const {error} = transactionSchema.validate(transaction)
    if (error) return res.sendStatus(422) // unprocessable entity

    res.locals.transaction = transaction

    next()
} */