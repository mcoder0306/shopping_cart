import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faEye } from '@fortawesome/free-solid-svg-icons';
import Table from './Table';

function DynamicTable({ config, data, onEdit, onDelete, onView, onToggleStatus }) {
    if (!config || !data) return null;

    const tableFields = config.fields.filter(f => f.showInTable === true);

    if (tableFields.length === 0) {
        const fallback = config.fields.find(f => f.name === 'title' || f.name === 'name') || config.fields[0];
        tableFields.push(fallback);
    }

    const imageField = tableFields.find(f => f.type === 'file' || f.name === 'image');
    const titleField = tableFields.find(f => f.name === 'title' || f.name === 'name' || f.name === 'username');
    const statusField = tableFields.find(f => f.name === 'isActive');

    const otherFields = tableFields.filter(f => f !== imageField && f !== titleField && f !== statusField);

    const headers = [];

    if (imageField || titleField) {
        headers.push({ label: config.label.slice(0, -1) + ' Info', align: 'left' });
    }

    otherFields.forEach(f => {
        let align = 'left';
        if (f.name === 'createdAt' || f.name === 'orderStatus' || f.name === 'paymentMethod') align = 'center';
        if (f.name === 'total') align = 'right';

        headers.push({
            label: f.label,
            align
        });
    });

    if (statusField) {
        headers.push({ label: 'Status', align: 'center' });
    }

    headers.push({ label: 'Actions', align: 'right' });

    const getInitials = (name) => {
        if (!name) return "?";
        return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    };

    const renderCell = (item, field) => {
        const value = item[field.name];

        if (field.name === 'user') {
            const userName = (typeof value === 'object' ? value?.name || value?.email : value) || 'Unknown';
            return <span className="text-slate-300 text-sm font-bold">{userName}</span>;
        }

        if (field.name === 'createdAt') {
            return <span className="text-slate-400 text-[10px] uppercase font-black tracking-widest">{String(value || '').slice(0, 10)}</span>;
        }

        if (field.name === 'orderStatus') {
            return (
                <span className={`text-[10px] uppercase font-black px-3 py-1 rounded-lg border tracking-wider
                    ${value === 'completed' ? 'border-emerald-500/30 text-emerald-500 bg-emerald-500/05' :
                        value === 'draft' ? 'border-amber-500/30 text-amber-500 bg-amber-500/05' :
                            'border-blue-500/30 text-blue-500 bg-blue-500/05'}`}
                >
                    {value || 'Pending'}
                </span>
            );
        }

        if (field.name === 'paymentMethod') {
            const colors = {
                cod: 'border-amber-500/30 text-amber-500 bg-amber-500/05',
                upi: 'border-indigo-500/30 text-indigo-500 bg-indigo-500/05',
                card: 'border-emerald-500/30 text-emerald-500 bg-emerald-500/05',
                default: 'border-slate-500/30 text-slate-500 bg-slate-500/05'
            };
            const method = (value || '').toLowerCase();
            const badgeClass = colors[method] || colors.default;

            return (
                <span className={`text-[10px] uppercase font-black px-2.5 py-1 rounded-lg border tracking-wider ${badgeClass}`}>
                    {value || 'Pending'}
                </span>
            );
        }

        if (field.name === 'total') {
            return <span className="text-white font-black text-sm">${Number(value || 0).toFixed(2)}</span>;
        }

        if (field.name === 'category') {
            const catName = (typeof value === 'object' ? value?.title || value?.name : value) || 'Uncategorized';
            return (
                <span className="badge badge-indigo text-[10px] px-2 py-0.5 opacity-90">
                    {catName}
                </span>
            );
        }

        if (field.name === 'price') {
            return <span className="text-white font-black text-sm">${value}</span>;
        }

        if (field.name === 'stock') {
            const stockLevel = value > 20 ? 'high' : value > 0 ? 'low' : 'out';
            const colors = {
                high: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
                low: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
                out: 'text-rose-400 bg-rose-500/10 border-rose-500/20'
            };
            return (
                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black border ${colors[stockLevel]}`}>
                    {value}
                </span>
            );
        }

        if (field.type === 'number') {
            return <span className="text-white font-black text-sm">{value}</span>;
        }

        return <span className="text-slate-300 text-sm font-medium">{String(value || '')}</span>;
    };

    return (
        <Table headers={headers}>
            {data.map((item) => (
                <tr key={item._id} className="hover:bg-white/03 transition-colors group">
                    {(imageField || titleField) && (
                        <td className="px-8 py-4">
                            <div className="flex items-center gap-4">
                                {imageField && (
                                    <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/10 shrink-0 bg-white shadow-inner">
                                        {item[imageField.name] ? (
                                            <img
                                                src={`http://localhost:3000/${item[imageField.name].replace('uploads/', '')}`}
                                                alt=""
                                                className="w-full h-full object-contain rounded-lg mix-blend-multiply"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-indigo-600/20 flex items-center justify-center text-[10px] font-black text-indigo-400 rounded-lg">
                                                {getInitials(item.name || item.title || item.username)}
                                            </div>
                                        )}
                                    </div>
                                )}
                                <div className="flex flex-col text-left max-w-[200px]">
                                    <span className="text-white font-bold text-sm tracking-tight truncate" title={titleField ? item[titleField.name] : (item.username || item.email || "Untitled")}>
                                        {((titleField ? item[titleField.name] : (item.username || item.email || "Untitled")) || "").length > 25
                                            ? (titleField ? item[titleField.name] : (item.username || item.email || "Untitled")).slice(0, 25) + "..."
                                            : (titleField ? item[titleField.name] : (item.username || item.email || "Untitled"))}
                                    </span>
                                </div>
                            </div>
                        </td>
                    )}

                    {otherFields.map((field) => {
                        let align = 'text-left';
                        if (field.name === 'createdAt' || field.name === 'orderStatus' || field.name === 'paymentMethod') align = 'text-center';
                        if (field.name === 'total') align = 'text-right';

                        return (
                            <td key={field.name} className={`px-8 py-4 ${align}`}>
                                {field.name === 'orderId' ? (
                                    <span className="text-white font-bold text-sm">{item[field.name] || ""}</span>
                                ) : renderCell(item, field)}
                            </td>
                        );
                    })}

                    {statusField && (
                        <td className="px-8 py-4 text-center">
                            {config.name === 'users' && item.isAdmin ? (
                                <div className="flex justify-center">
                                    <div className="w-9 h-5 bg-indigo-600/20 rounded-full border border-indigo-500/20 relative opacity-50 cursor-not-allowed">
                                        <div className="absolute top-[2px] right-[2px] bg-white rounded-full h-4 after:w-4 w-4"></div>
                                    </div>
                                </div>
                            ) : (
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={item.isActive}
                                        onChange={() => onToggleStatus && onToggleStatus(item)}
                                    />
                                    <div className="w-9 h-5 bg-white/05 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-400 after:border-slate-400 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600 peer-checked:after:bg-white peer-checked:after:border-white border border-white/10"></div>
                                </label>
                            )}
                        </td>
                    )}

                    <td className="px-8 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 text-right">
                            {(onView && (config.name === 'users' || config.name === 'orders')) && (
                                <button
                                    onClick={() => onView(item)}
                                    className="w-8 h-8 rounded-lg glass border border-white/05 text-slate-400 hover:text-white hover:bg-indigo-600 transition-all flex items-center justify-center text-right"
                                    title="View Info"
                                >
                                    <FontAwesomeIcon icon={faEye} className="text-xs" />
                                </button>
                            )}
                            {!config.readonly && (
                                <>
                                    <button
                                        onClick={() => onEdit(item)}
                                        className="w-8 h-8 rounded-lg glass border border-white/05 text-slate-400 hover:text-white hover:bg-emerald-600 transition-all flex items-center justify-center"
                                        title="Edit"
                                    >
                                        <FontAwesomeIcon icon={faEdit} className="text-xs" />
                                    </button>
                                    {!(config.name === 'users' && item.isAdmin) && (
                                        <button
                                            onClick={() => onDelete(item._id)}
                                            className="w-8 h-8 rounded-lg glass border border-white/05 text-slate-400 hover:text-white hover:bg-rose-600 transition-all flex items-center justify-center"
                                            title="Delete"
                                        >
                                            <FontAwesomeIcon icon={faTrash} className="text-xs" />
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                    </td>
                </tr>
            ))}
            {data.length === 0 && (
                <tr>
                    <td colSpan={headers.length} className="px-8 py-12 text-center text-slate-400 font-medium italic">
                        No {config.label.toLowerCase()} found.
                    </td>
                </tr>
            )}
        </Table>
    );
}

export default DynamicTable;
