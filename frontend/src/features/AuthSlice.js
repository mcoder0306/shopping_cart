import { createSlice } from "@reduxjs/toolkit"

const user=JSON.parse(localStorage.getItem("user"))
 
const initialState = {
    user: user?user:null,
    isLoggedin: user?true:false
}

export const AuthSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setLoggedinUser: (state, action) => {
            state.user = action.payload;
            state.isLoggedin = true
            localStorage.setItem("user",JSON.stringify(state.user))
        },
        logoutUser: (state, action) => {
            state.user=null,
            state.isLoggedin=false
            localStorage.removeItem("user")
        }
        
    }
})

export const { logoutUser, setLoggedinUser } = AuthSlice.actions;
export default AuthSlice.reducer