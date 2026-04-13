import { setCart, setCompletedCart } from "../../features/CartSlice"
import { api } from "../../utils/api"

export const fetchDraftCart = async (dispatch) => {
    const res = await api.get(`/carts/getCart/draft`)
    dispatch(setCart(res.data.data))
}

export const fetchCompletedCart = async (dispatch) => {
    const res = await api.get(`/carts/getCart/completed`)
    dispatch(setCompletedCart(res.data.data))
}