import React, { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faShoppingCart, faBagShopping, faUser, faXmark, faStore, faSearch, faHome, faBoxArchive, faHeart, faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import PopUp from './Popup';
import { useDispatch, useSelector } from 'react-redux';
import Cart from '../../pages/user/Cart';
import { api } from '../../utils/api';
import { logoutUser } from '../../features/AuthSlice';
import { toast } from 'react-toastify'
import { setLoggedinUser } from '../../features/AuthSlice';
import { clearCart } from '../../features/CartSlice'

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

  const handleSearch = (e) => {
    if (e) e.preventDefault()
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
          <Link to="/" className='flex items-center gap-2 group md:gap-3'>
            <div className='w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-lg'
              style={{ background: 'linear-gradient(135deg, #6366f1, #818cf8)' }}>
              <FontAwesomeIcon icon={faBagShopping} className='text-white text-base' />
            </div>
            <span className='font-black text-xl sm:text-2xl tracking-tight'>
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
          <div className='hidden md:block py-1 px-3 rounded-xl bg-white/5 border border-white/10 focus-within:border-indigo-500/50 transition-colors'>
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <FontAwesomeIcon icon={faSearch} className='text-slate-400' />
              <input type="text" name="search" id="search" value={searchValue} onChange={(e) => setSearchValue(e.target.value)} placeholder='Search products...' className='bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none w-48' />
              <button type="submit" className="hidden"></button>
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
                  <button className='flex items-center gap-3 p-1 pl-1 pr-3 hover:bg-white/5 rounded-full hover:border-white/10 transition-all duration-300 group' onClick={() => setOpenUserMenu(prev => !prev)}>
                    <div className='w-9 h-9 rounded-full overflow-hidden flex items-center justify-center bg-indigo-500/10 border border-indigo-500/30 group-hover:border-indigo-500/60 transition-all duration-500 shadow-lg'>
                      {user?.image ? (
                        <img src={`http://localhost:3000/${user.image?.replace('uploads/', '')}`} alt="profile" className='w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500' />
                      ) : (
                        <span className="text-indigo-400 font-bold text-xs uppercase group-hover:text-white transition-colors">{user.name?.charAt(0)}</span>
                      )}
                    </div>
                    <span className='text-sm font-bold text-slate-300 group-hover:text-white transition-colors max-w-[100px] truncate'>
                      {user.name}
                    </span>
                  </button>
                  {openUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 shadow-lg border bg-gray-800 rounded-lg p-2 z-50">
                      <ul className="flex flex-col">
                        <li className="p-2 hover:bg-gray-500 cursor-pointer" onClick={() => { navigate("/profile"); setOpenUserMenu(false); }}>Profile</li>
                        <li className="p-2 hover:bg-gray-500 cursor-pointer" onClick={() => { navigate("/orders"); setOpenUserMenu(false); }}>Orders</li>
                        <li className="p-2 hover:bg-gray-500 cursor-pointer" onClick={() => { navigate("/favourites"); setOpenUserMenu(false); }}>Favourites</li>
                        <li className="p-2 hover:bg-gray-500 cursor-pointer" onClick={() => { handleLogout(); setOpenUserMenu(false); }}>
                          Logout
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
        <PopUp openPopUp={openPopup === "barpopup"} closePopUp={HandleRemovePopUp} id="barpopup" className="justify-end" innerClass="w-3/4 max-w-sm h-full mr-0 rounded-l-3xl glass flex flex-col">
          <div className='p-6 flex flex-col gap-2 pt-12 flex-1 overflow-y-auto custom-scrollbar'>
            <div className='flex items-center gap-3 mb-6'>
              <div className='w-9 h-9 rounded-xl flex items-center justify-center' style={{ background: 'linear-gradient(135deg, #6366f1, #818cf8)' }}>
                <FontAwesomeIcon icon={faBagShopping} className='text-white text-sm' />
              </div>
              <span className='font-black text-xl'>ShoppyMart</span>
            </div>

            {/* Mobile Search */}
            <form onSubmit={(e) => { handleSearch(e); HandleRemovePopUp(); }} className="flex items-center gap-2 mb-6 bg-white/5 border border-white/10 rounded-xl px-3 py-2 focus-within:border-indigo-500/50 transition-colors">
              <FontAwesomeIcon icon={faSearch} className='text-slate-400 text-sm' />
              <input type="text" value={searchValue} onChange={(e) => setSearchValue(e.target.value)} placeholder='Search...' className='bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none w-full' />
              <button type="submit" className="hidden"></button>
            </form>

            <div className="flex flex-col gap-1 mb-6">
              {navLinks.map(link => {
                let icon;
                if (link.label === 'Home') icon = faHome;
                else if (link.label === 'Shop') icon = faStore;
                else if (link.label === 'Login' || link.label === 'Register') icon = faUser;

                return (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.end}
                    onClick={HandleRemovePopUp}
                    className={({ isActive }) => `flex items-center gap-4 text-sm font-semibold py-3 px-4 rounded-2xl transition-colors ${isActive ? 'text-white bg-indigo-500/20 shadow-inner' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}
                  >
                    {icon && <FontAwesomeIcon icon={icon} className="opacity-70 text-lg w-5" />}
                    {link.label}
                  </NavLink>
                )
              })}
            </div>

            {/* Mobile User Menu */}
            {isLoggedin && (
              <div className="mt-auto border-t border-white/10 pt-6 flex flex-col gap-1">
                <div className="px-4 py-2 mb-2 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full border border-indigo-500/30 overflow-hidden flex items-center justify-center bg-indigo-500/10">
                    {user?.image ? (
                      <img src={`http://localhost:3000/${user.image?.replace('uploads/', '')}`} alt="profile" className='w-full h-full object-cover' />
                    ) : (
                      <span className="text-indigo-400 font-bold text-sm uppercase">{user.name?.charAt(0)}</span>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Account</p>
                    <p className="text-sm font-black text-white truncate max-w-[120px]">{user?.name}</p>
                  </div>
                </div>
                <Link to="/profile" onClick={HandleRemovePopUp} className='flex items-center gap-4 text-sm font-semibold py-3 px-4 rounded-2xl text-slate-300 hover:text-white hover:bg-white/5 transition-colors'>
                  <FontAwesomeIcon icon={faUser} className="opacity-70 text-lg w-5" />
                  Profile
                </Link>
                <Link to="/orders" onClick={HandleRemovePopUp} className='flex items-center gap-4 text-sm font-semibold py-3 px-4 rounded-2xl text-slate-300 hover:text-white hover:bg-white/5 transition-colors'>
                  <FontAwesomeIcon icon={faBoxArchive} className="opacity-70 text-lg w-5" />
                  Orders
                </Link>
                <Link to="/favourites" onClick={HandleRemovePopUp} className='flex items-center gap-4 text-sm font-semibold py-3 px-4 rounded-2xl text-slate-300 hover:text-white hover:bg-white/5 transition-colors'>
                  <FontAwesomeIcon icon={faHeart} className="opacity-70 text-lg w-5" />
                  Favourites
                </Link>
                <button onClick={() => { handleLogout(); HandleRemovePopUp(); }} className='flex items-center gap-4 text-left text-sm font-semibold py-3 px-4 rounded-2xl text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors mt-2'>
                  <FontAwesomeIcon icon={faArrowRightFromBracket} className="opacity-70 text-lg w-5" />
                  Logout
                </button>
              </div>
            )}
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