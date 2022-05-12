import { Router } from "express"

import { postBag, getBag, deleteBag} from "../controllers/bagController.js"
import { postBagMiddleware, getBagMiddleware, deleteBagMiddleware } from "../middlewares/bagMiddleware.js"

const bagRouter = Router()

bagRouter.post("/bag", postBagMiddleware, postBag)
bagRouter.get("/bag", getBagMiddleware, getBag)
bagRouter.delete("/bag/:id", deleteBagMiddleware, deleteBag)

export default bagRouter