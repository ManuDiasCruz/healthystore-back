import {Router} from "express"
import {addProduct, getProducts, getProductsByCategory, getProduct} from "../controllers/productController.js"
import {validateProduct} from "../middlewares/productMiddleware.js"

const productRouter = Router()

productRouter.post("/register-product", validateProduct, addProduct)
productRouter.get("/products", getProducts)
productRouter.get("/productsCategory/:category", getProductsByCategory)
productRouter.get("/product/:productId", getProduct)

export default productRouter