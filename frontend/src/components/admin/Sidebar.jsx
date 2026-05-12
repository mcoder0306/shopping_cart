import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faBox, faTags, faBagShopping, faUsers, faXmark } from '@fortawesome/free-solid-svg-icons';
import { api } from '../../utils/api';
import { iconMap } from '../../utils/iconMap';

function Sidebar({ isOpen, onClose }) {
    const [menus, setMenus] = useState([]);
    useEffect(() => {
        const fetchAdminConfigs = async () => {
            try {
                const res = await api.get("/registry/getSidebarModules");
                // Map backend keys to frontend expected keys
                const mappedMenus = res.data.data.map(m => ({
                    name: m.modelName,
                    label: m.sidebarLabel,
                    icon: m.icon // Assuming backend might provide this, or fallback in UI
                }));
                setMenus(mappedMenus);
            } catch (error) {
                console.error("Failed to fetch sidebar modules:", error);
            }
        }
        fetchAdminConfigs()
    }, []);

    return (
        <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0f172a] border-r border-gray-500/20 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'
            }`}>
            <div className="h-20 flex items-center justify-between px-8 border-b border-white/05">
                <span className='font-black text-xl sm:text-2xl tracking-tight'>
                    <span className='text-gradient'>Shoppy</span>
                    <span className='text-white'>Mart</span>
                </span>
                <button
                    onClick={onClose}
                    className="lg:hidden p-2 text-slate-400 hover:text-white"
                >
                    <FontAwesomeIcon icon={faXmark} className="text-xl" />
                </button>
            </div>

            <nav className="flex-1 px-4 py-8 flex flex-col gap-2 overflow-y-auto custom-scrollbar">
                <NavLink
                    to="/admin/dashboard"
                    onClick={onClose}
                    className={({ isActive }) =>
                        `flex items-center gap-4 px-4 py-3 rounded-xl font-bold text-sm transition-all ${isActive
                            ? 'text-indigo-400 bg-indigo-600/10'
                            : 'text-slate-400 hover:text-white'
                        }`
                    }
                >
                    <FontAwesomeIcon icon={faChartLine} />
                    Dashboard
                </NavLink>

                {/* <div className="my-4 h-px bg-white/05 mx-4" /> */}
                {/* <p className="px-4 text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Modules</p> */}

                {menus
                    .filter(item => item.name.toLowerCase() !== 'dashboard')
                    .map((item) => (
                        <NavLink
                            key={item.name}
                            to={`/admin/${item.name}`}
                            onClick={onClose}
                            className={({ isActive }) =>
                                `flex items-center gap-4 px-4 py-3 rounded-xl font-bold text-sm transition-all ${isActive
                                    ? 'text-indigo-400 bg-indigo-600/10'
                                    : 'text-slate-400 hover:text-white'
                                }`
                            }
                        >
                            <FontAwesomeIcon icon={iconMap[item.icon] || faBox} />
                            {item.label}
                        </NavLink>
                    ))}
            </nav>
        </aside>
    );
}

export default Sidebar;
