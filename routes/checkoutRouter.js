import { Router } from "express"

import { postCheckout, getCheckout } from "../controllers/checkoutController.js"
import { postCheckoutMiddle, getCheckoutMiddleware } from "../middlewares/checkoutMiddleware.js"

const checkoutRouter = Router()

checkoutRouter.post("/checkout", postCheckoutMiddle, postCheckout)
checkoutRouter.get("/checkout", getCheckoutMiddleware, getCheckout)

export default checkoutRouter