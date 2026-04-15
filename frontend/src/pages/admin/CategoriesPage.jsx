import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import FilterBar from '../../components/admin/FilterBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Oval } from 'react-loader-spinner';
import PopUp from '../../components/user/Popup';
import Table from '../../components/admin/Table';
import Pagination from '../../components/admin/Pagination';
import CategoryForm from './CategoryForm';
import DeleteConfirmation from './DeleteConfirmation';
import { toast } from 'react-toastify';
import { api } from '../../utils/api';

function CategoriesPage() {
    const { dashboardData, isLoading, refreshDashboard } = useOutletContext();
    const categories = dashboardData?.categories || [];
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [activeFilter, setActiveFilter] = useState("");
    const [popup, setPopup] = useState({
        type: null,
        data: null
    });

    const HandleRemovePopUp = () => setPopup({ type: null, data: null });

    const handleToggleStatus = async (catId, currentStatus) => {
        try {
            const res = await api.put(`/categories/updateCategory/${catId}`, {
                isActive: !currentStatus
            });
            if (res.status === 200) {
                refreshDashboard();
                toast.success(`Category ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
            }
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const filtered = categories.filter(c => {
        const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesActive = activeFilter === "" || (activeFilter === "true" ? c.isActive : !c.isActive);
        return matchesSearch && matchesActive;
    });

    // Pagination Logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = [...filtered].reverse().slice(indexOfFirstItem, indexOfLastItem);

    const handleSearch = (term) => {
        setSearchTerm(term);
        setCurrentPage(1);
    };

    const tableHeaders = [
        { label: 'Category Info', align: 'left' },
        { label: 'Status', align: 'center' },
        { label: 'Toggle Status', align: 'center' },
        { label: 'Actions', align: 'right' }
    ];

    return (
        <div className="flex flex-col gap-6">
            <FilterBar
                title="Categories"
                onSearch={handleSearch}
                filters={[
                    {
                        label: "Status",
                        value: activeFilter,
                        onChange: (val) => {
                            setActiveFilter(val);
                            setCurrentPage(1);
                        },
                        options: [
                            { label: "All Status", value: "" },
                            { label: "Active", value: "true" },
                            { label: "Inactive", value: "false" }
                        ]
                    }
                ]}
                actionButton={
                    <button
                        onClick={() => setPopup({ type: "addEditCategory", data: null })}
                        className="bg-indigo-600 px-6 h-[46px] rounded-xl text-white font-bold text-sm flex items-center gap-2 hover:bg-indigo-500 transition-all"
                    >
                        <FontAwesomeIcon icon={faPlus} />
                        Add Category
                    </button>
                }
            />

            {isLoading ? (
                <div className="flex justify-center py-20">
                    <Oval height={60} width={60} color="#6366f1" secondaryColor="#6366f133" />
                </div>
            ) : (
                <>
                    <Table headers={tableHeaders}>
                        {currentItems.map((cat) => (
                            <tr key={cat._id} className="hover:bg-white/03 transition-colors group">
                                <td className="px-8 py-4">
                                    <div className="flex items-center gap-4">
                                        <div className="flex flex-col">
                                            <span className="text-white font-bold text-sm tracking-tight truncate max-w-[200px]">{cat.title}</span>

                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-4 text-center">
                                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black tracking-wider border 
                                        ${cat.isActive ? 'border-emerald-500/30 text-emerald-500 bg-emerald-500/05' : 'border-rose-500/30 text-rose-500 bg-rose-500/05'}`}>
                                        {cat.isActive ? 'ACTIVE' : 'INACTIVE'}
                                    </span>
                                </td>
                                <td className="px-8 py-4 text-center">
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={cat.isActive}
                                            onChange={() => handleToggleStatus(cat._id, cat.isActive)}
                                        />
                                        <div className="w-11 h-6 bg-white/10 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600 peer-checked:after:bg-white"></div>
                                    </label>
                                </td>
                                <td className="px-8 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => setPopup({ type: "addEditCategory", data: cat._id })}
                                            className="w-8 h-8 rounded-lg glass border border-white/05 text-slate-400 hover:text-white hover:bg-emerald-600 transition-all flex items-center justify-center"
                                        >
                                            <FontAwesomeIcon icon={faEdit} className="text-xs" />
                                        </button>
                                        <button
                                            onClick={() => setPopup({ type: "deletePopup", data: { category: cat._id } })}
                                            className="w-8 h-8 rounded-lg glass border border-white/05 text-slate-400 hover:text-white hover:bg-rose-600 transition-all flex items-center justify-center"
                                        >
                                            <FontAwesomeIcon icon={faTrash} className="text-xs" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {filtered.length === 0 && (
                            <tr>
                                <td colSpan="4" className="px-8 py-12 text-center text-slate-400 text-sm font-medium">
                                    No categories found matching your search.
                                </td>
                            </tr>
                        )}
                    </Table>

                    <Pagination
                        currentPage={currentPage}
                        totalItems={filtered.length}
                        itemsPerPage={itemsPerPage}
                        onPageChange={setCurrentPage}
                        onItemsPerPageChange={(size) => {
                            setItemsPerPage(size);
                            setCurrentPage(1);
                        }}
                    />
                </>
            )}

            <PopUp openPopUp={popup.type !== null} closePopUp={HandleRemovePopUp} id="detailpopup" className="justify-center items-center" innerClass="w-full max-w-4xl glass rounded-3xl overflow-hidden h-fit max-h-[90vh]">
                {
                    popup.type === "addEditCategory" && <CategoryForm popup={popup} setPopup={setPopup} setRefresh={refreshDashboard} />
                }
                {
                    popup.type === "deletePopup" && <DeleteConfirmation popup={popup} setPopup={setPopup} setRefresh={refreshDashboard} />
                }
            </PopUp>
        </div>
    );
}

export default CategoriesPage;
