import "dotenv/config";

import express from "express"
const PORT = process.env.PORT || 3000
import { connection } from "./connection/connection.js"
import cors from "cors"
import cookieParser from "cookie-parser"
import { handleWebhook } from "./controllers/payment.controller.js"

const app = express()

// Webhook route must be before express.json() to get raw body
app.post("/api/v1/payment/webhook", express.raw({ type: 'application/json' }), handleWebhook)

app.use(express.json())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
app.use(express.urlencoded({ extended: true }))
app.use(express.static("uploads"))
app.use(cookieParser())
const connect = async () => {
    await connection()
    
    app.listen(PORT, () => {
        console.log("server is listening on PORT: ", PORT)
    })
}
connect()

//routes
import userRouter from "./routes/user.route.js"
import productRouter from "./routes/product.route.js"
import categoryRouter from "./routes/category.route.js"
import cartRouter from "./routes/cart.route.js"
import orderRouter from "./routes/order.route.js"
import dashboardRouter from "./routes/dashboard.route.js"
import authRouter from "./routes/auth.route.js"
import favouriteRouter from "./routes/favourite.route.js"
import paymentRouter from "./routes/payment.route.js"
import { verifyJWT } from "./middlewares/auth.js"

//non auth
app.use("/api/v1/auth", authRouter)
app.use("/api/v1/carts", cartRouter)
//partially auth
app.use("/api/v1/products", productRouter)
app.use("/api/v1/categories", categoryRouter)
//auth routes
app.use(verifyJWT)
app.use("/api/v1/users", userRouter)
app.use("/api/v1/orders", orderRouter)
app.use("/api/v1/dashboard", dashboardRouter)
app.use("/api/v1/favourites", favouriteRouter)
app.use("/api/v1/payment", paymentRouter)


