import {productSchema} from "../schemas/productSchema.js"

export async function validateProduct(req, res, next){
    console.log("ValidateProduct")
    const {error} = productSchema.validate(req.body)
    if (error) {
        return res.sendStatus(422)
        console.log("erro")
    }

    next()
}
