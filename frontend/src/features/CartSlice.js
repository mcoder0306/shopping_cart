import { createSlice, current } from "@reduxjs/toolkit"

const loadLocal = () => {
    try {
        const item = localStorage.getItem("cart");
        if (!item || item === "undefined") return [];
        return JSON.parse(item);
    } catch (error) {
        console.error("Error loading cart from localStorage:", error);
        return [];
    }
}

const initialState = {
    cartItems: loadLocal(),
    cartCount: loadLocal().length,
    cartId: null,
    completedCart: []
}
export const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addTocart: (state, action) => {
            const copy = current(state.cartItems)
            const productId = action.payload.product?._id || action.payload.product
            const existing = copy.find((item) => (item.product?._id || item.product) === productId)
            if (existing) {
                const updated = state.cartItems.map((item) => (item.product?._id || item.product) === productId ? { ...item, qty: item.qty + 1 } : item)
                state.cartItems = updated;
                state.cartCount = state.cartItems.length
            }
            else {
                state.cartItems = [...state.cartItems, action.payload]
                state.cartCount = state.cartItems.length
            }
        },
        removeFromCart: (state, action) => {
            const productId = action.payload.product?._id || action.payload.product
            state.cartItems = state.cartItems.filter(item => (item.product?._id || item.product) !== productId)
            state.cartCount = state.cartItems.length
        },
        clearCart: (state) => {
            state.cartItems = []
            state.cartCount = 0
            localStorage.removeItem("cart")
        },
        increaceQty: (state, action) => {
            const productId = action.payload.product?._id || action.payload.product
            const updated = state.cartItems.map((item) => (item.product?._id || item.product) === productId ? { ...item, qty: item.qty + 1 } : item)
            state.cartItems = updated;
        },
        decreaceQty: (state, action) => {
            const productId = action.payload.product?._id || action.payload.product
            const updated = state.cartItems.map((item) => (item.product?._id || item.product) === productId ? { ...item, qty: item.qty - 1 } : item)
            state.cartItems = updated;
        },
        setCart: (state, action) => {
            if (action.payload && !Array.isArray(action.payload) && action.payload.items) {
                // If payload is the full cart object
                state.cartItems = action.payload.items
                state.cartId = action.payload._id
            } else {
                // If payload is just the items array
                state.cartItems = action.payload || []
            }
            state.cartCount = state.cartItems.length
        },
        setCompletedCart: (state, action) => {
            state.completedCart = action.payload
        },
        updateLocalStorage: (state) => {
            localStorage.setItem("cart", JSON.stringify(state.cartItems))
        }

    }
})

export const { addTocart, removeFromCart, clearCart, increaceQty, decreaceQty, setCart, setCompletedCart, updateLocalStorage } = cartSlice.actions;
export default cartSlice.reducer;