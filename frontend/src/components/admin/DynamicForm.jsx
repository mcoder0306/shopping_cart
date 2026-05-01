import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { api } from '../../utils/api';
import FormField from './FormField';

function DynamicForm({ config, initialData, onSuccess, module, categories }) {
    const { register, handleSubmit, formState: { errors }, reset, setValue, watch, getValues } = useForm();
    const [preview, setPreview] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const selectedFile = watch("image");

    useEffect(() => {
        if (initialData) {
            reset(initialData);
            // Handle complex fields like category
            if (initialData.category && typeof initialData.category === 'object') {
                setValue('category', initialData.category._id);
            }
            // Handle image preview for initial data
            if (initialData.image) {
                setPreview(`http://localhost:3000/${initialData.image.replace('uploads/', '')}`);
            }
        } else {
            reset({});
            setPreview(null);
        }
    }, [initialData, reset, setValue]);

    // Handle file preview
    useEffect(() => {
        if (selectedFile && selectedFile[0] instanceof File) {
            const objectUrl = URL.createObjectURL(selectedFile[0]);
            setPreview(objectUrl);
            return () => URL.revokeObjectURL(objectUrl);
        }
    }, [selectedFile]);

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            const formData = new FormData();
            Object.keys(data).forEach(key => {
                if (data[key] instanceof FileList) {
                    if (data[key][0]) formData.append(key, data[key][0]);
                } else if (data[key] !== null && data[key] !== undefined) {
                    formData.append(key, data[key]);
                }
            });

            let res;
            if (initialData?._id) {
                res = await api.put(`/admin/${module}/${initialData._id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                res = await api.post(`/admin/${module}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }

            if (res.status === 200 || res.status === 201) {
                toast.success(`${config.label} ${initialData ? 'updated' : 'added'} successfully`, { theme: 'dark' });
                onSuccess && onSuccess();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Operation failed", { theme: 'dark' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='glass rounded-3xl p-6 sm:p-8 md:p-10 border border-white/05 animate-slide-up h-fit'>
            <h1 className='text-xl md:text-2xl font-black text-white text-center mb-6 uppercase tracking-tight'>
                {initialData ? "Edit" : "Add"} {config.label}
            </h1>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    {config.fields
                        .filter(f => initialData ? f.showInEdit !== false : f.showInCreate !== false)
                        .map((field) => {
                            let fieldConfig = { ...field };
                            if (field.name === 'category' && categories) {
                                fieldConfig.options = categories.map(c => ({ label: c.title, value: c._id }));
                            }
                            const isFullWidth = ['title', 'name', 'username', 'description', 'content'].includes(field.name);
                            return (
                                <div key={field.name} className={isFullWidth ? "col-span-full" : ""}>
                                    <FormField
                                        field={fieldConfig}
                                        register={register}
                                        errors={errors}
                                        preview={(field.type === 'file' || field.name === 'image') ? preview : null}
                                    />
                                </div>
                            );
                        })}
                </div>

                <button
                    type='submit'
                    disabled={isLoading}
                    className='btn-premium w-full py-4 rounded-2xl font-extrabold text-base flex items-center justify-center gap-3 group shadow-xl shadow-indigo-600/20 mt-2 disabled:opacity-50'
                >
                    {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        initialData ? "Update" : "Create"
                    )}
                </button>
            </form>
        </div>
    );
}

export default DynamicForm;
