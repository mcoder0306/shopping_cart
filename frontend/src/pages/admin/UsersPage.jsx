import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import FilterBar from '../../components/admin/FilterBar';
import Table from '../../components/admin/Table';
import { api } from '../../utils/api.js';
import { Oval } from 'react-loader-spinner';
import Pagination from '../../components/admin/Pagination';
import PopUp from '../../components/user/Popup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faEye } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';

function UsersPage() {
    const { dashboardData, isLoading, refreshDashboard } = useOutletContext();
    const users = dashboardData?.users || [];
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [activeFilter, setActiveFilter] = useState("");
    const [popup, setPopup] = useState({ type: null, data: null });

    const handleToggleStatus = async (id) => {
        try {
            const res = await api.patch(`/users/toggleStatus/${id}`);
            if (res.status === 200) {
                toast.success(res.data.message);
                refreshDashboard();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to toggle status");
        }
    };

    const filteredUsers = users.filter(u => {
        const matchesSearch = u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesActive = activeFilter === "" || (activeFilter === "true" ? u.isActive : !u.isActive);
        return matchesSearch && matchesActive;
    });

    // Pagination Logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = [...filteredUsers].reverse().slice(indexOfFirstItem, indexOfLastItem);

    const handleSearch = (term) => {
        setSearchTerm(term);
        setCurrentPage(1);
    };

    const headers = [
        { label: 'User', align: 'left' },
        { label: 'Phone Number', align: 'left' },
        { label: 'Joined', align: 'center' },
        { label: 'Status', align: 'center' },
        { label: 'Actions', align: 'right' },
    ];

    return (
        <div className="flex flex-col gap-6">
            <FilterBar
                title="User Management"
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
            />

            {isLoading ? (
                <div className="flex justify-center py-20">
                    <Oval height={60} width={60} color="#6366f1" secondaryColor="#6366f133" />
                </div>
            ) : (
                <>
                    <Table headers={headers}>
                        {currentItems.length > 0 ? currentItems.map((user) => (
                            <tr key={user._id} className="hover:bg-white/03 transition-colors group">
                                <td className="px-8 py-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-indigo-500/10 border border-white/05 overflow-hidden flex items-center justify-center shrink-0">
                                            {user.image ? (
                                                <img
                                                    src={`http://localhost:3000/${user.image?.replace('uploads/', '')}`}
                                                    alt={user.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <span className="text-indigo-400 font-bold text-sm uppercase">{user.name?.charAt(0)}</span>
                                            )}
                                        </div>
                                        <div className="flex flex-col min-w-0">
                                            <span className="text-white font-bold text-sm tracking-tight truncate max-w-[150px] sm:max-w-[200px]">{user.name}</span>
                                            <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest truncate max-w-[150px] sm:max-w-[200px]">{user.email}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-4">
                                    <span className="text-slate-300 font-medium text-sm">{user.phone || 'Not provided'}</span>
                                </td>
                                <td className="px-8 py-4 text-center text-slate-400 text-sm">
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-8 py-4 text-center">
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={user.isActive}
                                            onChange={() => handleToggleStatus(user._id)}
                                        />
                                        <div className="w-11 h-6 bg-white/10 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600 peer-checked:after:bg-white"></div>
                                    </label>
                                </td>
                                <td className="px-8 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            // onClick={() => setPopup({ type: "addEditProduct", data: product._id })}
                                            className="w-8 h-8 rounded-lg glass border border-white/05 text-slate-400 hover:text-white hover:bg-emerald-600 transition-all flex items-center justify-center"
                                        >
                                            <FontAwesomeIcon icon={faEdit} className="text-xs" />
                                        </button>
                                        <button
                                            onClick={() => setPopup({ type: 'viewDetails', data: user })}
                                            className="w-8 h-8 rounded-lg glass border border-white/05 text-slate-400 hover:text-white hover:bg-rose-600 transition-all flex items-center justify-center"
                                        >
                                            <FontAwesomeIcon icon={faEye} className="text-xs" />
                                        </button>
                                    </div>
                                </td>
                                {/* <td className="px-8 py-4 text-right">

                                    <div className='flex'>
                                        <button
                                            onClick={() => setPopup({ type: 'viewDetails', data: user })}
                                            className="h-9 px-3 rounded-xl glass border border-white/05 text-slate-400 hover:text-white hover:bg-indigo-600 transition-all flex items-center gap-2 group/btn ml-auto"
                                        >
                                            <FontAwesomeIcon icon={faEdit} className="text-xs" />
                                        </button>
                                        <button
                                            onClick={() => setPopup({ type: 'viewDetails', data: user })}
                                            className="h-9 px-4 rounded-xl glass border border-white/05 text-slate-400 hover:text-white hover:bg-indigo-600 transition-all flex items-center gap-2 group/btn ml-auto"
                                        >
                                            <FontAwesomeIcon icon={faEye} className="text-xs" />
                                        </button>
                                    </div>
                                </td> */}
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="5" className="px-8 py-12 text-center text-slate-400">
                                    No users found matching your search.
                                </td>
                            </tr>
                        )}
                    </Table>

                    <Pagination
                        currentPage={currentPage}
                        totalItems={filteredUsers.length}
                        itemsPerPage={itemsPerPage}
                        onPageChange={setCurrentPage}
                        onItemsPerPageChange={(size) => {
                            setItemsPerPage(size);
                            setCurrentPage(1);
                        }}
                    />
                </>
            )}

            <PopUp
                openPopUp={popup.type === 'viewDetails'}
                closePopUp={() => setPopup({ type: null, data: null })}
                innerClass="w-full max-w-lg glass rounded-3xl overflow-hidden h-fit"
            >
                {popup.data && (
                    <div className="p-8">
                        <div className="flex items-center gap-6 mb-8 border-b border-white/05 pb-6">
                            <div className="w-20 h-20 rounded-3xl bg-indigo-500/10 border border-white/05 overflow-hidden flex items-center justify-center shrink-0">
                                {popup.data.image ? (
                                    <img
                                        src={`http://localhost:3000/${popup.data.image?.replace('uploads/', '')}`}
                                        alt={popup.data.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span className="text-3xl font-black text-indigo-400 uppercase">{popup.data.name?.charAt(0)}</span>
                                )}
                            </div>
                            <div>
                                <h3 className="text-white text-2xl font-black tracking-tight">{popup.data.name}</h3>
                                <p className="text-indigo-400 text-xs font-bold tracking-widest uppercase">{popup.data.isAdmin ? 'Administrator' : 'Customer'}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Email Address</p>
                                <p className="text-white font-medium">{popup.data.email}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Phone Number</p>
                                <p className="text-white font-medium">{popup.data.phone || 'Not provided'}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Joined Date</p>
                                <p className="text-white font-medium">{new Date(popup.data.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Account Status</p>
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${popup.data.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></div>
                                    <span className={`text-[11px] font-black uppercase tracking-widest ${popup.data.isActive ? 'text-emerald-500' : 'text-rose-500'}`}>
                                        {popup.data.isActive ? 'Active and Authorized' : 'Disabled / Suspended'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => setPopup({ type: null, data: null })}
                            className="w-full mt-8 py-4 rounded-2xl bg-white/05 border border-white/10 text-white font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all"
                        >
                            Close Overview
                        </button>
                    </div>
                )}
            </PopUp>
        </div>
    );
}

export default UsersPage;
