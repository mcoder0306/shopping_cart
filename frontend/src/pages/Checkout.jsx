import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router'
import { clearCart } from '../features/CartSlice'
import { toast } from 'react-toastify'
import { addOrders } from '../features/OrderSlice'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faCreditCard, faTruck, faMobileScreenButton, faCheckCircle, faShieldHalved, faLock, faLocationDot } from '@fortawesome/free-solid-svg-icons'
import { api } from '../utils/api'
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { fetchDraftCart } from '../store/cart/cartApi'

const steps = ['Review Order', 'Payment', 'Confirm']

const CARD_ELEMENT_OPTIONS = {
    style: {
        base: {
            color: "#ffffff",
            fontFamily: 'Inter, sans-serif',
            fontSmoothing: "antialiased",
            fontSize: "16px",
            "::placeholder": {
                color: "#94a3b8",
            },
        },
        invalid: {
            color: "#ef4444",
            iconColor: "#ef4444",
        },
    },
};

function Checkout() {
    const cartItems = useSelector(state => state.cart.cartItems)
    const isLoggedin = useSelector(state => state.auth.isLoggedin)
    const cartId = useSelector(state => state.cart.cartId)
    const [address, setAddress] = useState("")
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [step] = useState(1)
    const stripe = useStripe()
    const elements = useElements()

    const [selectedOpt, setSelectedOpt] = useState("cod");

    const totalQty = cartItems?.reduce((total, item) => total + item.qty, 0);
    const totalPrice = cartItems?.reduce((total, item) => {
        return total + (item.product?.price * item.qty || 0);
    }, 0);

    const handleSubmit = async () => {
        try {
            if (!address) {
                toast.error("please enter address!!", {
                    theme: 'dark',
                    autoClose: 3000,
                })
                return
            }
            setLoading(true);
            const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(address)}&key=b51ae248712348dba144320373413c01`)
            const data = await response.json()
            let cords
            cords = data.results[0]?.geometry
            if (cords) {
                const paymentIntent = await api.post("/payment/create-payment-intent", {
                    total: totalPrice,
                    cartId: cartId
                })
                let res
                if (selectedOpt === "card") {
                    if (!stripe || !elements) {
                        toast.error("Stripe not loaded yet");
                        return;
                    }
                    const result = await stripe.confirmCardPayment(paymentIntent.data.data, {
                        payment_method: {
                            card: elements.getElement(CardElement),
                        },
                    });
                    if (result.error) {
                        toast.error(result.error.message);
                        setLoading(false);
                        return;
                    }

                    if (result.paymentIntent.status !== "succeeded") {
                        toast.error("Payment failed");
                        setLoading(false);
                        return;
                    }
                    const status = result.paymentIntent.status === "succeeded" ? "completed" : "cancelled"
                    res = await api.post("/carts/updateCart", {
                        paymentMethod: selectedOpt,
                        paymentStatus: status,
                        orderStatus: "draft",
                        lat: cords.lat,
                        lng: cords.lng,
                        total: totalPrice
                    });
                }
                else {
                    res = await api.post("/carts/updateCart", {
                        paymentMethod: selectedOpt,
                        paymentStatus: "completed",
                        orderStatus: "completed",
                        lat: cords.lat,
                        lng: cords.lng,
                        total: totalPrice
                    })
                }
                if (res.status === 200 || res.status === 201) {
                    toast.success('Order Placed Successfully! 🎉', {
                        position: "top-right",
                        autoClose: 2500,
                        theme: "dark",
                    });

                    dispatch(clearCart())
                    setTimeout(() => navigate('/orders'), 1200);
                }
            }
            else {
                toast.error("This address does not exists!!", {
                    theme: 'dark',
                    autoClose: 3000,
                })
            }
        } catch (error) {
            const msg = error.response?.data?.message || 'something went wrong. Please try again.'
            toast.error(msg, {
                theme: 'dark',
                autoClose: 3000,
            })
        } finally {
            setLoading(false);
        }
    }

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchcart = async () => {
            try {
                if (isLoggedin) {
                    fetchDraftCart(dispatch)
                }
            } catch (error) {
                const msg = error.response?.data?.message || 'something went wrong. Please try again.'
                toast.error(msg, {
                    theme: 'dark',
                    autoClose: 3000,
                })
            }
        }
        fetchcart()
    }, [isLoggedin, dispatch])


    if (cartItems.length === 0) {
        return (
            <div className='max-w-7xl mx-auto px-6 pt-44 pb-20 text-center flex flex-col items-center gap-8'>
                <div className='w-24 h-24 rounded-3xl glass border border-white/05 flex items-center justify-center'>
                    <FontAwesomeIcon icon={faTruck} className='text-4xl text-slate-500' />
                </div>
                <div>
                    <h1 className='text-4xl font-black mb-3'>Your bag is empty</h1>
                    <p className='text-slate-400'>Add some products before checking out.</p>
                </div>
                <Link to="/" className='btn-premium px-8 py-4 rounded-2xl font-bold'>
                    Start Shopping
                </Link>
            </div>
        )
    }

    return (
        <div className='max-w-7xl mx-auto px-6 pt-36 pb-24'>
            <div className='flex flex-col gap-10'>

                {/* Header */}
                <div className='flex items-center gap-4'>
                    <Link to="/" className='w-10 h-10 rounded-full glass border border-white/05 flex items-center justify-center hover:bg-white/05 transition-colors'>
                        <FontAwesomeIcon icon={faChevronLeft} className='text-xs' />
                    </Link>
                    <div>
                        <h1 className='text-4xl font-black text-white'>Checkout</h1>
                        <p className='text-slate-400 text-sm'>{totalQty} item{totalQty !== 1 ? 's' : ''} in your order</p>
                    </div>
                </div>

                {/* Step Indicator */}
                <div className='flex items-center gap-0'>
                    {steps.map((s, i) => (
                        <div key={s} className='flex items-center flex-1 last:flex-none'>
                            <div className='flex flex-col items-center gap-1'>
                                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-sm border-2 transition-all ${i <= step ? 'bg-indigo-600 border-indigo-500 text-white' : 'border-slate-700 text-slate-600'}`}>
                                    {i < step ? <FontAwesomeIcon icon={faCheckCircle} className='text-sm' /> : i + 1}
                                </div>
                                <span className={`text-xs font-bold whitespace-nowrap ${i === step ? 'text-indigo-400' : i < step ? 'text-slate-300' : 'text-slate-600'}`}>{s}</span>
                            </div>
                            {i < steps.length - 1 && (
                                <div className={`h-0.5 flex-1 mx-3 mb-5 transition-all ${i < step ? 'bg-indigo-600' : 'bg-slate-800'}`} />
                            )}
                        </div>
                    ))}
                </div>

                <div className='grid grid-cols-1 lg:grid-cols-3 gap-10 items-start'>
                    {/* Order Summary */}
                    <div className='lg:col-span-2 flex flex-col gap-4'>
                        <h2 className='text-xl font-black text-white mb-2'>Order Summary</h2>
                        <div className='glass rounded-3xl overflow-hidden border border-white/05'>
                            <div className='divide-y divide-white/05'>
                                {cartItems?.map((item) => (
                                    <div key={item.product?._id || item.product} className='p-5 flex gap-5 items-center hover:bg-white/02 transition-colors'>
                                        <div className='w-20 h-20 bg-white rounded-2xl p-3 flex-shrink-0'>
                                            <img src={`http://localhost:3000/${item.product?.image?.replace('uploads/', '')}`} alt={item.product?.title} className='w-full h-full object-contain mix-blend-multiply' />
                                        </div>
                                        <div className='flex-1 min-w-0'>
                                            <h3 className='font-bold text-slate-100 text-sm line-clamp-2 mb-1'>{item.product?.title}</h3>
                                            {item.product?.category?.title && (
                                                <span className='badge badge-indigo text-[10px]'>{item.product.category.title}</span>
                                            )}
                                            <p className='text-xs text-slate-500 mt-1'>Qty: {item.qty}</p>
                                        </div>
                                        <div className='text-right flex-shrink-0'>
                                            <p className='font-black text-lg text-white'>${(item.product?.price * item.qty).toFixed(2)}</p>
                                            <p className='text-xs text-slate-500'>${item.product?.price} each</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Payment + Total */}
                    <div className='flex flex-col gap-5 sticky top-32'>
                        <div className='glass rounded-3xl p-4 sm:p-7 border border-white/05'>
                            <div className='mb-6'>
                                <label htmlFor="address" className='block text-sm font-black text-white mb-2 ml-1 flex items-center gap-2'>
                                    <FontAwesomeIcon icon={faLocationDot} className='text-indigo-400 text-xs' />
                                    Delivery Address <span className='text-red-500'>*</span>
                                </label>
                                <div className='relative'>
                                    <input
                                        type="text"
                                        id="address"
                                        placeholder='Enter your delivery address'
                                        className='premium-input pl-11'
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                    />

                                </div>
                            </div>
                            {/* Payment Method */}
                            <div className='mb-7'>
                                <h3 className='text-base font-black text-white mb-4 flex items-center gap-2'>
                                    <FontAwesomeIcon icon={faLock} className='text-indigo-400 text-sm' />
                                    Payment Method
                                </h3>
                                <div className='flex flex-col gap-3'>
                                    {[
                                        { id: 'cod', label: 'Cash on Delivery', icon: faTruck },
                                        { id: 'upi', label: 'UPI / Digital Wallet', icon: faMobileScreenButton },
                                        { id: 'card', label: 'Credit / Debit Card', icon: faCreditCard }
                                    ].map((opt) => (
                                        <label
                                            key={opt.id}
                                            className={`flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer ${selectedOpt === opt.id ? 'bg-indigo-600/15 border-indigo-500/60 text-white' : 'bg-white/02 border-white/06 text-slate-400 hover:border-white/15'}`}
                                        >
                                            <input
                                                type="radio"
                                                name="payment"
                                                value={opt.id}
                                                checked={selectedOpt === opt.id}
                                                onChange={(e) => setSelectedOpt(e.target.value)}
                                                className='hidden'
                                            />
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${selectedOpt === opt.id ? 'border-indigo-500 bg-indigo-500' : 'border-slate-600'}`}>
                                                {selectedOpt === opt.id && <div className='w-2 h-2 rounded-full bg-white' />}
                                            </div>
                                            <FontAwesomeIcon icon={opt.icon} className={selectedOpt === opt.id ? 'text-indigo-400' : 'text-slate-600'} />
                                            <span className='font-semibold text-sm'>{opt.label}</span>
                                            {selectedOpt === opt.id && <FontAwesomeIcon icon={faCheckCircle} className='ml-auto text-indigo-500' />}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Price Breakdown */}
                            <div className='border-t border-white/05 pt-6 flex flex-col gap-3 mb-7'>
                                <div className='flex justify-between text-slate-400 text-sm'>
                                    <span>Subtotal ({totalQty} items)</span>
                                    <span>${totalPrice.toFixed(2)}</span>
                                </div>
                                <div className='flex justify-between text-slate-400 text-sm'>
                                    <span>Shipping</span>
                                    <span className='text-emerald-400 font-bold text-xs tracking-widest uppercase'>Free</span>
                                </div>
                                <div className='section-divider my-1' />
                                <div className='flex justify-between text-lg font-black text-white'>
                                    <span>Order Total</span>
                                    <span className='text-gradient'>${totalPrice.toFixed(2)}</span>
                                </div>
                            </div>

                            {selectedOpt === "card" && (
                                <div className='mb-7'>
                                    <h3 className='text-base font-black text-white mb-4 flex items-center gap-2'>
                                        <FontAwesomeIcon icon={faCreditCard} className='text-indigo-400 text-sm' />
                                        Card Details
                                    </h3>
                                    <div className='p-4 rounded-2xl border border-white/10 bg-white/02 focus-within:border-indigo-500/50 transition-all'>
                                        <CardElement options={CARD_ELEMENT_OPTIONS} />
                                    </div>
                                </div>
                            )}

                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className={`btn-premium w-full py-5 rounded-2xl font-extrabold text-base shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-3 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {loading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    'Complete Purchase'
                                )}
                            </button>

                            <div className='flex items-center justify-center gap-2 mt-4 text-slate-500 text-xs'>
                                <FontAwesomeIcon icon={faShieldHalved} />
                                <span>Secure &amp; encrypted checkout</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Checkout