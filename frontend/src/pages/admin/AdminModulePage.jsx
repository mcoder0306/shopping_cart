import { useParams, useOutletContext, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { api } from "../../utils/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faEdit, faRefresh } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import DynamicTable from "../../components/admin/DynamicTable";
import DynamicForm from "../../components/admin/DynamicForm";
import FilterBar from "../../components/admin/FilterBar";
import Pagination from "../../components/admin/Pagination";
import PopUp from "../../components/user/Popup";
import { Oval } from "react-loader-spinner";
import DeleteConfirmation from "./DeleteConfirmation";
import UserDetails from "./UserDetails";

function AdminModulePage() {
    const { module } = useParams();
    const navigate = useNavigate();
    const { dashboardData, refreshDashboard } = useOutletContext();
    const categories = dashboardData?.categories || [];
    const [config, setConfig] = useState(null);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterValues, setFilterValues] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [popup, setPopup] = useState({ type: null, data: null });

    const fetchConfig = async () => {
        try {
            const res = await api.get(`/admin-config/${module}`);
            setConfig(res.data);
        } catch (err) {
            toast.error("Failed to load module configuration");
        }
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/admin/${module}`);
            setData(res.data.data || []);
        } catch (err) {
            setData([]);
            toast.error(`Failed to fetch ${module} data`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setData([]);
        setConfig(null);
        fetchConfig();
        fetchData();
        setPopup({ type: null, data: null });
        setSearchTerm("");
        setFilterValues({});
        setCurrentPage(1);
    }, [module]);

    const handleSearch = (term) => {
        setSearchTerm(term);
        setCurrentPage(1);
    };

    const handleFilterChange = (name, value) => {
        setFilterValues(prev => ({ ...prev, [name]: value }));
        setCurrentPage(1);
    };

    const getFilters = () => {
        const filters = [];
        if (module === 'products' && categories.length > 0) {
            filters.push({
                label: 'Category',
                name: 'category',
                value: filterValues.category || '',
                options: [
                    { label: 'All Categories', value: '' },
                    ...categories.map(c => ({ label: c.title, value: c._id }))
                ],
                onChange: (val) => handleFilterChange('category', val)
            });
        }
        if (module === 'orders') {
            filters.push({
                label: 'Order Status',
                name: 'orderStatus',
                value: filterValues.orderStatus || '',
                options: [
                    { label: 'All Status', value: '' },
                    { label: 'Draft', value: 'draft' },
                    { label: 'Completed', value: 'completed' }
                ],
                onChange: (val) => handleFilterChange('orderStatus', val)
            });
            filters.push({
                label: 'Payment Method',
                name: 'paymentMethod',
                value: filterValues.paymentMethod || '',
                options: [
                    { label: 'All Methods', value: '' },
                    { label: 'COD', value: 'cod' },
                    { label: 'UPI', value: 'upi' },
                    { label: 'Card', value: 'card' }
                ],
                onChange: (val) => handleFilterChange('paymentMethod', val)
            });
        } else {
            // Standard Status filter for products/categories/users
            filters.push({
                label: 'Status',
                name: 'isActive',
                value: filterValues.isActive || '',
                options: [
                    { label: 'All Status', value: '' },
                    { label: 'Active', value: 'true' },
                    { label: 'Inactive', value: 'false' }
                ],
                onChange: (val) => handleFilterChange('isActive', val)
            });
        }
        return filters;
    };

    const filteredData = data.filter(item => {
        // 1. Search Logic (multi-field & nested)
        const searchStr = searchTerm.toLowerCase().trim();
        const matchesSearch = !searchStr || [
            item.title,
            item.name,
            item.username,
            item.email,
            item.orderId,
            item.paymentMethod,
            item.orderStatus,
            item.category?.title || item.category?.name,
            item.user?.name,
            item.user?.email
        ].some(val => {
            if (!val) return false;
            return String(val).toLowerCase().includes(searchStr);
        });

        // 2. Filtering Logic
        const matchesFilters = Object.entries(filterValues).every(([key, value]) => {
            if (!value) return true;

            // Handle both simple values and object fields (like category)
            const itemValue = item[key];
            const actualValue = (typeof itemValue === 'object' ? itemValue?._id : itemValue) || '';

            return String(actualValue) === String(value);
        });

        return matchesSearch && matchesFilters;
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = [...filteredData].slice(indexOfFirstItem, indexOfLastItem);

    const handleEdit = (item) => {
        setPopup({ type: "addEdit", data: item });
    };

    const handleView = (item) => {
        if (module === 'users') {
            setPopup({ type: "viewUser", data: item });
        } else if (module === 'orders') {
            navigate(`/admin/orders/${item._id}`);
        }
    };

    const handleToggleStatus = async (item) => {
        try {
            const newStatus = !item.isActive;
            await api.put(`/admin/${module}/${item._id}`, { isActive: newStatus });
            toast.success("Status updated");
            fetchData();
            refreshDashboard && refreshDashboard(prev => prev + 1);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to update status");
        }
    };

    const handleDelete = (id) => {
        setPopup({ type: "delete", data: id });
    };

    const onFormSuccess = () => {
        setPopup({ type: null, data: null });
        fetchData();
        refreshDashboard && refreshDashboard(prev => prev + 1);
    };

    if (!config) return (
        <div className="flex justify-center items-center h-full min-h-[50vh]">
            <Oval height={60} width={60} color="#6366f1" secondaryColor="#6366f133" />
        </div>
    );

    return (
        <div className="flex flex-col gap-6 animate-fade-in text-left">
            <FilterBar
                title={`Manage ${config.label}`}
                onSearch={handleSearch}
                filters={getFilters()}
                actionButton={
                    !config.hideAdd && (
                        <button
                            onClick={() => setPopup({ type: "addEdit", data: null })}
                            className="bg-indigo-600 px-6 h-[46px] rounded-xl text-white font-bold text-sm flex items-center gap-2 hover:bg-indigo-500 transition-all shadow-[0_0_20px_rgba(99,102,241,0.2)]"
                        >
                            <FontAwesomeIcon icon={faPlus} />
                            Add {config.label}
                        </button>
                    )
                }
            />

            {loading ? (
                <div className="flex justify-center py-20">
                    <Oval height={60} width={60} color="#6366f1" secondaryColor="#6366f133" />
                </div>
            ) : (
                <div className="animate-slide-up">
                    <DynamicTable
                        config={config}
                        data={currentItems}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onToggleStatus={handleToggleStatus}
                        onView={handleView}
                    />

                    <div className="mt-6">
                        <Pagination
                            currentPage={currentPage}
                            totalItems={filteredData.length}
                            itemsPerPage={itemsPerPage}
                            onPageChange={setCurrentPage}
                            onItemsPerPageChange={(size) => {
                                setItemsPerPage(size);
                                setCurrentPage(1);
                            }}
                        />
                    </div>
                </div>
            )}

            <PopUp
                openPopUp={popup.type !== null}
                closePopUp={() => setPopup({ type: null, data: null })}
                innerClass={popup.type === 'delete' ? "w-full max-w-md" : "w-full max-w-4xl glass rounded-3xl overflow-hidden h-fit max-h-[90vh]"}
            >
                {popup.type === "addEdit" && (
                    <DynamicForm
                        config={config}
                        initialData={popup.data}
                        onSuccess={onFormSuccess}
                        module={module}
                        categories={categories.filter(c => c.isActive !== false)}
                    />
                )}
                {popup.type === "viewUser" && (
                    <UserDetails user={popup.data} />
                )}
                {popup.type === "delete" && (
                    <DeleteConfirmation
                        popup={{ data: { id: popup.data, module } }}
                        setPopup={setPopup}
                        setRefresh={() => {
                            fetchData();
                            refreshDashboard && refreshDashboard(prev => prev + 1);
                        }}
                    />
                )}
            </PopUp>
        </div>
    );
}

export default AdminModulePage;