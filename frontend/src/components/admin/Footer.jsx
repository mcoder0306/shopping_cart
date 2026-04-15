import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-solid-svg-icons';

function Footer() {
    return (
        <footer className="h-16 bg-[#0f172a] border-t border-indigo-500/10 px-6 lg:px-10 flex items-center justify-center mt-auto">
            <p className="text-slate-500 text-[11px] font-bold tracking-tight">
                &copy; 2026 <span className="text-white font-black">ShoppyMart</span>. All rights reserved.
            </p>
        </footer>
    );
}

export default Footer;
