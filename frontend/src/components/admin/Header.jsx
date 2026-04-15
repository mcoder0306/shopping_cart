import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faSignOut, faSignOutAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import { logoutUser } from '../../features/AuthSlice';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';

function Header({ setIsMobileMenuOpen }) {
    const user = useSelector(state => state.auth.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [openUserMenu, setOpenUserMenu] = useState(false);

    const handleLogout = () => {
        dispatch(logoutUser());
        toast.success("Logged out successfully");
        navigate('/');
    };

    return (
        <header className="h-20 bg-[#0f172a] border-b border-indigo-500/10 px-6 lg:px-10 flex items-center justify-between sticky top-0 z-20">
            {/* Mobile menu toggle */}
            <button
                className="lg:hidden w-10 h-10 rounded-xl bg-white/05 border border-white/05 flex items-center justify-center text-slate-400 hover:text-white transition-all active:scale-95"
                onClick={() => setIsMobileMenuOpen(prev => !prev)}
            >
                <FontAwesomeIcon icon={faBars} />
            </button>

            {/* Spacer for mobile, empty for desktop alignment */}
            <div className="hidden lg:block"></div>

            {/* User Info & Actions */}
            <div className="flex items-center gap-6">
                <div className="relative">
                    <button
                        onClick={() => setOpenUserMenu(!openUserMenu)}
                        className="flex items-center gap-4 group"
                    >
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{user?.name || "Admin User"}</p>
                            <p className="text-[10px] uppercase font-black text-slate-500 tracking-widest leading-none mt-1">Administrator</p>
                        </div>

                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 overflow-hidden flex items-center justify-center group-hover:scale-105 group-hover:border-indigo-500 transition-all">
                            {user?.image ? (
                                <img
                                    src={`http://localhost:3000/${user.image?.replace('uploads/', '')}`}
                                    alt={user.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-indigo-400 font-black text-sm uppercase">{user?.name?.charAt(0)}</span>
                            )}
                        </div>
                    </button>

                    {/* User Dropdown Menu */}
                    {openUserMenu && (
                        <>
                            <div
                                className="fixed inset-0 z-40 bg-transparent"
                                onClick={() => setOpenUserMenu(false)}
                            />
                            <div className="absolute right-0 mt-4 w-42 bg-[#111827] border border-white/05 rounded-2xl p-2 z-50 shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-slide-up-faint">
                                <ul className="flex flex-col gap-1">
                                    <li>
                                        <button
                                            onClick={() => { navigate("/admin/profile"); setOpenUserMenu(false); }}
                                            className="w-full text-left p-3  rounded-xl text-slate-300 hover:bg-gray-600 hover:text-white transition-all flex items-center gap-3 text-xs font-bold uppercase tracking-widest"
                                        >
                                            Profile
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            onClick={() => { handleLogout(); setOpenUserMenu(false); }}
                                            className="w-full text-left p-3 hover:bg-gray-600 hover:text-white rounded-xl text-slate-400 transition-all flex items-center gap-3 text-xs font-bold uppercase tracking-widest"
                                        >
                                            Logout<FontAwesomeIcon icon={faSignOut} />
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Header;
