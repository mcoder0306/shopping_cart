import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { addTocart, decreaceQty, increaceQty, removeFromCart } from '../features/CartSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus, faShieldHalved, faTruckFast, faCircleCheck, faStar } from '@fortawesome/free-solid-svg-icons';
import { api } from '../utils/api';

function DetailCard({ product }) {
    const dispatch = useDispatch()
    const cartItems = useSelector(state => state.cart.cartItems)
    const existing = cartItems.find(item => item.productId === product._id)

    const rating = (product.rating?.rate || 4.2).toFixed(1);
    const ratingCount = product.rating?.count || 120;
    const savings = (product.price * 0.2).toFixed(2);


    const handleAddToCart = async () => {
        try {
            const res = await api.post(`/carts/addToCart/${product._id}`, {
                qty: 1,
                price: product.price
            })
            if (res.status === 201) {
                dispatch(addTocart({ productId: product._id, qty: 1, price: product.price }))
                toast.success(res.data.data.message || 'Product added to cart! 🎉', {
                    theme: 'dark',
                    autoClose: 2500,
                })
            } else {
                toast.warning(res.data.data.message || 'Something went wrong', {
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
    const handleDecreaseQty = async () => {
        try {
            const res = await api.post(`/carts/addToCart/${product._id}`, {
                qty: existing.qty - 1,
                price: product.price
            })
            if (res.status === 200 || res.status === 201) {
                dispatch(decreaceQty({ productId: product._id }))
                if (existing.qty === 1) {
                    dispatch(removeFromCart({ productId: product._id }))
                }
            } else {
                toast.warning(res.data.data.message || 'Something went wrong', {
                    theme: 'dark',
                })
            }

        } catch (error) {
            const msg = error.response?.data?.message || 'something went wrong. Please try again.'
            toast.error(msg, {
                theme: 'dark',
                autoClose: 3000,
            })
        }
    }

    const handleIncreaseQty = async () => {
        try {
            const res = await api.post(`/carts/addToCart/${product._id}`, {
                qty: existing.qty + 1,
                price: product.price
            })
            if (res.status === 200 || res.status === 201) {
                dispatch(increaceQty({ productId: product._id }))
            } else {
                toast.warning(res.data.data.message || 'Something went wrong', {
                    theme: 'dark',
                })
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
        <div className='flex flex-col lg:flex-row h-full lg:max-h-[88vh]'>
            {/* Image Panel */}
            <div className='lg:w-1/2 bg-white flex items-center justify-center min-h-[360px] p-10 relative'>
                <div className='relative w-full aspect-square max-w-[380px] group'>
                    <img
                        src={`http://localhost:3000/${(product.image).replace('uploads/', '')}`}
                        alt={product.title}
                        className='w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-700'
                    />
                </div>
                {/* Authenticity badge */}
                <div className='absolute bottom-6 left-6 glass text-slate-800 px-4 py-2 rounded-xl text-xs font-black shadow-xl flex items-center gap-2 bg-white border border-slate-200'>
                    <FontAwesomeIcon icon={faCircleCheck} className='text-emerald-500' />
                    100% Authentic
                </div>
                {/* Discount badge */}
                {/* <div className='absolute top-6 right-6 w-14 h-14 rounded-2xl bg-indigo-500 flex flex-col items-center justify-center shadow-xl shadow-indigo-500/30'>
                    <span className='text-white font-black text-xs'>SAVE</span>
                    <span className='text-white font-black text-sm'>${savings}</span>
                </div> */}
            </div>

            {/* Info Panel */}
            <div className='lg:w-1/2 p-8 lg:p-10 flex flex-col gap-7 overflow-y-auto custom-scrollbar bg-slate-950/50 backdrop-blur-3xl text-left'>

                {/* Category + Rating */}
                <div className='flex items-center justify-between gap-4 flex-wrap'>
                    <span className='badge badge-indigo'>{product.category.title}</span>
                    {/* <div className='flex items-center gap-2'>
                        <div className='flex items-center gap-0.5 text-amber-400 text-xs'>
                            {[1, 2, 3, 4, 5].map(s => (
                                <FontAwesomeIcon key={s} icon={faStar} className={s <= Math.round(rating) ? '' : 'text-slate-700'} />
                            ))}
                        </div>
                        <span className='text-sm font-bold text-slate-300'>{rating}</span>
                        <span className='text-xs text-slate-500'>({ratingCount} reviews)</span>
                    </div> */}
                </div>

                {/* Title */}
                <h1 className='text-2xl lg:text-3xl font-black leading-tight text-white'>
                    {product.title}
                </h1>

                {/* Price */}
                <div className='flex items-end gap-4'>
                    <span className='text-4xl font-black text-gradient'>${product.price}</span>
                    <span className='text-slate-500 line-through mb-1 text-lg'>${(product.price * 1.2).toFixed(2)}</span>
                    {/* <span className='badge badge-emerald mb-1'>20% OFF</span> */}
                </div>

                {/* Description */}
                <div>
                    <h3 className='text-xs font-black text-slate-500 uppercase tracking-widest mb-3'>Description</h3>
                    <p className='text-slate-300 leading-relaxed'>{product.description}</p>
                </div>

                {/* Features */}
                <div className='grid grid-cols-2 gap-3'>
                    {[
                        { icon: faTruckFast, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/15', label: 'Delivery', value: 'Free Shipping' },
                        // { icon: faShieldHalved, color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/15', label: 'Warranty', value: '2 Years' },
                    ].map(f => (
                        <div key={f.label} className={`glass p-4 rounded-2xl border flex gap-3 items-center ${f.bg}`}>
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${f.color} ${f.bg} border flex-shrink-0`}>
                                <FontAwesomeIcon icon={f.icon} className='text-sm' />
                            </div>
                            <div>
                                <p className='text-xs text-slate-500'>{f.label}</p>
                                <p className='text-sm font-bold text-white'>{f.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Action */}
                <div className='mt-auto pt-6 border-t border-white/05'>
                    {existing?.qty > 0 ? (
                        <div className='flex items-center gap-4'>
                            <div className='flex items-center gap-4 bg-slate-800 rounded-2xl p-2 border border-slate-700'>
                                <button onClick={handleDecreaseQty} className='w-12 h-12 rounded-xl flex items-center justify-center hover:bg-slate-700 transition-colors'>
                                    <FontAwesomeIcon icon={faMinus} />
                                </button>
                                <span className='w-8 text-center font-black text-xl'>{existing.qty}</span>
                                <button onClick={handleIncreaseQty} className='w-12 h-12 rounded-xl flex items-center justify-center hover:bg-slate-700 transition-colors'>
                                    <FontAwesomeIcon icon={faPlus} />
                                </button>
                            </div>
                            {/* <span className='text-slate-400 text-sm font-semibold'>{existing.qty} in bag</span> */}
                        </div>
                    ) : (
                        <button
                            onClick={handleAddToCart}
                            className='btn-premium w-full py-5 rounded-2xl font-extrabold text-lg shadow-2xl shadow-indigo-600/30'
                        >
                            Add to Bag
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default DetailCard