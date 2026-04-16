import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import FilterBar from '../../components/admin/FilterBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Oval } from 'react-loader-spinner';
import PopUp from '../../components/user/Popup';
import Table from '../../components/admin/Table';
import Pagination from '../../components/admin/Pagination';
import ProductForm from './ProductForm';
import DeleteConfirmation from './DeleteConfirmation';

function ProductsPage() {
    const { dashboardData, isLoading, refreshDashboard } = useOutletContext();
    const products = dashboardData?.products || [];
    const categories = dashboardData?.categories || [];
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [categoryFilter, setCategoryFilter] = useState("");
    const [popup, setPopup] = useState({
        type: null,
        data: null
    });

    const HandleRemovePopUp = () => setPopup({ type: null, data: null });

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.title?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === "" || p.category?._id === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    // Pagination Logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = [...filteredProducts].reverse().slice(indexOfFirstItem, indexOfLastItem);

    const handleSearch = (term) => {
        setSearchTerm(term);
        setCurrentPage(1);
    };

    const tableHeaders = [
        { label: 'Product Info', align: 'left' },
        { label: 'Category', align: 'left' },
        { label: 'Price', align: 'center' },
        { label: 'Stock', align: 'center' },
        { label: 'Actions', align: 'right' }
    ];

    return (
        <div className="flex flex-col gap-6">
            <FilterBar
                title="Manage Products"
                onSearch={handleSearch}
                filters={[
                    {
                        label: "Category",
                        value: categoryFilter,
                        onChange: (val) => {
                            setCategoryFilter(val);
                            setCurrentPage(1);
                        },
                        options: [
                            { label: "All Categories", value: "" },
                            ...categories.map(c => ({ label: c.title, value: c._id }))
                        ]
                    }
                ]}
                actionButton={
                    <button
                        onClick={() => setPopup({ type: "addEditProduct", data: null })}
                        className="bg-indigo-600 px-6 h-[46px] rounded-xl text-white font-bold text-sm flex items-center gap-2 hover:bg-indigo-500 transition-all shadow-[0_0_20px_rgba(99,102,241,0.2)] hover:shadow-[0_0_25px_rgba(99,102,241,0.4)]"
                    >
                        <FontAwesomeIcon icon={faPlus} />
                        Add Product
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
                        {currentItems.map((product) => (
                            <tr key={product._id} className="hover:bg-white/03 transition-colors group">
                                <td className="px-8 py-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/10 p-1 flex-shrink-0 bg-white">
                                            <img
                                                src={`http://localhost:3000/${product.image?.replace('uploads/', '')}`}
                                                alt={product.title}
                                                className="w-full h-full object-contain rounded-lg mix-blend-multiply"
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-white font-bold text-sm tracking-tight line-clamp-1">{product.title}</span>
                                            <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest leading-relaxed">ID: {product._id.slice(-6)}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-4 text-slate-300 text-sm">
                                    <span className="badge badge-indigo text-[10px] px-2 py-0.5 opacity-90">{product.category?.title || 'Uncategorized'}</span>
                                </td>
                                <td className="px-8 py-4 text-center text-white font-black text-sm">
                                    ${product.price}
                                </td>
                                <td className="px-8 py-4 text-center">
                                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black tracking-wider ${product.stock < 10
                                        ? 'border border-rose-500/30 text-rose-500 bg-rose-500/05'
                                        : 'border border-emerald-500/30 text-emerald-500 bg-emerald-500/05'
                                        }`}>
                                        {product.stock} units
                                    </span>
                                </td>
                                <td className="px-8 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => setPopup({ type: "addEditProduct", data: product._id })}
                                            className="w-8 h-8 rounded-lg glass border border-white/05 text-slate-400 hover:text-white hover:bg-emerald-600 transition-all flex items-center justify-center"
                                        >
                                            <FontAwesomeIcon icon={faEdit} className="text-xs" />
                                        </button>
                                        <button
                                            onClick={() => setPopup({ type: "deletePopup", data: { product: product._id } })}
                                            className="w-8 h-8 rounded-lg glass border border-white/05 text-slate-400 hover:text-white hover:bg-rose-600 transition-all flex items-center justify-center"
                                        >
                                            <FontAwesomeIcon icon={faTrash} className="text-xs" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {filteredProducts.length === 0 && (
                            <tr>
                                <td colSpan="5" className="px-8 py-12 text-center text-slate-400">
                                    No products found matching your search.
                                </td>
                            </tr>
                        )}
                    </Table>

                    <Pagination
                        currentPage={currentPage}
                        totalItems={filteredProducts.length}
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
                    popup.type === "addEditProduct" && <ProductForm popup={popup} setPopup={setPopup} setRefresh={refreshDashboard} />
                }
                {
                    popup.type === "deletePopup" && <DeleteConfirmation popup={popup} setPopup={setPopup} setRefresh={refreshDashboard} />
                }
            </PopUp>
        </div>
    );
}

export default ProductsPage;
