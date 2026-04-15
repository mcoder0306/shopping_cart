import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router'

function AuthComp({ children }) {
    const isLoggedin = useSelector(state => state.auth.isLoggedin)
    return  !isLoggedin?(
        <Navigate to="/login" replace/>
    ):
    (
        children
    )
}

export default AuthComp