import { api } from "../../utils/api"

export const fetchDraftCart = async (dispatch) => {
    const res = await api.get(`/carts/getCart/draft`)
    console.log(res.data.data)
}