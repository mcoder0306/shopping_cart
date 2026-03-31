import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faChartLine,
    faUsers,
    faBox,
    faDollarSign,
    faPlus,
    faEdit,
    faTrash,
    faEye,
    faMagnifyingGlass,
    faFilter,
    faTags,
    faBagShopping,
    faTriangleExclamation
} from '@fortawesome/free-solid-svg-icons'
import { useEffect } from 'react'
import { api } from '../utils/api'
import { toast } from 'react-toastify'
import { Oval } from 'react-loader-spinner'
import PopUp from '../components/Popup'
import DetailCard from '../components/DetailCard'
import CategoryForm from './CategoryForm'
import DeleteConfirmation from './DeleteConfirmation'
import ProductForm from './ProductForm'

function Dashboard() {
    const [activeTab, setActiveTab] = useState('Overview')
    const [data, setData] = useState([])
    const [products, setProducts] = useState([])
    const [categories, setCategories] = useState([])
    const [orders, setOrders] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [popup, setPopup] = useState({
        type: null,
        data: null
    });
    const HandleRemovePopUp = () => setPopup({ type: null, data: null });

    useEffect(() => {
        const loadData = async () => {
            try {
                const res = await api.get("/dashboard/getDashboardData")
                if (res.status === 200) {
                    const response = res.data.data
                    setData(response)
                    setProducts(response.products)
                    setCategories(response.categories)
                    setOrders(response.orders)
                    setIsLoading(false)
                }
            } catch (error) {
                toast.error("something went wrong!!", {
                    theme: 'dark',
                    autoClose: 3000,
                })
            }
        }
        loadData()
    }, [data])
    const tabs = [
        { id: 'Overview', icon: faChartLine },
        { id: 'Products', icon: faBox },
        { id: 'Categories', icon: faTags },
    ]

    const stats = [
        { label: 'Total Revenue', value: `$${data.totalRevenue}`, icon: faDollarSign, color: 'from-emerald-500 to-teal-600' },
        { label: 'Total Orders', value: `${data.ordercount}`, icon: faBagShopping, color: 'from-indigo-500 to-blue-600' },
        { label: 'Total Products', value: `${data.productcount}`, icon: faBox, color: 'from-purple-500 to-pink-600' },
        { label: 'Active Customers', value: `${data.customercount}`, icon: faUsers, color: 'from-orange-500 to-amber-600' },
    ]

    const renderOverview = () => (
        <div className="flex flex-col gap-8 animate-fade-in">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="glass border border-white/05 p-6 rounded-3xl relative overflow-hidden group hover:border-white/10 transition-all duration-500" style={{ animationDelay: `${index * 100}ms` }}>
                        <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-10 blur-3xl group-hover:opacity-20 transition-opacity`} />
                        <div className="flex items-start justify-between mb-4 relative z-10">
                            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg shadow-black/20`}>
                                <FontAwesomeIcon icon={stat.icon} className="text-white text-xl" />
                            </div>

                        </div>
                        <div className="relative z-10 text-left">
                            <p className="text-slate-400 text-sm font-semibold mb-1 uppercase tracking-wider">{stat.label}</p>
                            <h3 className="text-2xl font-black text-white">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Orders Overview Table */}
                <div className="lg:col-span-8 glass border border-white/05 rounded-3xl overflow-hidden flex flex-col">
                    <div className="px-8 py-6 border-b border-white/05 flex items-center justify-between bg-white/02">
                        <h2 className="text-xl font-bold text-white text-left uppercase tracking-tight">Recent Orders</h2>
                        <button onClick={() => setActiveTab('Orders')} className="text-indigo-400 text-xs font-black uppercase tracking-widest hover:text-indigo-300 transition-colors">Manage All</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left font-medium">
                            <thead>
                                <tr className="text-slate-400 text-xs font-black uppercase tracking-widest bg-white/02">
                                    <th className="px-8 py-5">Order ID</th>
                                    <th className="px-8 py-5">Customer</th>
                                    <th className="px-8 py-5 text-center">Date</th>
                                    <th className="px-8 py-5 text-center">Status</th>
                                    <th className="px-8 py-5 text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/05">
                                {[...orders]?.reverse().map((order, index) => (
                                    <tr key={index} className="hover:bg-white/02 transition-colors group cursor-default">
                                        <td className="px-8 py-4 text-white font-bold text-sm tracking-tight">{order._id}</td>
                                        <td className="px-8 py-4 text-slate-300 text-sm">{order?.user?.name}</td>
                                        <td className="px-4 py-4 text-slate-400 text-sm text-center">{order?.createdAt?.slice(0, 10)}</td>
                                        <td className="px-8 py-4 text-center">
                                            <span className={`text-[10px] uppercase font-black px-3 py-1 rounded-lg border tracking-wider
                    ${order.orderStatus === 'completed' ? 'border-emerald-500/30 text-emerald-500 bg-emerald-500/05' :
                                                    order.orderStatus === 'draft' ? 'border-amber-500/30 text-amber-500 bg-amber-500/05' :
                                                        order.orderStatus === 'Shipped' ? 'border-blue-500/30 text-blue-500 bg-blue-500/05' :
                                                            'border-rose-500/30 text-rose-500 bg-rose-500/05'}`}
                                            >
                                                {order.orderStatus}
                                            </span>
                                        </td>
                                        <td className="px-8 py-4 text-right text-white font-black text-sm">${order.total}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Stock Summary Section */}
                <div className="lg:col-span-4 glass border border-white/05 rounded-3xl p-8 flex flex-col text-left">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 border border-orange-500/20">
                            <FontAwesomeIcon icon={faTriangleExclamation} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white leading-tight uppercase tracking-tight">Stock Alerts</h2>
                            <p className="text-slate-400 text-xs font-medium">Items running low</p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 flex-1">
                        {products.filter(p => p.stock < 20).map((prod) => (
                            <div key={prod._id} className="flex items-center gap-4 p-4 rounded-2xl bg-white/03 border border-white/05 hover:bg-white/05 transition-all group">
                                <img src={`http://localhost:3000/${prod.image?.replace('uploads/', '')}`} className="w-10 h-10 rounded-lg object-cover" />
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-white font-bold text-xs truncate uppercase tracking-tight">{prod.title}</h4>
                                    <p className="text-orange-400 text-[10px] font-black uppercase tracking-widest">{prod.stock} in stock</p>
                                </div>
                                <button onClick={() => setActiveTab('Products')} className="w-8 h-8 rounded-lg glass border border-white/05 text-slate-400 hover:text-white hover:bg-indigo-600 transition-all flex items-center justify-center">
                                    <FontAwesomeIcon icon={faEdit} className="text-[10px]" />
                                </button>
                            </div>
                        ))}
                    </div>

                    <button onClick={() => setActiveTab('Products')} className="w-full mt-8 py-4 rounded-2xl glass border border-white/05 text-white font-black text-[10px] uppercase tracking-widest hover:bg-white/05 transition-all">
                        Inventory Detail
                    </button>
                </div>
            </div>
        </div>
    )

    const renderProducts = () => (
        <div className="flex flex-col gap-6 animate-fade-in text-left">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass border border-white/05 p-4 rounded-3xl">
                <h2 className="text-white font-bold px-4">Manage Products</h2>
                <div className="flex items-center gap-3">
                    <button onClick={() => setPopup({ type: "addEditProduct", data: null })} className="bg-indigo-600 px-6 py-3 rounded-2xl text-white font-bold text-sm flex items-center gap-2 hover:bg-indigo-500 transition-all">
                        <FontAwesomeIcon icon={faPlus} />
                        Add Product
                    </button>
                </div>
            </div>
            <div className="glass border border-white/05 rounded-3xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left font-medium">
                        <thead>
                            <tr className="text-slate-400 text-xs font-black uppercase tracking-widest bg-white/02">
                                <th className="px-8 py-5">Product</th>
                                <th className="px-8 py-5">Category</th>
                                <th className="px-8 py-5 text-center">Price</th>
                                <th className="px-8 py-5 text-center">Stock</th>
                                <th className="px-8 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/05">
                            {[...products]?.reverse().map((product) => (
                                <tr key={product._id} className="hover:bg-white/02 transition-colors group">
                                    <td className="px-8 py-4">
                                        <div className="flex items-center gap-4 text-left">
                                            <div className="w-12 h-12 rounded-xl overflow-hidden glass border border-white/10 p-1 flex-shrink-0 group-hover:scale-105 transition-transform">
                                                <img src={`http://localhost:3000/${product.image?.replace('uploads/', '')}`} alt={product.title} className="w-full h-full object-cover rounded-lg" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-white font-bold text-sm tracking-tight">{product.name}</span>
                                                <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{product.id}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-4 text-slate-300 text-sm">{product.category.title}</td>
                                    <td className="px-8 py-4 text-center text-white font-black text-sm">${product.price}</td>
                                    <td className="px-8 py-4 text-center">
                                        <span className={`px-2 py-1 rounded-lg text-[10px] font-black border tracking-wider ${product.stock < 15 ? 'border-rose-500/30 text-rose-500 bg-rose-500/05' : 'border-emerald-500/30 text-emerald-500 bg-emerald-500/05'}`}>
                                            {product.stock} units
                                        </span>
                                    </td>
                                    <td className="px-8 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 text-left">
                                            {/* <button onClick={() => setPopup({ type: "detailView", data: product })} className="w-8 h-8 rounded-lg glass border border-white/05 text-slate-400 hover:text-white hover:bg-indigo-600 transition-all flex items-center justify-center"><FontAwesomeIcon icon={faEye} className="text-xs" /></button> */}
                                            <button onClick={() => setPopup({ type: "addEditProduct", data: product._id })} className="w-8 h-8 rounded-lg glass border border-white/05 text-slate-400 hover:text-white hover:bg-emerald-600 transition-all flex items-center justify-center"><FontAwesomeIcon icon={faEdit} className="text-xs" /></button>

                                            <button onClick={() => setPopup({ type: "deletePopup", data: {product:product._id} })} className="w-8 h-8 rounded-lg glass border border-white/05 text-slate-400 hover:text-white hover:bg-rose-600 transition-all flex items-center justify-center"><FontAwesomeIcon icon={faTrash} className="text-xs" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )

    const handleToggleCategoryStatus = async (catId, currentStatus) => {
        try {
            const res = await api.put(`/categories/updateCategory/${catId}`, {
                isActive: !currentStatus
            })
            if (res.status === 200) {
                toast.success(`Category ${!currentStatus ? 'activated' : 'deactivated'} successfully`, {
                    theme: 'dark',
                    autoClose: 2000,
                })
            }
        } catch (error) {
            toast.error("Failed to update status", {
                theme: 'dark',
            })
        }
    }

    const renderCategories = () => (
        <div className="flex flex-col gap-6 animate-fade-in text-left">
            <div className="flex justify-between items-center glass border border-white/05 p-4 rounded-3xl">
                <h2 className="text-white font-bold px-4">Manage Categories</h2>
                <button onClick={() => setPopup({ type: "addEditCategory", data: null })} className="bg-indigo-600 px-6 py-3 rounded-2xl text-white font-bold text-sm flex items-center gap-2 hover:bg-indigo-500 transition-all">
                    <FontAwesomeIcon icon={faPlus} />
                    Add Category
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...categories]?.reverse().map((cat) => (
                    <div key={cat._id} className="glass border border-white/05 p-6 rounded-3xl group hover:border-white/10 transition-all cursor-default text-left relative overflow-hidden">
                        <div className="flex items-center justify-between mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                                <FontAwesomeIcon icon={faTags} />
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => setPopup({ type: "addEditCategory", data: cat._id })} className="w-8 h-8 rounded-lg glass border border-white/05 text-slate-400 hover:text-white hover:bg-emerald-600 transition-all flex items-center justify-center"><FontAwesomeIcon icon={faEdit} className="text-xs" /></button>
                                <button onClick={() => setPopup({ type: "deletePopup", data: {category:cat._id} })} className="w-8 h-8 rounded-lg glass border border-white/05 text-slate-400 hover:text-white hover:bg-rose-600 transition-all flex items-center justify-center"><FontAwesomeIcon icon={faTrash} className="text-xs" /></button>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-white font-black text-xl mb-1 truncate">{cat.title}</h3>
                                <p className={`text-[10px] font-black uppercase tracking-widest ${cat.isActive ? 'text-emerald-500' : 'text-rose-500'}`}>
                                    {cat.isActive ? 'Active' : 'Inactive'}
                                </p>
                            </div>
                            {/* Toggle Switch */}
                            <label className="relative inline-flex items-center cursor-pointer group">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={cat.isActive}
                                    onChange={() => handleToggleCategoryStatus(cat._id, cat.isActive)}
                                />
                                <div className="w-11 h-6 bg-white/10 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white/40 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600 peer-checked:after:bg-white"></div>
                            </label>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )




    return !isLoading ? (
        <div className="min-h-screen pt-32 pb-24 px-6 max-w-7xl mx-auto overflow-hidden">
            <div className="flex flex-col gap-10">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 animate-fade-in text-left">
                    <div>
                        <h1 className="text-4xl font-black text-white mb-2 leading-tight uppercase tracking-tight">
                            Store <span className="text-indigo-400">Admin</span>
                        </h1>
                        <p className="text-slate-400 font-medium">
                            Manage products, categories and view order history at a glance.
                        </p>
                    </div>
                    <div className="flex items-center gap-3 p-1 glass border border-white/05 rounded-2xl">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all duration-300 ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'text-slate-400 hover:text-white hover:bg-white/05'}`}
                            >
                                <FontAwesomeIcon icon={tab.icon} className="text-[10px]" />
                                {tab.id}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tab Content */}
                {activeTab === 'Overview' && renderOverview()}
                {activeTab === 'Products' && renderProducts()}
                {activeTab === 'Categories' && renderCategories()}
                {/* {activeTab === 'Orders' && renderOrders()} */}
            </div>
            <PopUp openPopUp={popup.type !== null} closePopUp={HandleRemovePopUp} id="detailpopup" className="justify-center items-center" innerClass="w-full max-w-4xl glass rounded-3xl overflow-hidden h-fit max-h-[90vh]">
                {
                    popup.type === "detailView" && <DetailCard product={popup.data} />
                }
                {
                    popup.type === "addEditCategory" && <CategoryForm popup={popup} setPopup={setPopup} />
                }
                {
                    popup.type === "deletePopup" && <DeleteConfirmation popup={popup} setPopup={setPopup} />
                }
                {
                    popup.type === "addEditProduct" && <ProductForm popup={popup} setPopup={setPopup} />
                }
            </PopUp>
        </div>
    )
        : (
            <div className="min-h-screen pt-32 pb-24 px-6 max-w-7xl mx-auto overflow-hidden">
                <div className='flex justify-center'>
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
            </div>
        )
}

export default Dashboard