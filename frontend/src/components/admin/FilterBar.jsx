import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilter, faChevronDown } from '@fortawesome/free-solid-svg-icons';

function CustomSelect({ filter }) {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef(null);

    const selectedLabel = filter.options.find(opt => opt.value === filter.value)?.label || 'Select';

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div ref={ref} className="relative">
            <button
                type="button"
                onClick={() => setIsOpen(prev => !prev)}
                className="flex items-center gap-2 bg-white/05 text-white text-xs font-bold px-3 py-2 rounded-lg border border-white/05 hover:border-indigo-500/30 transition-colors cursor-pointer whitespace-nowrap"
            >
                <FontAwesomeIcon icon={faFilter} className="text-[9px] text-slate-500" />
                <span className="text-slate-400 text-[10px] uppercase tracking-wider">{filter.label}:</span>
                <span className="text-white">{selectedLabel}</span>
                <FontAwesomeIcon icon={faChevronDown} className={`text-[8px] text-slate-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute left-0 top-full mt-1 z-50 min-w-[160px] bg-[#0f172a] border border-white/10 rounded-xl shadow-2xl shadow-black/50 overflow-hidden">
                    {filter.options.map((opt, idx) => (
                        <button
                            key={idx}
                            type="button"
                            onClick={() => {
                                filter.onChange(opt.value);
                                setIsOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2 text-xs font-bold transition-colors ${filter.value === opt.value
                                    ? 'bg-indigo-600/20 text-indigo-400'
                                    : 'text-slate-300 hover:bg-white/05 hover:text-white'
                                }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

function FilterBar({ onSearch, title, actionButton, filters = [] }) {
    return (
        <div className="w-full min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 glass border border-white/05 px-4 py-3 rounded-2xl w-full min-w-0">
                {/* Title + Search */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    {title && <h2 className="text-base font-bold text-white whitespace-nowrap shrink-0">{title}</h2>}

                    <div className="relative flex-1 max-w-sm min-w-[140px]">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                            <FontAwesomeIcon icon={faSearch} className="text-xs" />
                        </div>
                        <input
                            type="text"
                            placeholder={`Search...`}
                            onChange={(e) => onSearch && onSearch(e.target.value)}
                            className="w-full bg-white/05 border border-white/10 text-white text-xs rounded-lg py-2 pl-8 pr-3 focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-slate-500"
                        />
                    </div>
                </div>

                {/* Filters & Actions */}
                <div className="flex items-center gap-2 shrink-0 flex-wrap">
                    {filters.map((filter, index) => (
                        <CustomSelect key={index} filter={filter} />
                    ))}
                    {actionButton}
                </div>
            </div>
        </div>
    );
}

export default FilterBar;
