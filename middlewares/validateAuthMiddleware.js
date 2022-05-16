import {authSignUpSchema, authSignInSchema} from "../schemas/authSchema.js"

export async function validateSignUp(req, res, next){
    const {error} = authSignUpSchema.validate(req.body)
    if (error) return res.sendStatus(422)
    next()
}

export async function validateSignIn(req, res, next){
    const {error} = authSignInSchema.validate(req.body)
    if (error) return res.sendStatus(422)
    next()
}