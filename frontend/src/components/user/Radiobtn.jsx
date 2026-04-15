import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons'

function Radiobtn({ name, id, checked, onchange, label }) {
    return (
        <label
            htmlFor={id}
            className={`flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer ${checked ? 'bg-indigo-600/20 border-indigo-500 text-white' : 'bg-slate-800/20 border-slate-700/50 text-slate-400 hover:border-slate-500'}`}
        >
            <input
                type="radio"
                name={name}
                value={id}
                id={id}
                checked={checked}
                onChange={onchange}
                className='hidden'
            />
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${checked ? 'border-indigo-500 bg-indigo-500' : 'border-slate-600'}`}>
                {checked && <div className='w-2 h-2 rounded-full bg-white shadow-sm' />}
            </div>
            <span className='font-medium'>{label}</span>
            {checked && <FontAwesomeIcon icon={faCheckCircle} className='ml-auto text-indigo-500 animate-in fade-in scale-in-0 duration-300' />}
        </label>
    )
}

export default Radiobtn