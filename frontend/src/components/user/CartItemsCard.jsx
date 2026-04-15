import { faTrashCan, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { removeFromCart, increaceQty, decreaceQty, updateLocalStorage } from '../../features/CartSlice'
import { api } from '../../utils/api'
import { toast } from 'react-toastify'

function CartItemsCard({ item, cartItems }) {
    const cartItem = cartItems.find(ci => (ci.product?._id || ci.product) === item._id)
    const qty = cartItem?.qty || 0
    const dispatch = useDispatch()
    const itemTotal = (item.price * qty).toFixed(2)
    const user = useSelector(state => state.auth.user)

    const handleDecreaseQty = async (id) => {
        try {
            if (!user) {
                dispatch(decreaceQty({ product: id }))
                if (qty === 1) {
                    dispatch(removeFromCart({ product: id }))
                }
                dispatch(updateLocalStorage())
            }
            else {
                const res = await api.post(`/carts/addToCart/${id}`, {
                    qty: qty - 1,
                    price: cartItem.price
                })
                if (res.status === 200 || res.status === 201) {
                    dispatch(decreaceQty({ product: id }))
                    if (qty === 1) {
                        dispatch(removeFromCart({ product: id }))
                    }
                } else {
                    toast.warning(res.data.message || 'Something went wrong', {
                        theme: 'dark',
                    })
                }
            }

        } catch (error) {
            const msg = error.response?.data?.message || 'something went wrong. Please try again.'
            toast.error(msg, {
                theme: 'dark',
                autoClose: 3000,
            })
        }
    }

    const handleIncreaseQty = async (id) => {
        try {
            if (!user) {
                dispatch(increaceQty({ product: id }))
                dispatch(updateLocalStorage())
            }
            else {
                const res = await api.post(`/carts/addToCart/${id}`, {
                    qty: qty + 1,
                    price: cartItem.price
                })
                if (res.status === 200 || res.status === 201) {
                    dispatch(increaceQty({ product: id }))
                } else {
                    toast.warning(res.data.message || 'Something went wrong', {
                        theme: 'dark',
                    })
                }
            }
        } catch (error) {
            const msg = error.response?.data?.message || 'something went wrong. Please try again.'
            toast.error(msg, {
                theme: 'dark',
                autoClose: 3000,
            })
        }
    }

    const handleRemoveFromCart = async (id) => {
        try {
            if (!user) {
                dispatch(removeFromCart({ product: id }))
                dispatch(updateLocalStorage())
            }
            else {
                const res = await api.delete(`/carts/deleteFromCart/${id}`)
                if (res.status === 200 || res.status === 201) {
                    dispatch(removeFromCart({ product: id }))
                    toast.success(res.data.message || 'Product removed from cart! 🎉', {
                        theme: 'dark',
                        autoClose: 2500,
                    })
                } else {
                    toast.warning(res.data.message || 'Something went wrong', {
                        theme: 'dark',
                    })
                }
            }

        } catch (error) {
            const msg = error.response?.data?.message || 'something went wrong. Please try again.'
            toast.error(msg, {
                theme: 'dark',
                autoClose: 3000,
            })
        }
    }

    return (
        <div className='group relative glass rounded-2xl p-4 border border-white/04 hover:border-indigo-500/20 transition-all duration-300'>
            <div className='flex gap-4 items-center'>
                {/* Image */}
                <div className='w-20 h-20 bg-white rounded-xl p-2.5 flex-shrink-0 overflow-hidden'>
                    <img
                        src={`http://localhost:3000/${item.image?.replace('uploads/', '')}`}
                        alt={item.title}
                        className='w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500'
                    />
                </div>

                {/* Info */}
                <div className='flex-1 min-w-0 pr-10'>
                    <h3 className='text-slate-100 font-bold text-sm truncate mb-1' title={item.title}>
                        {item.title}
                    </h3>
                    <p className='text-indigo-400 font-bold text-sm mb-3'>${item.price} <span className='text-slate-600 font-normal text-xs'>each</span></p>

                    <div className='flex items-center justify-between gap-3'>
                        <div className='qty-counter scale-90 -ml-2'>
                            <button
                                onClick={() => handleDecreaseQty(item._id)}
                                className='qty-btn'
                            >
                                <FontAwesomeIcon icon={faMinus} />
                            </button>
                            <span className='w-5 text-center font-black text-xs'>{qty}</span>
                            <button
                                onClick={() => handleIncreaseQty(item._id)}
                                className='qty-btn disabled:cursor-not-allowed'
                                disabled={qty >= item.stock}
                            >
                                <FontAwesomeIcon icon={faPlus} />
                            </button>
                        </div>
                        <span className='font-black text-sm text-white'>${itemTotal}</span>
                    </div>
                </div>

                {/* Delete */}
                <button
                    className='absolute top-3 right-3 w-8 h-8 rounded-xl flex items-center justify-center text-slate-500 hover:text-rose-400 bg-white/05 hover:bg-rose-400/10 border border-white/05 hover:border-rose-400/30 transition-all duration-300 shadow-sm hover:shadow-rose-400/20'
                    onClick={() => handleRemoveFromCart(item._id)}
                    title='Remove'
                >
                    <FontAwesomeIcon icon={faTrashCan} className='text-xs' />
                </button>
            </div>
        </div>
    )
}

export default CartItemsCard