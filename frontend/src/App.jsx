import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router'
import Layout from './Layout.jsx'
import Home from './pages/user/Home.jsx'
import Shop from './pages/user/Shop.jsx'
import Cart from './pages/user/Cart.jsx'
import NotFound from './pages/auth/NotFound.jsx'
import Category from './pages/user/Category.jsx'
import Checkout from './pages/user/Checkout.jsx'
import { Bounce, ToastContainer } from 'react-toastify'
import Orders from './pages/user/Orders.jsx'
import Login from './pages/auth/Login.jsx'
import Register from './pages/auth/Register.jsx'
import AuthComp from './components/auth/AuthComp.jsx'
import ChangePassword from './pages/auth/ChangePassword.jsx'
import OrderTracking from './pages/user/OrderTracking.jsx'
import Favourites from './pages/user/Favourites.jsx'
import Dashboard from './pages/Dashboard.jsx'
import { Elements } from "@stripe/react-stripe-js"
import { stripePromise } from './utils/stripe.js'
import Profile from './pages/user/Profile.jsx'

// Admin imports
import AdminLayout from './components/admin/AdminLayout.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import ProductsPage from './pages/admin/ProductsPage.jsx'
import OrdersPage from './pages/admin/OrdersPage.jsx'
import AdminOrderDetail from './pages/admin/AdminOrderDetail.jsx'
import CategoriesPage from './pages/admin/CategoriesPage.jsx'
import UsersPage from './pages/admin/UsersPage.jsx'
import AdminProfile from './pages/admin/AdminProfile.jsx'


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

            {/* Admin Routes */}
            <Route path='/admin' element={<AdminLayout />}>
              <Route path='dashboard' element={<AdminDashboard />} />
              <Route path='products' element={<ProductsPage />} />
              <Route path='orders' element={<OrdersPage />} />
              <Route path='orders/:id' element={<AdminOrderDetail />} />
              <Route path='categories' element={<CategoriesPage />} />
              <Route path='users' element={<UsersPage />} />
              <Route path='profile' element={<AdminProfile />} />
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
