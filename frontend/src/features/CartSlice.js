import { createSlice, current } from "@reduxjs/toolkit"

const loadLocal = () => {
    const data = JSON.parse(localStorage.getItem("cart"))
    if (data) {
        return data;
    }
    else {
        return []
    }
}
const count = loadLocal().length

const initialState = {
    cartItems: loadLocal() || [],
    cartCount: count ? count : 0,
    completedCart: []
}
export const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addTocart: (state, action) => {
            const copy = current(state.cartItems)
            const productId = action.payload.product
            const existing = copy.find((item) => (item.product?._id || item.product) === productId)
            if (existing) {
                const updated = state.cartItems.map((item) => (item.product?._id || item.product) === productId ? { ...item, qty: item.qty + 1 } : item)
                state.cartItems = updated;
                localStorage.setItem("cart", JSON.stringify(updated))
                state.cartCount = state.cartItems.length
            }
            else {
                state.cartItems = [...state.cartItems, action.payload]
                localStorage.setItem("cart", JSON.stringify(state.cartItems))
                state.cartCount = state.cartItems.length
            }
        },
        removeFromCart: (state, action) => {
            const productId = action.payload.product?._id || action.payload.product
            state.cartItems = state.cartItems.filter(item => (item.product?._id || item.product) !== productId)
            localStorage.setItem("cart", JSON.stringify(state.cartItems))
            state.cartCount = state.cartItems.length
        },
        clearCart: (state) => {
            state.cartItems = []
            state.cartCount = 0
            localStorage.removeItem("cart")
        },
        increaceQty: (state, action) => {
            const productId = action.payload.product?._id || action.payload.product
            state.cartItems = state.cartItems.map((item) => (item.product?._id || item.product) === productId ? { ...item, qty: item.qty + 1 } : item)
            localStorage.setItem("cart", JSON.stringify(state.cartItems))
        },
        decreaceQty: (state, action) => {
            const productId = action.payload.product?._id || action.payload.product
            state.cartItems = state.cartItems.map((item) => (item.product?._id || item.product) === productId ? { ...item, qty: item.qty - 1 } : item)
            localStorage.setItem("cart", JSON.stringify(state.cartItems))

        },
        setCart: (state, action) => {
            state.cartItems = action.payload,
                state.cartCount = action.payload.length
            localStorage.setItem("cart", JSON.stringify(state.cartItems))
        },
        setCompletedCart: (state, action) => {
            state.completedCart = action.payload
        }

    }
})

export const { addTocart, removeFromCart, clearCart, increaceQty, decreaceQty, setCart, setCompletedCart } = cartSlice.actions;
export default cartSlice.reducer;