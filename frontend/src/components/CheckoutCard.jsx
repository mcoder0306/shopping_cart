import React from 'react'
import { useSelector } from 'react-redux'

function CheckoutCard({ item }) {
    const cartItems = useSelector(state => state.cart.cartItems)
    const qty = cartItems.find(cartItem => cartItem.id === item.id)?.qty || 0

    return (
        <div className='glass rounded-2xl p-4 border border-white/5'>
            <div className='flex items-center gap-6'>
                <div className='w-16 h-16 bg-white rounded-xl p-2 flex-shrink-0'>
                    <img src={item.image} alt={item.title} className='w-full h-full object-contain mix-blend-multiply' />
                </div>
                <div className='flex-1 min-w-0'>
                    <h3 className='font-bold text-slate-100 truncate text-sm'>{item.title}</h3>
                    <p className='text-xs text-slate-500'>Qty: {qty}</p>
                </div>
                <div className='text-right'>
                    <p className='font-bold text-slate-200'>${(item.price * qty).toFixed(2)}</p>
                </div>
            </div>
        </div>
    )
}

export default CheckoutCard