import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import OrderCard from '../components/OrderCard'
import { Link } from 'react-router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faBoxArchive, faTruck, faMobileScreenButton, faCreditCard } from '@fortawesome/free-solid-svg-icons'
import { api } from '../utils/api'
import { useState } from 'react'
import { Oval } from 'react-loader-spinner'
import { toast } from 'react-toastify'
import { fetchCompletedCart } from '../store/cart/cartApi'

const paymentIcons = {
    cod: faTruck,
    upi: faMobileScreenButton,
    card: faCreditCard,
}

const paymentColors = {
    cod: 'badge-emerald',
    upi: 'badge-indigo',
    card: 'badge-amber',
}

function Orders() {
    const dispatch = useDispatch()
    const orders = useSelector(state => state.cart.completedCart)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const loadOrders = async () => {
            try {
                fetchCompletedCart(dispatch)
                setIsLoading(false)
            } catch (error) {
                console.log(error)
                toast.warning('Something went wrong please try again!!', {
                    theme: 'dark',
                })
                setIsLoading(false)
            }
        }
        loadOrders()
    }, [dispatch])

    return (
        <div className='max-w-7xl mx-auto px-6 pt-36 pb-24'>
            <div className='flex flex-col gap-10'>

                {/* Header */}
                <div className='flex items-center gap-4 animate-fade-in'>
                    <Link to="/" className='w-10 h-10 rounded-full glass border border-white/05 flex items-center justify-center hover:bg-white/05 transition-colors'>
                        <FontAwesomeIcon icon={faChevronLeft} className='text-xs' />
                    </Link>
                    <div>
                        <h1 className='text-4xl font-black text-white'>Your Orders</h1>
                        <p className='text-slate-400 text-sm'>{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>
                    </div>
                </div>
                {
                    isLoading ?
                        (
                            <div className='flex m-auto'>
                                <Oval
                                    height={100}
                                    width={100}
                                    color="#6a6ff2"
                                    wrapperStyle={{}}
                                    wrapperClass=""
                                    visible={true}
                                    ariaLabel='oval-loading'
                                    secondaryColor="#6a6ff2"
                                    strokeWidth={2}
                                    strokeWidthSecondary={2}
                                />
                            </div>
                        )
                        :
                        (
                            <div className='flex flex-col gap-8'>
                                {orders.length === 0 ? (
                                    <div className='text-center py-36 glass rounded-3xl border border-white/05 flex flex-col items-center gap-6 animate-fade-in'>
                                        <div className='w-24 h-24 rounded-3xl glass border border-white/05 flex items-center justify-center animate-float'>
                                            <FontAwesomeIcon icon={faBoxArchive} className='text-3xl text-slate-600' />
                                        </div>
                                        <div>
                                            <h2 className='text-2xl font-black mb-2 text-white'>No orders yet</h2>
                                            <p className='text-slate-400'>When you place an order, it will appear here.</p>
                                        </div>
                                        <Link to="/" className='btn-premium px-8 py-4 rounded-2xl font-bold'>
                                            Explore Products
                                        </Link>
                                    </div>
                                ) : (
                                    [...orders]?.reverse().map((orderitem, idx) => (
                                        <div key={orderitem?._id} className='glass rounded-3xl border border-white/05 overflow-hidden animate-slide-up' style={{ animationDelay: `${idx * 60}ms` }}>
                                            {/* Order Header */}
                                            <div className='p-6 md:p-8 bg-slate-800/20 border-b border-white/05'>
                                                <div className='flex flex-wrap justify-between items-start gap-6'>
                                                    <div className='flex gap-8 flex-wrap'>
                                                        <div>
                                                            <p className='text-[10px] uppercase font-black text-slate-500 tracking-widest mb-1'>Order Placed</p>
                                                            <p className='font-bold text-white'>{orderitem?.createdAt?.slice(0, 10)}</p>
                                                        </div>
                                                        <div>
                                                            <p className='text-[10px] uppercase font-black text-slate-500 tracking-widest mb-1'>Order ID</p>
                                                            <p className='font-bold text-slate-300'>#{orderitem._id}</p>
                                                        </div>
                                                        <div>
                                                            <p className='text-[10px] uppercase font-black text-slate-500 tracking-widest mb-1'>Payment</p>
                                                            <span className={`badge ${paymentColors[orderitem.paymentMethod] || 'badge-indigo'} flex items-center gap-1.5 w-fit mt-0.5`}>
                                                                {paymentIcons[orderitem.paymentMethod] && <FontAwesomeIcon icon={paymentIcons[orderitem.paymentMethod]} />}
                                                                {orderitem?.paymentMethod?.toUpperCase()}
                                                            </span>
                                                        </div>
                                                        <Link to={`/orderTracking/${orderitem._id}`} className='text-gray-400 underline'>Track Order</Link>

                                                    </div>
                                                    <div className='text-right'>
                                                        <p className='text-[10px] uppercase font-black text-slate-500 tracking-widest mb-1'>Total</p>
                                                        <p className='text-2xl font-black text-gradient'>${(orderitem?.total || 0).toFixed(2)}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Order Items */}
                                            <div className='p-6 md:p-8'>
                                                <OrderCard orderitem={orderitem?.items} />
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )
                }

            </div>
        </div>
    )
}

export default Orders