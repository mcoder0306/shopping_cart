import React from 'react';

function Table({ headers, children }) {
    return (
        <div className="glass border border-white/05 rounded-3xl overflow-hidden mt-6 shadow-xl w-full">
            <div className="overflow-x-auto w-full max-h-[750px] overflow-y-auto custom-scrollbar">
                <table className="w-full text-left font-medium min-w-max whitespace-nowrap border-collapse">
                    <thead className="bg-[#0f172a] sticky top-0 z-20">
                        <tr className="text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-white/05">
                            {headers.map((header, idx) => (
                                <th
                                    key={idx}
                                    className={`px-8 py-5 bg-[#0f172a] ${header.align === 'right' ? 'text-right' : header.align === 'center' ? 'text-center' : 'text-left'}`}
                                >
                                    {header.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/05 bg-[#0b101a]/50">
                        {children}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Table;
