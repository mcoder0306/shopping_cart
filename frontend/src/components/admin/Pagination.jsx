import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

function Pagination({
    currentPage,
    totalItems,
    itemsPerPage,
    onPageChange,
    onItemsPerPageChange
}) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    if (totalPages <= 1 && totalItems <= 8) return null;

    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
    }

    const getVisiblePages = () => {
        if (totalPages <= 5) return pages;
        if (currentPage <= 3) return [1, 2, 3, 4, '...', totalPages];
        if (currentPage >= totalPages - 2) return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
        return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
    };

    return (
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mt-8 bg-white/02 border border-white/05 rounded-2xl p-6">
            <div className="flex items-center gap-4">
                <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Show</span>
                <select
                    value={itemsPerPage}
                    onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
                    className="bg-[#0f172a] border border-white/10 text-white text-xs rounded-lg px-3 py-1.5 outline-none focus:border-indigo-500/50 transition-colors"
                >
                    {[10, 25, 50, 100].map(size => (
                        <option key={size} value={size}>{size}</option>
                    ))}
                </select>
                <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Entries</span>
            </div>

            <div className="flex items-center gap-3">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="w-9 h-9 flex items-center justify-center rounded-xl glass border border-white/05 text-slate-400 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                >
                    <FontAwesomeIcon icon={faChevronLeft} className="text-xs" />
                </button>

                <div className="flex items-center gap-2">
                    {getVisiblePages().map((page, idx) => (
                        page === '...' ? (
                            <span key={`dots-${idx}`} className="text-slate-600 px-1 text-xs font-black">...</span>
                        ) : (
                            <button
                                key={page}
                                onClick={() => onPageChange(page)}
                                className={`w-9 h-9 flex items-center justify-center rounded-xl font-bold text-xs transition-all ${currentPage === page
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 border border-indigo-400/50'
                                    : 'glass border border-white/05 text-slate-400 hover:text-white hover:border-white/20'
                                    }`}
                            >
                                {page}
                            </button>
                        )
                    ))}
                </div>

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="w-9 h-9 flex items-center justify-center rounded-xl glass border border-white/05 text-slate-400 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                >
                    <FontAwesomeIcon icon={faChevronRight} className="text-xs" />
                </button>
            </div>

            <div className="text-slate-500 text-[10px] font-black uppercase tracking-widest bg-white/03 px-4 py-2 rounded-lg border border-white/05">
                Showing {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)} - {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}
            </div>
        </div>
    );
}

export default Pagination;
