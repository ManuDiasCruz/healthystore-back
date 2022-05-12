import joi from "joi"

export const authSignUpSchema = joi.object({
    name: joi.string().alphanum().min(3).max(30).required(),
    email: joi.string().email().required(),
    password: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    confirmPassword: joi.ref('password')
});

export const authSignInSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required()
  });