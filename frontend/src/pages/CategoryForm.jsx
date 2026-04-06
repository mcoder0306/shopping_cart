import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { api } from '../utils/api'

function CategoryForm({ popup, setPopup }) {
    const { register, handleSubmit, formState: { errors }, reset } = useForm()
    const submitHandler = async (data) => {
        try {
            let res;
            if (popup.data) {
                res = await api.put(`/categories/updateCategory/${popup.data}`, {
                    title: data.title
                })
            }
            else {
                res = await api.post("/categories/addCategory", {
                    title: data.title
                })
            }
            if (res.status === 201 || res.status == 200) {
                setPopup({ type: null, data: null })
                toast.success(res.data.data.message || `category ${popup.data ? "updated" : "added"} successfully`, {
                    theme: 'dark',
                })
            }

        } catch (error) {
            if (error.status === 409) {
                toast.warning('category already exists!!', {
                    theme: 'dark',
                })
            }
            toast.warning(error || 'Something went wrong', {
                theme: 'dark',
            })
        }
    }
    useEffect(() => {
        const loadData = async () => {
            const res = await api.get(`/categories/getAllCategories?id=${popup.data}`)
            reset(res.data.data[0])
        }
        popup.data && loadData()
    }, [])
    return (
        <div className='glass rounded-3xl p-8 md:p-10 border border-white/05 animate-slide-up'>
            <h1 className='text-2xl text-gray-300 text-center p-3 m-2'>{popup.data ? "Edit" : "Add"} Category</h1>
            <form onSubmit={handleSubmit(submitHandler)} className='flex flex-col gap-6'>

                {/* Title Field */}
                <div className='flex flex-col gap-2'>
                    <label htmlFor="title" className='text-xs font-black text-slate-400 uppercase tracking-widest'>
                        Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        placeholder='Enter category title'
                        className='premium-input'
                        style={{ paddingLeft: '2.75rem' }}
                        {...register("title", { required: "title is required" })}
                    />
                    {errors.title && <p className='text-red-400 text-xs font-semibold'>{errors.title.message}</p>}
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