import express, { json } from "express"
import dotenv from "dotenv"
import cors from "cors"

// Internal dependency
import authentRouter from "./routes/authentRouter.js"
import productRouter from "./routes/productRouter.js"

// Enviroment settings
dotenv.config()

const app = express()
app.use(json())
app.use(cors())

// Routes
app.use(authentRouter)
app.use(productRouter)

// Running server at env.DOOR
const door = process.env.DOOR
app.listen(door, () => {
    console.log(`Server running at door ${door}.`)
})
