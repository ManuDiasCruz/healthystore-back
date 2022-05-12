import {authSignUpSchema, authSignInSchema} from "../schemas/authSchema.js"

export async function validateSignUp(req, res, next){
    console.log("Validate SignUp")

    const {error} = authSignUpSchema.validate(req.body)
    console.log("Schema SignUp ", req.body)

    if (error) return res.sendStatus(422) // unprocessable entity
    next()
}

export async function validateSignIn(req, res, next){
    console.log("Validate SignIn")

    const {error} = authSignInSchema.validate(req.body)
    console.log("Schema SignUp ", req.body)

    if (error) return res.sendStatus(422) // unprocessable entity
    next()
}