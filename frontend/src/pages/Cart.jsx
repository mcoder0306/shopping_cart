import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import CartItemsCard from '../components/CartItemsCard'
import { useNavigate } from 'react-router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBagShopping, faArrowRight, faShoppingBag } from '@fortawesome/free-solid-svg-icons'
import { useEffectEvent } from 'react'
import { api } from '../utils/api'
import { useState } from 'react'

function Cart({ cartItems, closePopUp }) {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const cart = useSelector(state => state.cart.cartItems)
  const user = useSelector(state => state.auth.user)
  const items = products?.filter(product => (
    cartItems.find(item => (item.product?._id || item.product) === product._id)
  ))
  const totalPrice = cartItems.reduce((total, item) => {
    const product = products.find(p => p._id === (item.product?._id || item.product));
    return total + (product?.price * item.qty || 0);
  }, 0);

  const totalQty = cartItems.reduce((acc, curr) => acc + curr.qty, 0);

  const handleCheckout = () => {
    if (!user) {
      navigate("/login", { state: { from: "/checkout" } })
    }
    else {
      navigate('/checkout')
      closePopUp()
    }
  }

  useEffect(() => {
    const loadProducts = async () => {
      const res = await api.get("/products/getProducts")
      if (res.status === 200) {
        setProducts(res.data.data)
      }
    }
    loadProducts()
  }, [items])


  return (
    <div className='h-full flex flex-col text-left'>
      {/* Header */}
      <div className='p-7 border-b border-white/05 flex-shrink-0'>
        <div className='flex items-center gap-4'>
          <div className='w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center'>
            <FontAwesomeIcon icon={faBagShopping} className='text-indigo-400' />
          </div>
          <div>
            <h2 className='text-2xl font-black text-white'>Your Bag</h2>
            <p className='text-xs text-slate-500'>{totalQty} item{totalQty !== 1 ? 's' : ''} in cart</p>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className='flex-1 overflow-y-auto p-5 flex flex-col gap-3 custom-scrollbar'>
        {!items?.length ? (
          <div className='flex flex-col items-center justify-center h-full gap-6 text-center px-6'>
            <div className='w-24 h-24 rounded-3xl glass border border-white/05 flex items-center justify-center animate-float'>
              <FontAwesomeIcon icon={faShoppingBag} className='text-4xl text-slate-600' />
            </div>
            <div>
              <p className='text-xl font-bold text-slate-300 mb-2'>Your bag is empty</p>
              <p className='text-sm text-slate-500'>Add some products to get started</p>
            </div>
            <button onClick={closePopUp} className='btn-premium px-8 py-3 rounded-xl font-bold text-sm'>
              Start Shopping
            </button>
          </div>
        ) : (
          items.map((item) => (
            <CartItemsCard key={item._id} item={item} cartItems={cartItems} />
          ))
        )}
      </div>

      {/* Footer */}
      {items?.length > 0 && (
        <div className='p-6 border-t border-white/05 bg-slate-950/60 backdrop-blur-xl flex-shrink-0'>
          <div className='flex justify-between items-center mb-2'>
            <span className='text-slate-400 text-sm'>Subtotal</span>
            <span className='text-slate-300 font-semibold'>${totalPrice.toFixed(2)}</span>
          </div>
          <div className='flex justify-between items-center mb-6'>
            <span className='text-slate-400 text-sm'>Shipping</span>
            <span className='text-emerald-400 font-bold text-xs tracking-widest uppercase'>Free</span>
          </div>
          <div className='section-divider mb-6' />
          <div className='flex justify-between items-center mb-6'>
            <span className='font-black text-lg text-white'>Total</span>
            <span className='text-2xl font-black text-gradient'>${totalPrice.toFixed(2)}</span>
          </div>
          <button
            onClick={handleCheckout}
            className='btn-premium w-full py-4 rounded-2xl font-extrabold text-base flex items-center justify-center gap-3 shadow-2xl shadow-indigo-600/25'
          >
            Proceed to Checkout
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
          {/* <p className='text-center text-xs text-slate-600 mt-3'>Secure checkout · Free returns</p> */}
        </div>
      )}
    </div>
  )
}

export default Cart