import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addTocart, decreaceQty, increaceQty, removeFromCart } from '../features/CartSlice'
import { Bounce, toast } from 'react-toastify'
import PopUp from './Popup'
import DetailCard from './DetailCard'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faMinus, faInfoCircle, faStar, faHeart } from '@fortawesome/free-solid-svg-icons'
import { api } from '../utils/api'

function Card({ product, favourites }) {
    const dispatch = useDispatch()
    const cartItems = useSelector(state => state.cart.cartItems)
    const existing = cartItems.find(item => (item.product?._id || item.product) === product._id)
    const [openPopup, setOpenPopup] = useState(null);
    const [wishlisted, setWishlisted] = useState(false);
    const HandleRemovePopUp = () => setOpenPopup(null);
    const user = useSelector(state => state.auth.user)
    const isLoggedin = useSelector(state => state.auth.isLoggedin)
    const rating = (product.rating?.rate || 4.2).toFixed(1);
    const ratingCount = product.rating?.count || 120;
    const [cartItemsinDb, setCartItemsinDb] = useState([])
    const handleFavourite = async () => {
        try {
            const res = await api.post(`/favourites/addTofavourite/${product?._id}`)
            if (res.status === 201) {
                setWishlisted(prev => !prev);
                toast.success(res.data.data.message || 'Product added to favourite! 🎉', {
                    theme: 'dark',
                    autoClose: 2500,
                })
            }
            else {
                setWishlisted(prev => !prev);
                toast.warning(res.data.data.message || 'Product removed from favourite! ', {
                    theme: 'dark',
                    autoClose: 2500,
                })
            }
        } catch (error) {
            toast.warning(res.data.message || 'Something went wrong', {
                theme: 'dark',
            })
        }
    }

    const handleAddToCart = async () => {
        try {
            if (!user) {
                dispatch(addTocart({ product: product._id, qty: 1, price: product.price }))
            }
            else {
                const res = await api.post(`/carts/addToCart/${product._id}`, {
                    qty: 1,
                    price: product.price
                })
                if (res.status === 201 || res.status === 200) {
                    // dispatch(addTocart({ product: product._id, qty: 1, price: product.price }))
                    toast.success(res.data.data.message || 'Product added to cart! 🎉', {
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
            const msg = error.response?.data?.message || 'logout failed. Please try again.'
            toast.error(msg, {
                theme: 'dark',
                autoClose: 3000,
            })
        }

    }
    const handleDecreaseQty = async () => {
        try {
            if (!user) {
                dispatch(decreaceQty({ product: product._id }))
                if (existing.qty === 1) {
                    dispatch(removeFromCart({ product: product._id }))
                }
            }
            else {
                const res = await api.post(`/carts/addToCart/${product._id}`, {
                    qty: existing.qty - 1,
                    price: product.price
                })
                if (res.status === 200 || res.status === 201) {
                    // dispatch(decreaceQty({ product: product._id }))
                    if (existing.qty === 1) {
                        dispatch(removeFromCart({ product: product._id }))
                    }
                } else {
                    toast.warning(res.data.data.message || 'Something went wrong', {
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

    const handleIncreaseQty = async () => {
        try {
            if (!user) {
                dispatch(increaceQty({ product: product._id }))
            }
            else {
                const res = await api.post(`/carts/addToCart/${product._id}`, {
                    qty: existing.qty + 1,
                    price: product.price
                })
                if (res.status === 200 || res.status === 201) {
                    // dispatch(increaceQty({ product: product._id }))
                } else {
                    toast.warning(res.data.data.message || 'Something went wrong', {
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

    useEffect(() => {
        const checkFavourites = async () => {
            if (favourites && product?._id) {
                const isFav = favourites?.includes(product?._id);
                setWishlisted(isFav);
            }
        }
        checkFavourites()
    }, [favourites, product._id])

    useEffect(() => {
        const loadCartItems = async () => {
            const res = await api.get(`/carts/getCart/draft`)
            if (res.status === 200) {
                setCartItemsinDb(res.data.data.items || [])
            }
            else {
                toast.error(res.data.message, {
                    theme: 'dark',
                    autoClose: 3000,
                })
            }
        }
        if (isLoggedin) {
            loadCartItems()
        }
    }, [isLoggedin])
    return (
        <div className='glass-hover rounded-3xl p-5 h-full flex flex-col glass border border-white/05 relative group product-card'>
            {/* Action Buttons */}
            <div className='absolute top-4 right-4 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0'>
                <button
                    onClick={() => setOpenPopup("detailpopup")}
                    className='w-9 h-9 rounded-full glass border border-white/10 flex items-center justify-center hover:bg-indigo-500 hover:border-indigo-500 transition-all text-sm'
                    title="Quick view"
                >
                    <FontAwesomeIcon icon={faInfoCircle} />
                </button>
                <button
                    onClick={handleFavourite}
                    className={`w-9 h-9 rounded-full glass border flex items-center justify-center transition-all text-sm ${wishlisted ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-400' : 'border-white/10 text-slate-400 hover:text-indigo-400 hover:border-indigo-400/30'}`}
                    title="Wishlist"
                >
                    <FontAwesomeIcon icon={faHeart} />
                </button>
            </div>

            {/* Image */}
            <div className='relative aspect-square mb-5 rounded-2xl overflow-hidden bg-white p-6 product-card-image'>
                <img
                    src={`http://localhost:3000/${product.image?.replace('uploads/', '')}`}
                    alt={product.title}
                    className='w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-110'
                />
            </div>

            {/* Info */}
            <div className='flex-1 flex flex-col gap-2'>
                <span className='badge badge-indigo text-[10px]'>
                    {product.category?.title}
                </span>

                <h3 className='font-bold text-base line-clamp-2 text-slate-100 group-hover:text-indigo-300 transition-colors leading-snug'>
                    {product.title}
                </h3>

                {/* Rating */}
                {/* <div className='flex items-center gap-2'>
                    <div className='flex items-center gap-0.5 text-amber-400 text-xs'>
                        {[1, 2, 3, 4, 5].map(s => (
                            <FontAwesomeIcon key={s} icon={faStar} className={s <= Math.round(rating) ? 'text-amber-400' : 'text-slate-700'} />
                        ))}
                    </div>
                    <span className='text-xs text-slate-500'>{rating} ({ratingCount})</span>
                </div> */}

                {/* Price + Action */}
                <div className='mt-auto pt-4 flex items-center justify-between gap-3'>
                    <div>
                        <span className='text-xl font-black text-white'>${product.price}</span>
                        <span className='text-xs text-slate-600 line-through ml-2'>${(product.price * 1.2).toFixed(2)}</span>
                    </div>
                    {
                        product.stock === 0 ? (
                            <div className='text-gray-400 rounded-xl'>Out of Stock</div>
                        ) :
                            (
                                existing?.qty > 0 ? (
                                    <div className='qty-counter'>
                                        <button onClick={handleDecreaseQty} className='qty-btn'>
                                            <FontAwesomeIcon icon={faMinus} />
                                        </button>
                                        <span className='w-5 text-center font-black text-sm'>{existing.qty}</span>
                                        <button onClick={handleIncreaseQty} className='qty-btn disabled:cursor-not-allowed' disabled={existing.qty >= product.stock}>
                                            <FontAwesomeIcon icon={faPlus} />
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => handleAddToCart(1)}
                                        className='btn-premium px-5 py-2 rounded-full text-sm font-bold flex-shrink-0'
                                    >
                                        Add to Bag
                                    </button>
                                )
                            )
                    }
                </div>
            </div>

            <PopUp openPopUp={openPopup === "detailpopup"} closePopUp={HandleRemovePopUp} id="detailpopup" className="justify-center items-center" innerClass="w-full max-w-4xl glass rounded-3xl overflow-hidden h-fit max-h-[90vh]">
                <DetailCard product={product} />
            </PopUp>
        </div>
    )
}

export default Card