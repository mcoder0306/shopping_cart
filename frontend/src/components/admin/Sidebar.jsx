import React from 'react';
import { NavLink } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faBox, faTags, faBagShopping, faUsers, faXmark } from '@fortawesome/free-solid-svg-icons';

const navItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: faChartLine },
    { label: 'Products', path: '/admin/products', icon: faBox },
    { label: 'Categories', path: '/admin/categories', icon: faTags },
    { label: 'Orders', path: '/admin/orders', icon: faBagShopping },
    { label: 'Users', path: '/admin/users', icon: faUsers },
];

function Sidebar({ isOpen, onClose }) {
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
                {navItems.map((item) => (
                    <NavLink
                        key={item.label}
                        to={item.path}
                        onClick={onClose}
                        className={({ isActive }) =>
                            `flex items-center gap-4 px-4 py-3 rounded-xl font-bold text-sm tracking-wide transition-all ${isActive
                                ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.1)]'
                                : 'text-slate-400 hover:bg-white/10 hover:text-white border border-transparent'
                            }`
                        }
                    >
                        <FontAwesomeIcon icon={item.icon} className="w-4" />
                        {item.label}
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
}

export default Sidebar;
