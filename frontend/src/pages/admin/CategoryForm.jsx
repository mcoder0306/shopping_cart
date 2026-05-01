import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { api } from '../../utils/api'
import { useOutletContext } from 'react-router-dom'
import FormField from '../../components/admin/FormField'

function CategoryForm({ popup, setPopup, setRefresh }) {
    const { register, handleSubmit, formState: { errors }, reset } = useForm()
    const { dashboardData } = useOutletContext()
    const [config, setConfig] = useState(null)
    const [isLoadingConfig, setIsLoadingConfig] = useState(true)

    // Fetch configuration for the category module
    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const res = await api.get("/admin-config/categories")
                setConfig(res.data)
            } catch (err) {
                console.error("Failed to load category config", err)
                toast.error("Failed to load form configuration")
            } finally {
                setIsLoadingConfig(false)
            }
        }
        fetchConfig()
    }, [])

    // Pre-fill form when editing
    useEffect(() => {
        if (popup.data && dashboardData) {
            const category = dashboardData.categories.find(c => c._id === popup.data)
            if (category) {
                reset(category)
            }
        }
    }, [popup.data, reset, dashboardData])

    const submitHandler = async (data) => {
        try {
            let res;
            if (popup.data) {
                res = await api.put(`/admin/category/${popup.data}`, data)
            }
            else {
                res = await api.post("/admin/category", data)
            }

            if (res.status === 201 || res.status === 200) {
                setPopup({ type: null, data: null })
                setRefresh && setRefresh()
                toast.success(res.data.message || `Category ${popup.data ? "updated" : "added"} successfully`, {
                    theme: 'dark',
                })
            }

        } catch (error) {
            toast.warning(error.response?.data?.message || 'Something went wrong', {
                theme: 'dark',
            })
        }
    }

    if (isLoadingConfig) {
        return <div className="p-10 text-white text-center">Loading Configuration...</div>
    }

    return (
        <div className='glass rounded-3xl p-6 sm:p-8 md:p-10 border border-white/05 animate-slide-up'>
            <h1 className='text-xl md:text-2xl font-black text-white text-center mb-6 uppercase tracking-tight'>
                {popup.data ? "Edit" : "Add"} {config?.label || "Category"}
            </h1>
            <form onSubmit={handleSubmit(submitHandler)} className='flex flex-col gap-6'>

                {/* Dynamically render fields from config */}
                <div className="grid grid-cols-1 gap-6">
                    {config?.fields?.map(field => {
                        const isEdit = !!popup.data
                        if ((!isEdit && field.showInCreate === false) || (isEdit && field.showInEdit === false)) return null;

                        return (
                            <FormField
                                key={field.name}
                                field={field}
                                register={register}
                                errors={errors}
                            />
                        )
                    })}
                </div>

                {/* Submit Button */}
                <button
                    type='submit'
                    className='btn-premium w-full py-4 rounded-2xl font-extrabold text-base flex items-center justify-center gap-3 group shadow-xl shadow-indigo-600/20 mt-2'
                >
                    {popup.data ? "Update" : "Create"}
                </button>
            </form>
        </div>
    )
}

export default CategoryForm