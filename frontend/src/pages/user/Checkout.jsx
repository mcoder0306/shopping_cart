import { useForm } from 'react-hook-form'
import {
    faChevronLeft, faCreditCard, faTruck, faMobileScreenButton,
    faCheckCircle, faShieldHalved, faLock, faLocationDot,
    faPlus, faHome, faBriefcase, faMapPin
} from '@fortawesome/free-solid-svg-icons'
import { api } from '../../utils/api'
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { fetchDraftCart } from '../../store/cart/cartApi'
import PopUp from '../../components/user/Popup'
import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { toast } from 'react-toastify'
import { clearCart } from '../../features/CartSlice'

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
    const { register, handleSubmit: handleAddressSubmit, reset: resetAddress, formState: { errors: addressErrors } } = useForm()
    const cartItems = useSelector(state => state.cart.cartItems)
    const isLoggedin = useSelector(state => state.auth.isLoggedin)
    const cartId = useSelector(state => state.cart.cartId)
    const [selectedAddress, setSelectedAddress] = useState(null)
    const [addresses, setAddresses] = useState([])
    const [showAddressModal, setShowAddressModal] = useState(false)
    const [isAddressLoading, setIsAddressLoading] = useState(false)
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

    const fetchAddresses = async () => {
        try {
            const res = await api.get("/users/getAllAddresses")
            if (res.status === 200) {
                const addrs = res.data.data
                setAddresses(addrs)
                // Select default address if none selected
                if (addrs.length > 0 && !selectedAddress) {
                    const defaultAddr = addrs.find(a => a.isDefault) || addrs[0]
                    setSelectedAddress(defaultAddr)
                }
            }
        } catch (error) {
            console.error("Error fetching addresses:", error)
        }
    }

    const addressSubmitHandler = async (data) => {
        setIsAddressLoading(true)
        try {
            const res = await api.post("/users/addAddress", data)
            if (res.status === 201) {
                toast.success('Address added successfully! 🏠', {
                    theme: 'dark',
                    autoClose: 2000,
                })
                const newUser = res.data.data
                setAddresses(newUser.addresses)
                const newAddr = newUser.addresses[newUser.addresses.length - 1]
                setSelectedAddress(newAddr)
                setShowAddressModal(false)
                resetAddress({
                    name: '', phone: '', city: '', state: '', pincode: '', addressLine: '', label: 'home'
                })
            }
        } catch (error) {
            const msg = error.response?.data?.message || 'Action failed. Please try again.'
            toast.error(msg, { theme: 'dark' })
        } finally {
            setIsAddressLoading(false)
        }
    }

    const handleSubmit = async () => {
        try {
            if (!selectedAddress) {
                toast.error("Please select a delivery address!", {
                    theme: 'dark',
                    autoClose: 3000,
                })
                return
            }
            setLoading(true);

            const fullAddressString = `${selectedAddress.addressLine}, ${selectedAddress.city}, ${selectedAddress.state} - ${selectedAddress.pincode}`;

            const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(fullAddressString)}&key=b51ae248712348dba144320373413c01`)
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
                        total: totalPrice,
                        shippingAddress: selectedAddress // Optional: pass address object if backend supports it
                    });
                }
                else {
                    res = await api.post("/carts/updateCart", {
                        paymentMethod: selectedOpt,
                        paymentStatus: "completed",
                        orderStatus: "completed",
                        lat: cords.lat,
                        lng: cords.lng,
                        total: totalPrice,
                        shippingAddress: selectedAddress // Optional
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
                toast.error("Geocoding failed for this address!!", {
                    theme: 'dark',
                    autoClose: 3000,
                })
            }
        } catch (error) {
            const msg = error.response?.data?.message || 'Something went wrong. Please try again.'
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
                    fetchAddresses()
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
        <div className='max-w-7xl mx-auto px-4 md:px-6 pt-24 md:pt-36 pb-24'>
            <div className='flex flex-col gap-6 md:gap-10'>

                {/* Header */}
                <div className='flex items-center gap-4'>
                    <Link to="/" className='w-10 h-10 rounded-full glass border border-white/05 flex items-center justify-center hover:bg-white/05 transition-colors'>
                        <FontAwesomeIcon icon={faChevronLeft} className='text-xs' />
                    </Link>
                    <div>
                        <h1 className='text-2xl md:text-4xl font-black text-white'>Checkout</h1>
                        <p className='text-slate-400 text-xs md:text-sm'>{totalQty} item{totalQty !== 1 ? 's' : ''} in your order</p>
                    </div>
                </div>

                {/* Step Indicator */}
                <div className='flex items-center gap-0 overflow-x-auto pb-4 no-scrollbar'>
                    {steps.map((s, i) => (
                        <div key={s} className='flex items-center flex-1 last:flex-none min-w-[120px]'>
                            <div className='flex flex-col items-center gap-1'>
                                <div className={`w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center font-black text-xs md:text-sm border-2 transition-all ${i <= step ? 'bg-indigo-600 border-indigo-500 text-white' : 'border-slate-700 text-slate-600'}`}>
                                    {i < step ? <FontAwesomeIcon icon={faCheckCircle} className='text-sm' /> : i + 1}
                                </div>
                                <span className={`text-[10px] md:text-xs font-bold whitespace-nowrap ${i === step ? 'text-indigo-400' : i < step ? 'text-slate-300' : 'text-slate-600'}`}>{s}</span>
                            </div>
                            {i < steps.length - 1 && (
                                <div className={`h-0.5 flex-1 mx-2 md:mx-3 mb-5 transition-all ${i < step ? 'bg-indigo-600' : 'bg-slate-800'}`} />
                            )}
                        </div>
                    ))}
                </div>

                <div className='grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start'>
                    {/* Main Content Area */}
                    <div className='lg:col-span-8 flex flex-col gap-6 md:gap-8'>

                        {/* Section 1: Shipping Address */}
                        <div className='glass rounded-3xl md:rounded-4xl p-5 md:p-7 border border-white/03'>
                            <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8'>
                                <div className='flex items-center gap-4'>
                                    <div className='w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400'>
                                        <FontAwesomeIcon icon={faLocationDot} />
                                    </div>
                                    <h2 className='text-lg md:text-xl font-black text-white'>Shipping Address</h2>
                                </div>
                                {addresses.length > 0 && (
                                    <button onClick={() => setShowAddressModal(true)} className='btn-premium text-[10px] px-4 py-2.5 rounded-xl flex items-center justify-center gap-2'>
                                        <FontAwesomeIcon icon={faPlus} />
                                        Add New Address
                                    </button>
                                )}
                            </div>

                            <div className={addresses.length > 0 ? 'max-h-[140px] overflow-y-auto pr-2 custom-scrollbar' : ''}>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                    {addresses.length > 0 ? (
                                        addresses.map((addr) => (
                                            <div
                                                key={addr._id}
                                                onClick={() => setSelectedAddress(addr)}
                                                className={`p-4 rounded-3xl border border-gray-700 transition-all cursor-pointer group relative ${selectedAddress?._id === addr._id ? 'bg-indigo-600/10 border-indigo-500/50 shadow-[0_0_20px_rgba(99,102,241,0.1)]' : 'bg-white/02 border-white/03 hover:border-white/08'}`}
                                            >
                                                <div className='flex items-start gap-3'>
                                                    <div className={`mt-1 w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-all ${selectedAddress?._id === addr._id ? 'border-indigo-500 bg-indigo-500' : 'border-slate-600'}`}>
                                                        {selectedAddress?._id === addr._id && <div className='w-2 h-2 rounded-full bg-white' />}
                                                    </div>
                                                    <div className='flex-1'>
                                                        <div className='flex items-center gap-2 mb-2'>
                                                            <span className='font-black text-sm text-white capitalize'>{addr.name}</span>
                                                            <span className='badge badge-indigo text-[9px] px-2 py-0.5 opacity-80'>
                                                                <FontAwesomeIcon icon={addr.label === 'home' ? faHome : addr.label === 'work' ? faBriefcase : faMapPin} className='mr-1' />
                                                                {addr.label}
                                                            </span>
                                                        </div>
                                                        <p className='text-xs text-slate-400 leading-relaxed mb-3'>
                                                            {addr.addressLine}, {addr.city}, {addr.state} - {addr.pincode}
                                                        </p>
                                                        <div className='flex items-center gap-2 text-slate-500 text-[10px] font-bold uppercase tracking-wider'>
                                                            <FontAwesomeIcon icon={faMobileScreenButton} className='text-indigo-400' />
                                                            {addr.phone}
                                                        </div>
                                                    </div>
                                                </div>
                                                {addr.isDefault && (
                                                    <div className='absolute top-4 right-4 text-[8px] font-black text-indigo-400 uppercase tracking-tighter opacity-50'>Default</div>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <div className='col-span-full text-center py-6 px-6 rounded-3xl border-2 border-dashed border-gray-600 bg-white/01'>
                                            <div className='w-12 h-12 rounded-2xl bg-white/05 flex items-center justify-center mx-auto mb-3 text-slate-500 text-xl'>
                                                <FontAwesomeIcon icon={faLocationDot} />
                                            </div>
                                            <h3 className='text-white font-bold text-sm mb-1'>No addresses found</h3>
                                            <p className='text-slate-500 text-xs mb-4'>Add a delivery address to proceed with your order</p>
                                            <button onClick={() => setShowAddressModal(true)} className='btn-premium px-6 py-2.5 rounded-xl text-sm font-bold'>
                                                Add Your First Address
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Order Review */}
                        <div className='glass rounded-3xl md:rounded-4xl p-5 md:p-7 border border-white/03'>
                            <div className='flex items-center gap-4 mb-8'>
                                <div className='w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500'>
                                    <FontAwesomeIcon icon={faTruck} />
                                </div>
                                <h2 className='text-lg md:text-xl font-black text-white'>Review Items</h2>
                            </div>

                            <div className='max-h-[420px] overflow-y-auto pr-2 custom-scrollbar'>
                                <div className='space-y-4'>
                                    {cartItems?.map((item) => (
                                        <div key={item.product?._id || item.product} className='p-3 md:p-4 rounded-2xl md:rounded-3xl bg-white/02 border border-gray-700 flex gap-4 md:gap-6 items-center hover:border-white/10 transition-colors'>
                                            <div className='w-16 h-16 md:w-20 md:h-20 bg-white rounded-xl md:rounded-2xl p-2 md:p-3 shrink-0 group overflow-hidden'>
                                                <img src={`http://localhost:3000/${item.product?.image?.replace('uploads/', '')}`} alt={item.product?.title} className='w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500' />
                                            </div>
                                            <div className='flex-1 min-w-0'>
                                                <div className='flex flex-col sm:flex-row sm:items-start justify-between gap-1 sm:gap-4 mb-2'>
                                                    <h3 className='font-bold text-slate-100 text-xs md:text-sm line-clamp-2'>{item.product?.title}</h3>
                                                    <p className='font-black text-sm md:text-base text-white text-nowrap'>${(item.product?.price * item.qty).toFixed(2)}</p>
                                                </div>
                                                <div className='flex items-center gap-4'>
                                                    {item.product?.category?.title && (
                                                        <span className='badge badge-indigo text-[9px] md:text-[10px] px-2 py-0.5'>{item.product.category.title}</span>
                                                    )}
                                                    <span className='text-[10px] md:text-[11px] text-slate-500 font-bold uppercase'>Qty: {item.qty}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Area: Payment + Summary */}
                    <div className='lg:col-span-4 flex flex-col gap-6 md:sticky md:top-32'>

                        {/* Finalization Card (Payment + Summary) */}
                        <div className='glass rounded-3xl md:rounded-[2.5rem] p-6 md:p-7 border border-white/03 shadow-2xl space-y-7'>

                            {/* Payment Section */}
                            <div>
                                <h3 className='text-base md:text-lg font-black text-white mb-5 flex items-center gap-3'>
                                    <div className='w-8 h-8 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 text-xs'>
                                        <FontAwesomeIcon icon={faLock} />
                                    </div>
                                    Payment Method
                                </h3>
                                <div className='flex flex-col gap-2.5'>
                                    {[
                                        { id: 'cod', label: 'Cash', desc: 'Pay at door', icon: faTruck },
                                        { id: 'upi', label: 'UPI', desc: 'Scan & Pay', icon: faMobileScreenButton },
                                        { id: 'card', label: 'Card', desc: 'Secure Pay', icon: faCreditCard }
                                    ].map((opt) => (
                                        <label
                                            key={opt.id}
                                            className={`flex items-center gap-3 p-3.5 rounded-2xl border border-gray-700 transition-all cursor-pointer ${selectedOpt === opt.id ? 'bg-indigo-600/10 border-indigo-500/40 shadow-[0_0_15px_rgba(99,102,241,0.15)]' : 'bg-white/02 border-white/03 hover:border-white/08'}`}
                                        >
                                            <input type="radio" name="payment" value={opt.id} checked={selectedOpt === opt.id} onChange={(e) => setSelectedOpt(e.target.value)} className='hidden' />
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-base ${selectedOpt === opt.id ? 'bg-indigo-500 text-white' : 'bg-white/05 text-slate-500'}`}>
                                                <FontAwesomeIcon icon={opt.icon} className='text-sm' />
                                            </div>
                                            <div className='flex-1 min-w-0'>
                                                <p className='font-black text-xs text-white truncate'>{opt.label}</p>
                                                <p className='text-[9px] text-slate-500 font-bold uppercase tracking-wider truncate'>{opt.desc}</p>
                                            </div>
                                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${selectedOpt === opt.id ? 'border-indigo-500 bg-indigo-500' : 'border-slate-700'}`}>
                                                {selectedOpt === opt.id && <div className='w-1 h-1 rounded-full bg-white transition-all' />}
                                            </div>
                                        </label>
                                    ))}
                                </div>

                                {selectedOpt === "card" && (
                                    <div className='mt-5 p-4 rounded-xl border border-gray-700 bg-white/02 focus-within:border-indigo-500/30 transition-all'>
                                        <div className='flex items-center gap-2.5 mb-3 text-[9px] font-black text-slate-400 uppercase tracking-widest'>
                                            <FontAwesomeIcon icon={faCreditCard} className='text-indigo-400' />
                                            Card Details
                                        </div>
                                        <CardElement options={{ ...CARD_ELEMENT_OPTIONS, fontSize: '14px' }} />
                                    </div>
                                )}
                            </div>

                            <div className='h-px bg-white/05' />

                            {/* Order Summary */}
                            <div>
                                <h3 className='text-lg md:text-xl font-black text-white mb-6'>Order Summary</h3>
                                <div className='space-y-4 mb-8'>
                                    <div className='flex justify-between items-center text-slate-400 font-medium'>
                                        <span className='text-sm'>Subtotal ({totalQty} items)</span>
                                        <span className='text-white font-bold'>${totalPrice.toFixed(2)}</span>
                                    </div>
                                    <div className='flex justify-between items-center text-slate-400 font-medium'>
                                        <span className='text-sm'>Shipping Fee</span>
                                        <span className='text-emerald-400 font-black text-xs uppercase tracking-widest'>Free</span>
                                    </div>
                                    <div className='h-px bg-white/05 my-4' />
                                    <div className='flex justify-between items-center text-slate-400 font-medium'>
                                        <span className='text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]'>Total Amount</span>
                                        <span className='text-xl md:text-2xl font-black text-white tracking-tighter leading-none'>${totalPrice.toFixed(2)}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className={`btn-premium w-full py-4 md:py-5 rounded-2xl font-black text-base md:text-lg shadow-xl shadow-indigo-600/20 flex flex-col items-center gap-1 transition-all active:scale-[0.98] ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    {loading ? (
                                        <div className='flex items-center gap-3'>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            <span>Processing...</span>
                                        </div>
                                    ) : (
                                        <>
                                            <span>Complete Purchase</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* Address Modal */}
            <PopUp openPopUp={showAddressModal} closePopUp={() => setShowAddressModal(false)}>
                <div className='p-6 md:p-8 w-full max-w-lg'>
                    <div className='flex items-center gap-4 md:gap-5 mb-8 md:mb-10'>
                        <div className='w-12 h-12 md:w-14 md:h-14 rounded-2xl md:rounded-3xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 text-xl md:text-2xl shadow-inner'>
                            <FontAwesomeIcon icon={faLocationDot} />
                        </div>
                        <div>
                            <h2 className='text-2xl md:text-3xl font-black text-white tracking-tight'>Add New Address</h2>
                            <p className='text-slate-500 text-xs md:text-sm font-medium'>Set up a new delivery destination</p>
                        </div>
                    </div>

                    <form onSubmit={handleAddressSubmit(addressSubmitHandler)} className='space-y-4 md:space-y-6'>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6'>
                            <div className='space-y-2'>
                                <label className='text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1'>Full Name</label>
                                <input type="text" {...register("name", { required: "Name is required" })} className='premium-input rounded-xl md:rounded-2xl py-3 md:py-4' placeholder='John Doe' />
                                {addressErrors.name && <p className='text-red-400 text-[10px] font-bold mt-1 px-1'>{addressErrors.name.message}</p>}
                            </div>
                            <div className='space-y-2'>
                                <label className='text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1'>Phone Number</label>
                                <input type="text" {...register("phone", { required: "Required", pattern: { value: /^[0-9]{10}$/, message: "10 digits required" } })} className='premium-input rounded-xl md:rounded-2xl py-3 md:py-4' placeholder='8888888888' />
                                {addressErrors.phone && <p className='text-red-400 text-[10px] font-bold mt-1 px-1'>{addressErrors.phone.message}</p>}
                            </div>
                        </div>

                        <div className='space-y-2'>
                            <label className='text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1'>Street Address</label>
                            <input type="text" {...register("addressLine", { required: "Address is required" })} className='premium-input rounded-xl md:rounded-2xl py-3 md:py-4' placeholder='Flat/House No, Street, Apartment' />
                        </div>

                        <div className='grid grid-cols-2 gap-4 md:gap-6'>
                            <div className='space-y-2'>
                                <label className='text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1'>City</label>
                                <input type="text" {...register("city", { required: true })} className='premium-input rounded-xl md:rounded-2xl py-3 md:py-4' placeholder='City' />
                            </div>
                            <div className='space-y-2'>
                                <label className='text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1'>State</label>
                                <input type="text" {...register("state", { required: true })} className='premium-input rounded-xl md:rounded-2xl py-3 md:py-4' placeholder='State' />
                            </div>
                        </div>

                        <div className='grid grid-cols-2 gap-4 md:gap-6'>
                            <div className='space-y-2'>
                                <label className='text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1'>Pincode</label>
                                <input type="text" {...register("pincode", { required: true, pattern: /^[0-9]{6}$/ })} className='premium-input rounded-xl md:rounded-2xl py-3 md:py-4' placeholder='6-digit code' />
                            </div>
                            <div className='space-y-2'>
                                <label className='text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1'>Label As</label>
                                <select {...register("label")} className='premium-input rounded-xl md:rounded-2xl py-3 md:py-4 bg-[#0f172a] appearance-none'>
                                    <option value="home">Home</option>
                                    <option value="work">Work</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>

                        <div className='pt-4 pb-2'>
                            <button disabled={isAddressLoading} className='btn-premium w-full py-4 md:py-5 rounded-xl md:rounded-2xl font-black text-sm md:text-base shadow-xl shadow-indigo-600/20 active:scale-[0.98] transition-all'>
                                {isAddressLoading ? (
                                    <div className='flex items-center justify-center gap-3'>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span>Saving Address...</span>
                                    </div>
                                ) : 'Save & Continue'}
                            </button>
                        </div>
                    </form>
                </div>
            </PopUp>
        </div>
    )
}

export default Checkout