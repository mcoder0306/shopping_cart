import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { api } from '../../utils/api'

function OrderCard({ orderitem }) {
    return (
        <div className='flex flex-col gap-6'>
            {orderitem.map((item) => {
                const product = item.product
                if (!product) return null;
                return (
                    <div className='flex gap-6 items-center group' key={item._id}>
                        <div className='w-20 h-20 bg-white rounded-2xl p-3 flex-shrink-0 border border-white/10'>
                            <img src={`http://localhost:3000/${product.image?.replace('uploads/', '')}`} alt={product.title} className='w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500' />
                        </div>
                        <div className='flex-1 min-w-0'>
                            <h3 className='font-bold text-white truncate group-hover:text-indigo-400 transition-colors'>{product.title}</h3>
                            <p className='text-sm text-slate-500'>Quantity: <span className='text-slate-300 font-bold'>{item.qty}</span></p>
                        </div>
                        <div className='text-right'>
                            <p className='font-bold text-xl text-white'>${(product.price * item.qty).toFixed(2)}</p>
                            <p className='text-[10px] text-slate-500'>${product.price} / item</p>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default OrderCard