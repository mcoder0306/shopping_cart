import {configureStore} from '@reduxjs/toolkit'
import cartReducer from '../features/CartSlice.js'
import productReducer from '../features/ProductSlice.js'
import orderReducer from '../features/OrderSlice.js'
import authReducer from "../features/AuthSlice.js"

export const store=configureStore({
    reducer:{
        cart:cartReducer,
        product:productReducer,
        order:orderReducer,
        auth:authReducer
    }
})
