import { faBagShopping, faBox, faDollarSign, faEye, faUsers } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Oval } from 'react-loader-spinner';
import { useOutletContext, useNavigate } from 'react-router-dom';
import Table from '../../components/admin/Table';

function AdminDashboard() {
    const navigate = useNavigate();
    const { dashboardData: data, isLoading } = useOutletContext();

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-full min-h-[50vh]">
                <Oval height={60} width={60} color="#6a6ff2" secondaryColor="#6a6ff2" strokeWidth={3} />
            </div>
        );
    }

    if (!data) return <div className="text-white">Failed to load dashboard.</div>;

    const stats = [
        { label: 'Total Revenue', value: `$${data.totalRevenue?.toFixed(2) || '0.00'}`, icon: faDollarSign, color: 'from-emerald-500 to-teal-600' },
        { label: 'Total Orders', value: `${data.ordercount}`, icon: faBagShopping, color: 'from-indigo-500 to-blue-600' },
        { label: 'Total Products', value: `${data.productcount}`, icon: faBox, color: 'from-purple-500 to-pink-600' },
        { label: 'Total Customers', value: `${data.customercount}`, icon: faUsers, color: 'from-orange-500 to-amber-600' },
    ];

    return (
        <div className="flex flex-col gap-8 animate-fade-in text-left">
            <div>
                <h1 className="text-2xl font-black text-white mb-1 uppercase tracking-tight">Overview</h1>
                <p className="text-slate-400 text-sm">Key metrics for your store today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="glass border border-white/05 p-6 rounded-3xl relative overflow-hidden group hover:border-white/10 transition-all duration-500">
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

            {/* Recent Orders Overview */}
            <div className="mt-4">
                <h2 className="text-xl font-bold text-white mb-4">Recent Orders</h2>
                <Table headers={[
                    { label: 'Order ID', align: 'left' },
                    { label: 'Customer', align: 'left' },
                    { label: 'Date', align: 'center' },
                    { label: 'Status', align: 'center' },
                    { label: 'Payment', align: 'center' },
                    { label: 'Total', align: 'right' },
                    { label: 'Actions', align: 'center' }
                ]}>
                    {(data.orders || []).slice(0, 10).map((order) => (
                        <tr key={order._id} className="hover:bg-white/03 transition-colors">
                            <td className="px-8 py-4 text-white font-bold text-sm">{order.orderId || ""}</td>
                            <td className="px-8 py-4 text-slate-300 text-sm">{order?.user?.name || 'Unknown'}</td>
                            <td className="px-8 py-4 text-slate-400 text-sm text-center">{order?.createdAt?.slice(0, 10)}</td>
                            <td className="px-8 py-4 text-center">
                                <span className={`text-[10px] uppercase font-black px-3 py-1 rounded-lg border tracking-wider
                                    ${order.orderStatus === 'completed' ? 'border-emerald-500/30 text-emerald-500 bg-emerald-500/05' :
                                        order.orderStatus === 'draft' ? 'border-amber-500/30 text-amber-500 bg-amber-500/05' :
                                            'border-blue-500/30 text-blue-500 bg-blue-500/05'}`}
                                >
                                    {order.orderStatus}
                                </span>
                            </td>
                            <td className="px-8 py-4 text-center">
                                {(() => {
                                    const colors = {
                                        cod: 'border-amber-500/30 text-amber-500 bg-amber-500/05',
                                        upi: 'border-indigo-500/30 text-indigo-500 bg-indigo-500/05',
                                        card: 'border-emerald-500/30 text-emerald-500 bg-emerald-500/05',
                                        default: 'border-slate-500/30 text-slate-500 bg-slate-500/05'
                                    };
                                    const method = (order.paymentMethod || '').toLowerCase();
                                    const badgeClass = colors[method] || colors.default;
                                    return (
                                        <span className={`text-[10px] uppercase font-black px-2.5 py-1 rounded-lg border tracking-wider ${badgeClass}`}>
                                            {order.paymentMethod || 'Pending'}
                                        </span>
                                    );
                                })()}
                            </td>
                            <td className="px-8 py-4 text-right text-white font-black text-sm">${order.total?.toFixed(2)}</td>
                            <td className="px-8 py-4">
                                <div className="flex justify-center items-center">
                                    <button
                                        onClick={() => navigate(`/admin/orders/${order._id}`)}
                                        className="w-8 h-8 rounded-lg glass border border-white/05 flex items-center justify-center text-slate-400 hover:text-indigo-400 hover:border-indigo-500/20 transition-all group"
                                        title="View Order Details"
                                    >
                                        <FontAwesomeIcon icon={faEye} className="text-xs" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {!data.orders?.length && (
                        <tr><td colSpan="5" className="px-8 py-8 text-center text-slate-400">No recent orders found.</td></tr>
                    )}
                </Table>
            </div>
        </div>
    );
}

export default AdminDashboard;
