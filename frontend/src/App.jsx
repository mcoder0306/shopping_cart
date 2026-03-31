import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router'
import Layout from './Layout.jsx'
import Home from './pages/Home.jsx'
import Shop from './pages/Shop.jsx'
import Cart from './pages/Cart.jsx'
import NotFound from './pages/NotFound.jsx'
import Category from './pages/Category.jsx'
import Checkout from './pages/Checkout.jsx'
import { Bounce, ToastContainer } from 'react-toastify'
import Orders from './pages/Orders.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import AuthComp from './components/AuthComp.jsx'
import ChangePassword from './pages/ChangePassword.jsx'
import OrderTracking from './pages/OrderTracking.jsx'
import Favourites from './pages/Favourites.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Profile from './pages/Profile.jsx'
import { Elements } from "@stripe/react-stripe-js"
import { stripePromise } from './utils/stripe.js'


function App() {

  return (
    <>
      <Elements stripe={stripePromise}>
        <BrowserRouter>
          <Routes>
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/changePassword' element={<ChangePassword />} />
            <Route path='/' element={<Layout />} >
              <Route path='/' element={<Home />} />
              <Route path='/shop' element={<Shop />} />
              <Route path='/category/:category' element={<Category />} />
              <Route path='/cart' element={<Cart />} />
              <Route path='/checkout' element={
                <AuthComp>
                  <Checkout />
                </AuthComp>
              } />
              <Route path='*' element={<NotFound />} />
              <Route path='/orders' element={
                <AuthComp>
                  <Orders />
                </AuthComp>
              } />
              <Route path='/favourites' element={
                <AuthComp>
                  <Favourites />
                </AuthComp>
              } />
              <Route path='/dashboard' element={
                <AuthComp>
                  <Dashboard />
                </AuthComp>
              } />
              <Route path='/profile' element={
                <AuthComp>
                  <Profile />
                </AuthComp>
              } />
            </Route>

            <Route path='/orderTracking/:id' element={<OrderTracking />} />

          </Routes>
        </BrowserRouter>
      </Elements>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Bounce}
      />
    </>
  )
}

export default App
