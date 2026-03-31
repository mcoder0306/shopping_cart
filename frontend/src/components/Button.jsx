import React from 'react'

function Button({ onclick, children, className = "" }) {
    return (
        <button
            className={`btn-premium px-8 py-3 rounded-xl font-bold transition-all active:scale-95 text-sm shadow-lg shadow-indigo-600/20 ${className}`}
            onClick={onclick}
        >
            {children}
        </button>
    )
}

export default Button