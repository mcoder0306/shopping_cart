import React from 'react'
import Navbar from './components/user/Navbar'
import Footer from './components/user/Footer'
import { Outlet } from 'react-router-dom'

function Layout() {
  return (
    <div className='flex flex-col min-h-screen'>
      <Navbar />
      <main className='flex-1'>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default Layout