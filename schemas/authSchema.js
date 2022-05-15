import joi from "joi"

export const authSignUpSchema = joi.object({
    username: joi.string().alphanum().min(3).max(30).required(),
    email: joi.string().email().required(),
    password: joi.string().pattern(/^[0-9a-zA-Z]{3,}$/).required(),
    repeatedPassword: joi.ref('password')
});

export const authSignInSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required()
  });