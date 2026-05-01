import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useOutletContext } from 'react-router-dom'
import { toast } from 'react-toastify'
import { api } from '../../utils/api'
import FormField from '../../components/admin/FormField'

function ProductForm({ popup, setPopup, setRefresh }) {
    const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm()
    const { dashboardData } = useOutletContext()
    const categories = dashboardData?.categories || []
    const [config, setConfig] = useState(null)
    const [isLoadingConfig, setIsLoadingConfig] = useState(true)
    const [preview, setPreview] = useState(null)

    const selectedImage = watch("image")

    // Fetch configuration for the product module
    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const res = await api.get("/admin-config/products")
                setConfig(res.data)
            } catch (err) {
                console.error("Failed to load product config", err)
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
            const product = dashboardData.products.find(p => p._id === popup.data)
            if (product) {
                reset(product)
                // Handle complex fields like category (if it's an object, we want just the ID)
                if (product.category && typeof product.category === 'object') {
                    setValue('category', product.category._id)
                }
                if (product.image) {
                    setPreview(`http://localhost:3000/${product.image.replace('uploads/', '')}`)
                }
            }
        }
    }, [popup.data, reset, dashboardData, setValue])

    // Handle image preview
    useEffect(() => {
        if (selectedImage && selectedImage[0] instanceof File) {
            const objectUrl = URL.createObjectURL(selectedImage[0])
            setPreview(objectUrl)
            return () => URL.revokeObjectURL(objectUrl)
        }
    }, [selectedImage])

    const submitHandler = async (data) => {
        try {
            const formData = new FormData()
            Object.keys(data).forEach(key => {
                if (data[key] instanceof FileList) {
                    if (data[key][0]) formData.append(key, data[key][0])
                } else if (data[key] !== null && data[key] !== undefined) {
                    formData.append(key, data[key])
                }
            })

            let res;
            if (popup.data) {
                res = await api.put(`/admin/product/${popup.data}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                })
            } else {
                res = await api.post('/admin/product', formData, {
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

    if (isLoadingConfig) {
        return <div className="p-10 text-white text-center">Loading Configuration...</div>
    }

    return (
        <div className='glass rounded-3xl p-6 sm:p-8 md:p-10 border border-white/05 animate-slide-up'>
            <h1 className='text-xl md:text-2xl font-black text-white text-center mb-6 uppercase tracking-tight'>
                {popup.data ? "Edit" : "Add"} {config?.label || "Product"}
            </h1>
            <form onSubmit={handleSubmit(submitHandler)} className='flex flex-col gap-6'>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    {config?.fields?.map(field => {
                        const isEdit = !!popup.data
                        if ((!isEdit && field.showInCreate === false) || (isEdit && field.showInEdit === false)) return null;

                        // Inject dynamic options for reference fields if needed
                        let fieldConfig = { ...field };
                        if (field.name === 'category' && categories.length > 0) {
                            fieldConfig.options = categories.map(c => ({ label: c.title, value: c._id }));
                        }

                        return (
                            <FormField
                                key={field.name}
                                field={fieldConfig}
                                register={register}
                                errors={errors}
                                preview={field.type === 'file' ? preview : null}
                                onFileChange={field.type === 'file' ? (e) => {
                                    // Custom file change handled by register normally, 
                                    // but preview logic is in our useEffect
                                } : null}
                            />
                        )
                    })}
                </div>

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