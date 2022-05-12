import {Router} from "express"

import {signUp, signIn, signOut} from "../controllers/authentController.js"
import {validateSignUp, validateSignIn} from "../middlewares/validateAuthMiddleware.js"

const authentRouter = Router()

authentRouter.post("/sign-up", validateSignUp, signUp)
authentRouter.post("/sign-in", validateSignIn, signIn)

authentRouter.get("/sign-out", signOut)

export default authentRouter