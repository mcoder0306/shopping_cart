import React from 'react';

function FormField({ field, register, errors, preview, setValue }) {
    if (!field) return null;

    const error = errors[field.name];

    const renderInput = () => {
        switch (field.type) {
            case 'textarea':
                return (
                    <textarea
                        id={field.name}
                        placeholder={`Enter ${field.label}`}
                        className='premium-input min-h-[100px] py-3'
                        {...register(field.name, { required: field.required && `${field.label} is required` })}
                    />
                );
            case 'select':
                return (
                    <select
                        id={field.name}
                        className='premium-input bg-slate-900 border-white/10'
                        {...register(field.name, { required: field.required && `${field.label} is required` })}
                    >
                        <option value="" className="bg-slate-900">Select {field.label}</option>
                        {field.options?.map(opt => (
                            <option key={opt.value} value={opt.value} className="bg-slate-900">{opt.label}</option>
                        ))}
                    </select>
                );
            case 'file':
                return (
                    <div className="flex flex-col gap-2">
                        <input
                            type="file"
                            id={field.name}
                            className='premium-input file:hidden pt-3'
                            {...register(field.name, {
                                required: field.required && !preview && `${field.label} is required`
                            })}
                        />
                        {preview && (
                            <div className="mt-2 w-full h-32 rounded-xl border border-white/10 overflow-hidden bg-white/05 flex items-center justify-center">
                                <img src={preview} alt="Preview" className="h-full w-full object-contain" />
                            </div>
                        )}
                    </div>
                );
            case 'checkbox':
                return (
                    <div className="flex items-center gap-3 p-3 glass rounded-xl border border-white/05 cursor-pointer">
                        <input
                            type="checkbox"
                            id={field.name}
                            className="w-5 h-5 rounded border-white/10 bg-white/05 text-indigo-600 focus:ring-indigo-500"
                            {...register(field.name)}
                        />
                        <span className="text-sm text-slate-300">{field.label}</span>
                    </div>
                );
            default:
                return (
                    <input
                        type={field.type}
                        id={field.name}
                        placeholder={`Enter ${field.label}`}
                        className='premium-input'
                        {...register(field.name, {
                            required: field.required && `${field.label} is required`,
                            valueAsNumber: field.type === 'number'
                        })}
                    />
                );
        }
    };

    return (
        <div className={`flex flex-col gap-2 ${field.type === 'textarea' ? 'md:col-span-2' : ''}`}>
            <label htmlFor={field.name} className='text-xs font-black text-slate-400 uppercase tracking-widest'>
                {field.label}
                {field.required && <span className="text-rose-500 ml-1">*</span>}
            </label>
            {renderInput()}
            {error && <p className='text-red-400 text-xs font-semibold'>{error.message}</p>}
        </div>
    );
}

export default FormField;
