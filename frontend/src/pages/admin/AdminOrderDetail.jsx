import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../utils/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faUser, faEnvelope, faPhone, faMapMarkerAlt, faCalendarAlt, faCreditCard, faTruck, faBox, faUserMd } from '@fortawesome/free-solid-svg-icons';
import { Oval } from 'react-loader-spinner';
import { toast } from 'react-toastify';

function AdminOrderDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await api.get(`/dashboard/getOrderById/${id}`);
                if (res.status === 200) {
                    setOrder(res.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch order details:", error);
                toast.error("Failed to load order details");
            } finally {
                setIsLoading(false);
            }
        };
        fetchOrder();
    }, [id]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Oval height={60} width={60} color="#6366f1" secondaryColor="#6366f133" />
                <p className="text-slate-500 font-bold animate-pulse uppercase tracking-[0.2em] text-xs">Loading Order Details...</p>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
                <div className="w-20 h-20 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500 text-3xl">
                    <FontAwesomeIcon icon={faBox} />
                </div>
                <h2 className="text-white text-2xl font-black">Order Not Found</h2>
                <button onClick={() => navigate('/admin/orders')} className="btn-premium px-8 py-3 rounded-xl font-bold">
                    Back to Orders
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8 animate-fade-in pb-20">
            {/* Header / Back Navigation */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <button
                    onClick={() => navigate('/admin/orders')}
                    className="flex items-center gap-3 text-slate-400 hover:text-white transition-all group self-start"
                >
                    <div className="w-10 h-10 rounded-xl glass border border-white/05 flex items-center justify-center group-hover:border-white/20 transition-all">
                        <FontAwesomeIcon icon={faArrowLeft} />
                    </div>
                    <span className="font-bold text-sm tracking-wide uppercase">Back to Orders</span>
                </button>

                <div className="flex items-center gap-4 self-end sm:self-auto">
                    <span className={`text-[10px] uppercase font-black px-4 py-1.5 rounded-full border tracking-widest shadow-xl
                    ${order.orderStatus === 'completed' ? 'border-emerald-500/30 text-emerald-500 bg-emerald-500/05 shadow-emerald-500/10' :
                            order.orderStatus === 'draft' ? 'border-amber-500/30 text-amber-500 bg-amber-500/05 shadow-amber-500/10' :
                                'border-blue-500/30 text-blue-500 bg-blue-500/05 shadow-blue-500/10'}`}
                    >
                        {order.orderStatus}
                    </span>
                    <span className="text-slate-600 font-black text-xs tracking-tighter">ORDER #{order.orderId || order._id.slice(-8).toUpperCase()}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Order Info */}
                <div className="lg:col-span-2 flex flex-col gap-8">
                    {/* Items Card */}
                    <div className="glass rounded-4xl border border-white/05 overflow-hidden shadow-2xl shadow-black/50">
                        <div className="p-8 border-b border-white/05 bg-white/02 flex items-center justify-between">
                            <h3 className="text-white font-black text-xl tracking-tight flex items-center gap-3">
                                <FontAwesomeIcon icon={faBox} className="text-indigo-500" />
                                Order Items
                            </h3>
                            <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">{order.items?.length || 0} Products</span>
                        </div>
                        <div className="p-4 sm:p-8 flex flex-col gap-6 max-h-[550px] overflow-y-auto custom-scrollbar">
                            {order.items?.map((item, index) => (
                                <div key={index} className="flex flex-col sm:flex-row sm:items-center gap-6 p-4 rounded-2xl bg-white/02 border border-white/05 hover:bg-white/04 transition-all group shrink-0">
                                    <div className="flex items-center gap-4 flex-1 min-w-0">
                                        <div className="w-16 h-20 sm:w-20 sm:h-24 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-white/05">
                                            <img
                                                src={item.product?.image ? `http://localhost:3000/${item.product.image.replace('uploads/', '')}` : '/placeholder-product.png'}
                                                alt={item.product?.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        </div>
                                        <div className="flex-1 flex flex-col gap-1 min-w-0">
                                            <h4 className="text-white font-bold text-sm sm:text-base transition-colors truncate">{item.product?.title || 'Unknown Product'}</h4>

                                            <div className="flex flex-wrap items-center gap-2 mt-2">
                                                <span className="text-[10px] font-black text-indigo-400 py-1 px-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20">QTY: {item.qty}</span>
                                                <span className="text-[10px] font-black text-slate-300 bg-white/05 py-1 px-2 rounded-lg border border-white/10 shrink-0">${item.price?.toFixed(2)} / item</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-left sm:text-right shrink-0 mt-2 sm:mt-0 px-2 sm:px-0 bg-white/05 sm:bg-transparent py-2 sm:py-0 border border-white/05 sm:border-transparent rounded-lg sm:rounded-none flex justify-between sm:block">
                                        <span className="sm:hidden text-xs font-bold text-slate-500 uppercase tracking-widest my-auto">Total:</span>
                                        <span className="text-white font-black text-base sm:text-lg tracking-tight">${(item.qty * item.price).toFixed(2)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-8 bg-indigo-600/05 border-t border-white/05 flex items-center justify-between">
                            <div className="flex flex-col">
                                <span className="text-slate-500 text-[10px] uppercase font-black tracking-widest">Total Amount</span>
                                <span className="text-3xl text-white font-black tracking-tighter">${order.total?.toFixed(2)}</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-400">
                                <FontAwesomeIcon icon={faCreditCard} />
                                <span className="text-xs font-bold uppercase tracking-widest">{order.paymentMethod}</span>
                                <span className={`w-2 h-2 rounded-full ${order.paymentStatus === 'completed' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                            </div>
                        </div>
                    </div>

                    {/* Shipping Address Card */}
                    {order.shippingAddress && (
                        <div className="glass rounded-4xl border border-white/05 overflow-hidden shadow-2xl shadow-black/50">
                            <div className="p-8 border-b border-white/05 bg-white/02">
                                <h3 className="text-white font-black text-xl tracking-tight flex items-center gap-3">
                                    <FontAwesomeIcon icon={faTruck} className="text-indigo-500" />
                                    Shipping Logistics
                                </h3>
                            </div>
                            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="flex flex-col gap-4 p-6 rounded-2xl bg-white/02 border border-white/05">
                                    <div className="flex items-center gap-3 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                                        <FontAwesomeIcon icon={faUser} className="text-indigo-500" />
                                        Recipient
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-white font-bold text-lg">{order.shippingAddress.name}</span>
                                        <span className="text-slate-400 text-sm font-medium flex items-center gap-2">
                                            <FontAwesomeIcon icon={faPhone} className="text-[10px]" />
                                            {order.shippingAddress.phone}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-4 p-6 rounded-2xl bg-white/02 border border-white/05">
                                    <div className="flex items-center gap-3 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                                        <FontAwesomeIcon icon={faMapMarkerAlt} className="text-indigo-500" />
                                        Delivery Address
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-white font-bold text-sm leading-relaxed">{order.shippingAddress.addressLine}</span>
                                        <span className="text-slate-400 text-sm font-medium">
                                            {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                                        </span>
                                        <span className="mt-2 text-[10px] font-black text-indigo-400 uppercase tracking-widest py-1 px-3 rounded-full bg-indigo-500/10 border border-indigo-500/20 self-start">
                                            {order.shippingAddress.label}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar Info */}
                <div className="flex flex-col gap-8">
                    {/* User Card */}
                    <div className="glass rounded-4xl border border-white/05 overflow-hidden shadow-2xl shadow-black/50 sticky top-28">
                        <div className="p-8 border-b border-white/05 bg-white/02">
                            <h3 className="text-white font-black text-xl tracking-tight flex items-center gap-3">
                                <FontAwesomeIcon icon={faUserMd} className="text-indigo-500" />
                                Customer Detail
                            </h3>
                        </div>
                        <div className="p-8 flex flex-col gap-8">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-2xl glass border border-indigo-500/20 bg-indigo-500/05 flex items-center justify-center overflow-hidden">
                                    {order.user?.image ? (
                                        <img
                                            src={`http://localhost:3000/${order.user.image?.replace('uploads/', '')}`}
                                            alt={order.user.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-2xl text-indigo-400 font-black">
                                            {order.user?.name?.charAt(0) || 'U'}
                                        </span>
                                    )}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-white font-black text-lg leading-tight">{order.user?.name || 'Guest User'}</span>
                                    <span className="text-slate-500 text-xs font-medium uppercase tracking-widest">{order.user?.role || 'Customer'}</span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-5">
                                <div className="flex items-center gap-4 group">
                                    <div className="w-10 h-10 rounded-xl bg-white/03 border border-white/05 flex items-center justify-center text-slate-400 group-hover:text-indigo-400 group-hover:border-indigo-500/20 transition-all">
                                        <FontAwesomeIcon icon={faEnvelope} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Email</span>
                                        <span className="text-slate-200 text-sm font-bold truncate max-w-[150px]">{order.user?.email || 'N/A'}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 group">
                                    <div className="w-10 h-10 rounded-xl bg-white/03 border border-white/05 flex items-center justify-center text-slate-400 group-hover:text-indigo-400 group-hover:border-indigo-500/20 transition-all">
                                        <FontAwesomeIcon icon={faPhone} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Phone</span>
                                        <span className="text-slate-200 text-sm font-bold">{order.user?.phone || 'N/A'}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 group">
                                    <div className="w-10 h-10 rounded-xl bg-white/03 border border-white/05 flex items-center justify-center text-slate-400 group-hover:text-indigo-400 group-hover:border-indigo-500/20 transition-all">
                                        <FontAwesomeIcon icon={faCalendarAlt} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Ordered On</span>
                                        <span className="text-slate-200 text-sm font-bold">{new Date(order.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminOrderDetail;
