import React, { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faShoppingCart, faBagShopping, faUser, faXmark, faStore, faSearch } from '@fortawesome/free-solid-svg-icons'
import PopUp from './Popup';
import { useDispatch, useSelector } from 'react-redux';
import Cart from '../pages/Cart';
import { api } from '../utils/api';
import { logoutUser } from '../features/AuthSlice';
import { toast } from 'react-toastify'
import { setLoggedinUser } from '../features/AuthSlice';
import { clearCart } from '../features/CartSlice'

function Navbar() {
  const [openPopup, setOpenPopup] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const HandleRemovePopUp = () => setOpenPopup(null);
  const cartCount = useSelector(state => state.cart.cartCount)
  const navigate = useNavigate()
  const user = useSelector(state => state.auth.user)
  const isLoggedin = useSelector(state => state.auth.isLoggedin)
  const dispatch = useDispatch()
  const [searchValue, setSearchValue] = useState("")
  const [openUserMenu, setOpenUserMenu] = useState(false)
  const userMenuRef = useRef(null)

  const handleLogout = async () => {
    try {
      const res = await api.post("/users/logout")
      if (res.status === 200) {
        toast.success(res.data.message || 'Loggedout successfully! 🎉', {
          theme: 'dark',
          autoClose: 2500,
        })
        dispatch(logoutUser())
        dispatch(clearCart())
        navigate('/')
      } else {
        toast.warning(res.data.message || 'Something went wrong', {
          theme: 'dark',
        })
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'logout failed. Please try again.'
      toast.error(msg, {
        theme: 'dark',
        autoClose: 3000,
      })
    }

  }

  const handleSearch = () => {
    // e.preventDefault()
    navigate(`/shop?search=${searchValue}`)
  }


  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await api.get("/users/getUser")
        if (user.status === 200) {
          dispatch(setLoggedinUser(user.data.data))
        }
      } catch (error) {
        console.error("Error fetching user:", error)
      }
    }

    if (isLoggedin) {
      fetchUser()
    }
  }, [isLoggedin, dispatch])


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setOpenUserMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const navLinks = [
    { to: '/', label: 'Home', end: true },
    { to: '/shop', label: 'Shop' },
    ...(isLoggedin
      ? []
      : [
        { to: '/login', label: 'Login' },
        { to: '/register', label: 'Register' },
      ]),
  ]

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-4 ${scrolled ? 'pt-2' : 'pt-4'}`}>
      <nav className={`max-w-7xl mx-auto rounded-2xl transition-all duration-500 ${scrolled ? 'glass py-3 px-6 shadow-2xl' : 'bg-transparent py-4 px-6'}`}>
        <div className='flex items-center justify-between'>

          {/* Logo */}
          <Link to="/" className='flex items-center gap-3 group'>
            <div className='w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-lg'
              style={{ background: 'linear-gradient(135deg, #6366f1, #818cf8)' }}>
              <FontAwesomeIcon icon={faBagShopping} className='text-white text-base' />
            </div>
            <span className='font-black text-2xl tracking-tight'>
              <span className='text-gradient'>Shoppy</span>
              <span className='text-white'>Mart</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className='hidden md:flex items-center gap-2'>
            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `nav-link px-4 py-2 rounded-lg transition-colors text-sm font-semibold ${isActive ? 'text-white bg-white/5' : 'text-slate-400 hover:text-white hover:bg-white/5'}`
                }
              >
                {link.label}
              </NavLink>
            ))}

          </div>
          <div className='border py-1 px-2 rounded-lg border-gray-500'>
            <form onSubmit={handleSearch}>
              <FontAwesomeIcon icon={faSearch} className='text-gray-500 mx-1' />
              <input type="text" name="search" id="search" value={searchValue} onChange={(e) => setSearchValue(e.target.value)} placeholder='Search here..' className='focus:outline-none' />
              <button></button>
            </form>
          </div>

          {/* Desktop Actions */}
          <div className='hidden md:flex items-center gap-3'>
            <button
              onClick={() => setOpenPopup("cartpopup")}
              className='relative p-2.5 hover:bg-white/5 rounded-xl transition-colors group'
            >
              <FontAwesomeIcon icon={faShoppingCart} className='text-lg text-slate-300 group-hover:text-white transition-colors' />
              {cartCount > 0 && (
                <span className='absolute -top-1 -right-1 bg-indigo-500 text-white rounded-full min-w-[20px] h-5 flex items-center justify-center text-[10px] font-black shadow-lg shadow-indigo-500/40 animate-bounce-in'>
                  {cartCount}
                </span>
              )}
            </button>
            {
              isLoggedin && (
                <div className='relative user-menu' ref={userMenuRef}>
                  <button className='p-2.5 hover:bg-white/5 rounded-xl transition-colors group' onClick={() => setOpenUserMenu(prev => !prev)}>
                    <FontAwesomeIcon icon={faUser} className='text-lg text-slate-300 group-hover:text-white transition-colors px-1' />
                    {isLoggedin && user.name}
                  </button>
                  {openUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 shadow-lg border bg-gray-800 rounded-lg p-2 z-50">
                      <ul className="flex flex-col">
                        <li className="p-2 hover:bg-gray-500 cursor-pointer" onClick={() => { navigate("/profile"); setOpenUserMenu(false); }}>Profile</li>
                        <li className="p-2 hover:bg-gray-500 cursor-pointer" onClick={() => { navigate("/orders"); setOpenUserMenu(false); }}>Orders</li>
                        <li className="p-2 hover:bg-gray-500 cursor-pointer" onClick={() => { navigate("/favourites"); setOpenUserMenu(false); }}>Favourites</li>
                        <li className="p-2 hover:bg-gray-500 cursor-pointer">
                          <button onClick={() => { handleLogout(); setOpenUserMenu(false); }}>logout</button>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              )
            }
          </div>


          {/* Mobile Actions */}
          <div className='md:hidden flex items-center gap-3'>
            <button
              onClick={() => setOpenPopup("cartpopup")}
              className='relative p-2'
            >
              <FontAwesomeIcon icon={faShoppingCart} className='text-xl text-slate-200' />
              {cartCount > 0 && (
                <span className='absolute -top-1 -right-1 bg-indigo-500 text-white rounded-full min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-black'>
                  {cartCount}
                </span>
              )}
            </button>
            <button
              className='p-2 hover:bg-white/5 rounded-xl transition-colors'
              onClick={() => setOpenPopup('barpopup')}
            >
              <FontAwesomeIcon icon={faBars} className='text-xl text-slate-200' />
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        <PopUp openPopUp={openPopup === "barpopup"} closePopUp={HandleRemovePopUp} id="barpopup" className="justify-end" innerClass="w-3/4 max-w-xs h-full mr-0 rounded-l-3xl glass">
          <div className='p-8 flex flex-col gap-2 pt-16'>
            <div className='flex items-center gap-3 mb-8'>
              <div className='w-9 h-9 rounded-xl flex items-center justify-center' style={{ background: 'linear-gradient(135deg, #6366f1, #818cf8)' }}>
                <FontAwesomeIcon icon={faBagShopping} className='text-white text-sm' />
              </div>
              <span className='font-black text-xl'>ShoppyMart</span>
            </div>
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={HandleRemovePopUp}
                className='text-base font-semibold py-3 px-4 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-colors border-b border-slate-800/50 last:border-0'
              >
                {link.label}
              </Link>
            ))}
          </div>
        </PopUp>

        {/* Cart Sidebar */}
        <PopUp openPopUp={openPopup === "cartpopup"} closePopUp={HandleRemovePopUp} id="cartpopup" className="justify-end" innerClass="w-full md:w-[460px] h-full mr-0 glass rounded-l-3xl shadow-2xl">
          <Cart closePopUp={HandleRemovePopUp} />
        </PopUp>
      </nav>
    </div>
  )
}

export default Navbar