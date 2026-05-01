import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faPhone, faShieldAlt, faCircle, faCalendarAlt, faIdBadge } from '@fortawesome/free-solid-svg-icons';

function UserDetails({ user }) {
    if (!user) return null;

    const details = [
        { icon: faEnvelope, label: 'Email Address', value: user.email },
        { icon: faPhone, label: 'Phone Number', value: user.phone || 'Not provided' },
        { icon: faShieldAlt, label: 'Account Type', value: user.isAdmin ? 'Administrator' : 'Customer', color: user.isAdmin ? 'text-indigo-400' : 'text-emerald-400' },
        { icon: faIdBadge, label: 'Account ID', value: user._id },
        { icon: faCalendarAlt, label: 'Joined On', value: new Date(user.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' }) },
    ];

    return (
        <div className="flex flex-col animate-fade-in">
            {/* Header / Profile Info */}
            <div className="p-8 border-b border-white/05 bg-white/02 flex flex-col items-center text-center gap-4">
                <div className="w-24 h-24 rounded-3xl glass border border-white/10 flex items-center justify-center overflow-hidden bg-slate-900 shadow-2xl relative group">
                    {user.image ? (
                        <img
                            src={`http://localhost:3000/${user.image.replace('uploads/', '')}`}
                            alt={user.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                    ) : (
                        <span className="text-4xl font-black text-indigo-400 uppercase">{user.name?.charAt(0)}</span>
                    )}
                    <div className={`absolute bottom-2 right-2 w-4 h-4 rounded-full border-2 border-slate-900 ${user.isActive ? 'bg-emerald-500' : 'bg-slate-500'}`} title={user.isActive ? 'Active' : 'Inactive'} />
                </div>

                <div>
                    <h2 className="text-2xl font-black text-white tracking-tight">{user.name}</h2>
                    <div className="flex items-center justify-center gap-2 mt-1">
                        <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-0.5 rounded-full border ${user.isAdmin ? 'border-indigo-500/30 text-indigo-400 bg-indigo-500/05' : 'border-emerald-500/30 text-emerald-400 bg-emerald-500/05'}`}>
                            {user.isAdmin ? 'Admin' : 'Customer'}
                        </span>
                        <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-0.5 rounded-full border ${user.isActive ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/05' : 'border-white/10 text-slate-500 bg-white/05'}`}>
                            {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Details Grid */}
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6 bg-black/20">
                {details.map((detail, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 rounded-2xl glass border border-white/05 hover:border-white/10 transition-all group">
                        <div className="w-10 h-10 rounded-xl bg-white/03 flex items-center justify-center text-slate-400 group-hover:bg-indigo-500/10 group-hover:text-indigo-400 transition-all shrink-0">
                            <FontAwesomeIcon icon={detail.icon} />
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">{detail.label}</span>
                            <span className={`text-sm font-bold truncate ${detail.color || 'text-slate-200'}`}>{detail.value}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Addresses Section */}
            {user.addresses && user.addresses.length > 0 && (
                <div className="p-8 flex flex-col gap-4 border-t border-white/05 bg-white/01">
                    <h3 className="text-white font-black text-xs uppercase tracking-[0.2em] flex items-center gap-2 mb-2">
                        <FontAwesomeIcon icon={faIdBadge} className="text-indigo-500" />
                        Saved Addresses
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                        {user.addresses.map((addr, idx) => (
                            <div key={idx} className="p-4 rounded-2xl bg-white/02 border border-white/05 flex flex-col gap-1">
                                <div className="flex items-center justify-between">
                                    <span className="text-indigo-400 text-[10px] font-black uppercase tracking-widest">{addr.label || 'Home'}</span>
                                    {addr.isDefault && <span className="text-emerald-500 text-[8px] font-black uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">Default</span>}
                                </div>
                                <p className="text-white font-bold text-sm">{addr.name}</p>
                                <p className="text-slate-400 text-xs leading-relaxed">
                                    {addr.addressLine}, {addr.city}, {addr.state} - {addr.pincode}
                                </p>
                                <p className="text-slate-500 text-[10px] font-medium mt-1">
                                    <FontAwesomeIcon icon={faPhone} className="mr-1 text-[8px]" />
                                    {addr.phone}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Footer / Stats */}
            <div className="p-6 border-t border-white/05 bg-white/01 flex justify-center">
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">User Identity Document</p>
            </div>
        </div>
    );
}

export default UserDetails;
