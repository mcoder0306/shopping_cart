import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { api } from '../utils/api'
import { toast } from 'react-toastify'

function ProductForm({ popup, setPopup }) {
    const { register, handleSubmit, formState: { errors }, reset } = useForm()
    const [categories, setCategories] = useState([])

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await api.get('/categories/getAllCategories')
                if (res.status === 200) {
                    setCategories(res.data.data)
                }
            } catch (error) {
                console.error("Failed to fetch categories", error)
            }
        }
        fetchCategories()

        if (popup.data) {
            const fetchProduct = async () => {
                try {
                    const res = await api.get(`/products/getProducts?id=${popup.data}`)
                    if (res.status === 200 && res.data.data.length > 0) {
                        const product = res.data.data[0]
                        reset({
                            title: product.title,
                            description: product.description,
                            price: product.price,
                            stock: product.stock,
                            category: product.category._id
                        })
                    }
                } catch (error) {
                    toast.error("Failed to load product data")
                }
            }
            fetchProduct()
        }
    }, [popup.data, reset])

    const submitHandler = async (data) => {
        try {
            const formData = new FormData()
            formData.append('title', data.title)
            formData.append('description', data.description)
            formData.append('price', data.price)
            formData.append('stock', data.stock)
            formData.append('category', data.category)
            if (data.image && data.image[0]) {
                formData.append('image', data.image[0])
            }

            let res;
            if (popup.data) {
                res = await api.put(`/products/updateProduct/${popup.data}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                })
            } else {
                res = await api.post('/products/addProduct', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                })
            }

            if (res.status === 200 || res.status === 201) {
                toast.success(`Product ${popup.data ? 'updated' : 'added'} successfully`, { theme: 'dark' })
                setPopup({ type: null, data: null })
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong", { theme: 'dark' })
        }
    }

    return (
        <div className='glass rounded-3xl p-8 md:p-10 border border-white/05 animate-slide-up'>
            <h1 className='text-2xl text-gray-300 text-center p-3 m-2'>{popup.data ? "Edit" : "Add"} Product</h1>
            <form onSubmit={handleSubmit(submitHandler)} className='flex flex-col gap-6'>

                {/* Title */}
                <div className='flex flex-col gap-2'>
                    <label htmlFor="title" className='text-xs font-black text-slate-400 uppercase tracking-widest'>
                        Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        placeholder='Enter Product title'
                        className='premium-input'
                        style={{ paddingLeft: '2.75rem' }}
                        {...register("title", { required: "title is required" })}
                    />
                    {errors.title && <p className='text-red-400 text-xs font-semibold'>{errors.title.message}</p>}
                </div>

                {/* Description */}
                <div className='flex flex-col gap-2'>
                    <label htmlFor="description" className='text-xs font-black text-slate-400 uppercase tracking-widest'>
                        Description
                    </label>
                    <textarea
                        id="description"
                        placeholder='Enter Product description'
                        className='premium-input min-h-[100px] py-3'
                        style={{ paddingLeft: '2.75rem' }}
                        {...register("description", { required: "description is required" })}
                    />
                    {errors.description && <p className='text-red-400 text-xs font-semibold'>{errors.description.message}</p>}
                </div>

                {/* Price and Stock Grid */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor="price" className='text-xs font-black text-slate-400 uppercase tracking-widest'>
                            Price
                        </label>
                        <input
                            type="number"
                            id="price"
                            min={0}
                            step={0.01}
                            placeholder='Enter Product Price'
                            className='premium-input w-full'
                            style={{ paddingLeft: '2.75rem' }}
                            {...register("price", {
                                valueAsNumber: true,
                                required: "Price is required",
                                min: { value: 0, message: "Price must be positive" },
                                validate: (value) =>
                                    value > 0 || "Price can not be 0 or less"
                            })}
                        />
                        {errors.price && <p className='text-red-400 text-xs font-semibold'>{errors.price.message}</p>}
                    </div>

                    <div className='flex flex-col gap-2'>
                        <label htmlFor="stock" className='text-xs font-black text-slate-400 uppercase tracking-widest'>
                            Stock
                        </label>
                        <input
                            type="number"
                            id="stock"
                            min={0}
                            placeholder='Enter Product stock'
                            className='premium-input w-full'
                            style={{ paddingLeft: '2.75rem' }}
                            {...register("stock", {
                                required: "stock is required",
                                min: { value: 0, message: "Stock cannot be negative" },
                                valueAsNumber: true,
                                validate: (value) =>
                                    Number.isInteger(value) || "Stock must be an integer"
                            })}
                        />
                        {errors.stock && <p className='text-red-400 text-xs font-semibold'>{errors.stock.message}</p>}
                    </div>
                </div>

                {/* Image and Category Grid */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>

                    {/* Image Field */}
                    <div className='flex flex-col gap-2'>
                        <label htmlFor="image" className='text-xs font-black text-slate-400 uppercase tracking-widest'>
                            Image
                        </label>
                        <input
                            type="file"
                            id="image"
                            className='premium-input file:hidden pt-3'
                            style={{ paddingLeft: '1rem' }}
                            {...register("image", { required: !popup.data ? "image is required" : false })}
                        />
                        {errors.image && <p className='text-red-400 text-xs font-semibold'>{errors.image.message}</p>}
                    </div>

                    {/* Category Field */}
                    <div className='flex flex-col gap-2'>
                        <label htmlFor="category" className='text-xs font-black text-slate-400 uppercase tracking-widest'>
                            Category
                        </label>
                        <select
                            id="category"
                            className='premium-input w-full bg-transparent'
                            style={{ paddingLeft: '1rem' }}
                            {...register("category", { required: "category is required" })}
                        >
                            <option value="" className="bg-slate-900">Select Category</option>
                            {categories.map(cat => (
                                <option key={cat._id} value={cat._id} className="bg-slate-900">{cat.title}</option>
                            ))}
                        </select>
                        {errors.category && <p className='text-red-400 text-xs font-semibold'>{errors.category.message}</p>}
                    </div>
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

export default ProductForm