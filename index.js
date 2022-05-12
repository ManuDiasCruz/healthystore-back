import express, {json } from "express"
import dotenv from "dotenv"
import cors from "cors"

// Internal dependency
import authentRouter from "./routes/authentRouter.js"
import productRouter from "./routes/productRouter.js"
import bagRouter from "./routes/bagRouter.js"
import checkoutRouter from "./routes/checkoutRouter.js"

// Enviroment settings
dotenv.config()

const app = express()
app.use(json())
app.use(cors())

// Routes
app.use(authentRouter)
app.use(productRouter)
app.use(bagRouter)
app.use(checkoutRouter)

// Running server at env.PORT
const port = process.env.PORT
app.listen(port, () => {
    console.log(`|-----------------------------------|`);
    console.log(`| Running at https://localhost:${port} |`);
    console.log(`|-----------------------------------|`);
})
