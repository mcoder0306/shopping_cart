import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useOutletContext } from 'react-router-dom'
import { toast } from 'react-toastify'
import { api } from '../../utils/api'

function ProductForm({ popup, setPopup, setRefresh }) {
    const { register, handleSubmit, formState: { errors }, reset, watch } = useForm()
    const { dashboardData } = useOutletContext()
    const categories = dashboardData?.categories || []
    const [preview, setPreview] = useState(null)
    const selectedImage = watch("image")

    useEffect(() => {
        if (popup.data && dashboardData) {
            const product = dashboardData.products.find(p => p._id === popup.data)
            if (product) {
                reset({
                    title: product.title,
                    description: product.description,
                    price: product.price,
                    stock: product.stock,
                    category: product.category?._id || ''
                })
                if (product.image) {
                    setPreview(`http://localhost:3000/${product.image.replace('uploads/', '')}`)
                }
            } else {
                toast.error("Product not found in local data")
            }
        }
    }, [popup.data, reset, dashboardData])

    useEffect(() => {
        if (selectedImage && selectedImage[0]) {
            const objectUrl = URL.createObjectURL(selectedImage[0])
            setPreview(objectUrl)
            return () => URL.revokeObjectURL(objectUrl)
        }
    }, [selectedImage])

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
                setRefresh && setRefresh(prev => prev + 1)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong", { theme: 'dark' })
        }
    }

    return (
        <div className='glass rounded-3xl p-6 sm:p-8 md:p-10 border border-white/05 animate-slide-up'>
            <h1 className='text-xl md:text-2xl font-black text-white text-center mb-6 uppercase tracking-tight'>{popup.data ? "Edit" : "Add"} Product</h1>
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
                            {...register("stock", {
                                required: "stock is required",
                                min: { value: 1, message: "Stock must be at least 1" },
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
                            {...register("image", { required: !popup.data ? "image is required" : false })}
                        />
                        {preview && (
                            <div className="mt-2 w-full h-32 rounded-xl border border-white/10 overflow-hidden bg-white/05 flex items-center justify-center">
                                <img src={preview} alt="Preview" className="h-full w-full object-contain" />
                            </div>
                        )}
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