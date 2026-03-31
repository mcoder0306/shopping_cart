import { createSlice } from "@reduxjs/toolkit"

const loadLocal=()=>{
    const data=JSON.parse(localStorage.getItem("orders"))
    if(data){
        return data;
    }
    else{
        return []
    }
}
const initialState={
    orderItems:[]
}

export const orderSlice=createSlice({
    name:"order",
    initialState,
    reducers:{
        setOrders:(state,action)=>{
            state.orderItems=action.payload
        },
        addOrders:(state,action)=>{
            state.orderItems=[...state.orderItems,action.payload]
            // localStorage.setItem("orders",JSON.stringify(state.orderItems))
        },
    }
})

export const {addOrders,setOrders} = orderSlice.actions;
export default orderSlice.reducer;