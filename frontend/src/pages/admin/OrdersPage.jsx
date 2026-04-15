import { useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import FilterBar from '../../components/admin/FilterBar';
import { Oval } from 'react-loader-spinner';
import Table from '../../components/admin/Table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import Pagination from '../../components/admin/Pagination';


function OrdersPage() {
    const navigate = useNavigate();
    const { dashboardData, isLoading } = useOutletContext();
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [statusFilter, setStatusFilter] = useState("");

    const orders = dashboardData?.orders || [];

    const filteredOrders = orders.filter(o => {
        const matchesSearch = o.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            o._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            o.user?.name?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === "" || o.orderStatus === statusFilter;

        return matchesSearch && matchesStatus;
    });

    // Pagination Logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = [...filteredOrders].reverse().slice(indexOfFirstItem, indexOfLastItem);

    const handleSearch = (term) => {
        setSearchTerm(term);
        setCurrentPage(1);
    };

    const headers = [
        { label: 'Order ID', align: 'left' },
        { label: 'Customer', align: 'left' },
        { label: 'Date', align: 'center' },
        { label: 'Items', align: 'center' },
        { label: 'Status', align: 'center' },
        { label: 'Amount', align: 'right' },
        { label: 'Actions', align: 'center' }
    ];

    return (
        <div className="flex flex-col gap-6">
            <FilterBar
                title="Manage Orders"
                onSearch={handleSearch}
                filters={[
                    {
                        label: "Status",
                        value: statusFilter,
                        onChange: (val) => {
                            setStatusFilter(val);
                            setCurrentPage(1);
                        },
                        options: [
                            { label: "All Status", value: "" },
                            { label: "Draft", value: "draft" },
                            { label: "Completed", value: "completed" }
                        ]
                    }
                ]}
            />

            {isLoading ? (
                <div className="flex justify-center py-20">
                    <Oval height={60} width={60} color="#6366f1" secondaryColor="#6366f133" />
                </div>
            ) : (
                <>
                    <Table headers={headers}>
                        {currentItems.map((order) => (
                            <tr key={order._id} className="hover:bg-white/03 transition-colors group">
                                <td className="px-8 py-4">
                                    <span className="text-white font-bold tracking-widest text-xs">{order.orderId || ""}</span>
                                </td>
                                <td className="px-8 py-4">
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-slate-200 font-bold text-sm truncate max-w-[120px] sm:max-w-[180px]">{order.user?.name || 'Guest User'}</span>
                                        {order.shippingAddress && (
                                            <span className="text-slate-500 text-[10px] uppercase truncate max-w-[120px] sm:max-w-[180px]">{order.shippingAddress.city}</span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-8 py-4 text-center text-slate-400 text-sm">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-8 py-4 text-center">
                                    <span className="text-white font-black text-sm">{order.items?.length || 0}</span>
                                </td>
                                <td className="px-8 py-4 text-center">
                                    <span className={`text-[10px] uppercase font-black px-3 py-1 rounded-lg border tracking-wider
                                    ${order.orderStatus === 'completed' ? 'border-emerald-500/30 text-emerald-500 bg-emerald-500/05' :
                                            order.orderStatus === 'draft' ? 'border-amber-500/30 text-amber-500 bg-amber-500/05' :
                                                'border-blue-500/30 text-blue-500 bg-blue-500/05'}`}
                                    >
                                        {order.orderStatus}
                                    </span>
                                </td>
                                <td className="px-8 py-4 text-right">
                                    <span className="text-white font-black text-sm">${order.total?.toFixed(2)}</span>
                                </td>
                                <td className="px-8 py-4">
                                    <div className="flex justify-center items-center">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/admin/orders/${order._id}`);
                                            }}
                                            className="w-10 h-10 rounded-xl glass border border-white/05 flex items-center justify-center text-slate-400 hover:text-indigo-400 hover:border-indigo-500/20 transition-all group"
                                            title="View Order Details"
                                        >
                                            <FontAwesomeIcon icon={faEye} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {filteredOrders.length === 0 && (
                            <tr>
                                <td colSpan="6" className="px-8 py-12 text-center text-slate-400">
                                    No orders found matching your search.
                                </td>
                            </tr>
                        )}
                    </Table>

                    <Pagination
                        currentPage={currentPage}
                        totalItems={filteredOrders.length}
                        itemsPerPage={itemsPerPage}
                        onPageChange={setCurrentPage}
                        onItemsPerPageChange={(size) => {
                            setItemsPerPage(size);
                            setCurrentPage(1);
                        }}
                    />
                </>
            )}
        </div>
    );
}

export default OrdersPage;
