import { createSlice } from "@reduxjs/toolkit"

const loadLocal=()=>{
    const data=JSON.parse(localStorage.getItem("products"))
    if(data){
        return data;
    }
    else{
        return []
    }
}
const initialState={
    products:null,
}

export const productSlice=createSlice({
    name:"product",
    initialState,
    reducers:{
        addProducts:(state,action)=>{
            state.products=action.payload
            // localStorage.setItem("products",JSON.stringify(state.products))
        }
    }
})

export const {addProducts}=productSlice.actions;
export default productSlice.reducer;

