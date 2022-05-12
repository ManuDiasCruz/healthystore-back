import {Router} from "express"

/* import {signUp, signIn, signOut} from "../controllers/authentController.js"
import {validateSignUp, validateSignIn} from "../middlewares/validateAuthMiddleware.js" */
import {addProduct, getProducts, getProductsByCategory, getProduct} from "../controllers/productController.js"
import {validateProduct} from "../middlewares/productMiddleware.js"

const productRouter = Router()

// Register items at Products Database
productRouter.post("/register-product", validateProduct, addProduct)

// Find items at Products Database
productRouter.get("/products", getProducts)
productRouter.get("/products-category", getProductsByCategory)
productRouter.get("/product", getProduct)

export default productRouter