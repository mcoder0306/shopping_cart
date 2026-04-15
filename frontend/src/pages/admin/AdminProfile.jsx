import React, { useEffect, useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faUser, faEnvelope, faArrowRight, faCamera,
    faTrashAlt, faPhone, faUserShield
} from '@fortawesome/free-solid-svg-icons'
import { api } from '../../utils/api'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { setLoggedinUser } from '../../features/AuthSlice'
import PopUp from '../../components/user/Popup'

function AdminProfile() {
    const { register, handleSubmit, formState: { errors }, reset } = useForm()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const user = useSelector(state => state.auth.user)
    const [isLoading, setIsLoading] = useState(false)
    const [selectedFile, setSelectedFile] = useState(null)
    const [previewUrl, setPreviewUrl] = useState(null)
    const [showDeleteImageModal, setShowDeleteImageModal] = useState(false)
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (user) {
            reset({
                name: user.name,
                email: user.email,
                phone: user.phone || ''
            })
        }
    }, [user, reset])

    const handleCameraClick = () => {
        fileInputRef.current.click();
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleDeleteImage = async () => {
        if (previewUrl && !user?.image) {
            setPreviewUrl(null)
            setSelectedFile(null)
            fileInputRef.current.value = ''
            setShowDeleteImageModal(false)
            return
        }
        try {
            const res = await api.delete('/users/deleteProfileImage')
            if (res.status === 200) {
                toast.success('Profile image removed', { theme: 'dark', autoClose: 2000 })
                dispatch(setLoggedinUser(res.data.data))
                setPreviewUrl(null)
                setSelectedFile(null)
                if (fileInputRef.current) fileInputRef.current.value = ''
            }
        } catch (error) {
            toast.error('Failed to delete image. Please try again.', { theme: 'dark' })
        } finally {
            setShowDeleteImageModal(false)
        }
    }

    const submitHandler = async (data) => {
        setIsLoading(true)
        try {
            const formData = new FormData();
            formData.append("name", data.name);
            formData.append("phone", data.phone);
            if (selectedFile) {
                formData.append("image", selectedFile);
            }

            const res = await api.patch("/users/updateDetails", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })

            if (res.status === 200) {
                toast.success('Admin profile updated successfully! 🚀', {
                    theme: 'dark',
                    autoClose: 2500,
                })
                dispatch(setLoggedinUser(res.data.data))
                setSelectedFile(null)
            } else {
                toast.warning(res.data.message || 'Something went wrong', {
                    theme: 'dark',
                })
            }
        } catch (error) {
            const msg = error.response?.data?.message || 'Update failed. Please try again.'
            toast.error(msg, {
                theme: 'dark',
                autoClose: 3000,
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className='min-h-full space-y-12 pb-12'>
            {/* Header */}
            <div className='text-left animate-fade-in'>
                <h1 className='text-3xl md:text-4xl font-black text-white mb-3 tracking-tight'>
                    Admin <span className='text-indigo-500'>Profile</span>
                </h1>
                <p className='text-slate-400 text-sm'>Manage your administrative account details and security</p>
            </div>

            {/* Profile Section */}
            <section className='glass rounded-[2.5rem] p-8 md:p-12 border border-white/05 shadow-2xl relative overflow-hidden'>
                {/* Background glow */}
                <div className='absolute -top-24 -right-24 w-64 h-64 bg-indigo-600/10 blur-[80px] rounded-full' />

                <form onSubmit={handleSubmit(submitHandler)} className="relative z-10">
                    <div className='grid grid-cols-1 lg:grid-cols-12 gap-12'>
                        {/* Avatar Part */}
                        <div className='lg:col-span-4 flex flex-col items-center gap-6'>
                            <div className='relative group'>
                                <div className='w-48 h-48 rounded-[2.5rem] bg-indigo-500/10 border-2 border-dashed border-white/10 flex items-center justify-center text-indigo-400 text-7xl shadow-inner overflow-hidden group-hover:border-indigo-500/50 transition-all duration-500'>
                                    {
                                        previewUrl ? (
                                            <img src={previewUrl} alt="preview" className='w-full h-full object-cover' />
                                        ) : user?.image ? (
                                            <img src={`http://localhost:3000/${user.image?.replace('uploads/', '')}`} alt="profile image" className='w-full h-full object-cover' />
                                        ) : (
                                            <span className="text-7xl font-black text-indigo-400 uppercase">{user.name?.charAt(0)}</span>
                                        )
                                    }
                                    <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handleImageChange} />
                                    <div onClick={handleCameraClick} className='absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex rounded-[2.5rem] flex-col items-center justify-center cursor-pointer transition-all duration-300'>
                                        <FontAwesomeIcon icon={faCamera} className='text-white text-2xl mb-2' />
                                        <span className='text-white text-xs font-bold uppercase tracking-tighter'>Change Photo</span>
                                    </div>
                                </div>
                                {(previewUrl || user?.image) && (
                                    <button
                                        type="button"
                                        onClick={() => setShowDeleteImageModal(true)}
                                        className='absolute -top-2 -right-2 w-10 h-10 bg-rose-500 hover:bg-rose-600 text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110 z-10'
                                    >
                                        <FontAwesomeIcon icon={faTrashAlt} />
                                    </button>
                                )}
                            </div>
                            <div className='text-center'>
                                <h3 className='text-white font-black text-2xl'>{user?.name}</h3>
                                <div className="flex items-center justify-center gap-2 mt-2">
                                    <FontAwesomeIcon icon={faUserShield} className="text-indigo-400 text-xs" />
                                    <p className='text-indigo-400 font-bold text-[10px] uppercase tracking-[0.2em]'>System Administrator</p>
                                </div>
                            </div>
                        </div>

                        {/* Details Part */}
                        <div className='lg:col-span-8 space-y-8'>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                                <div className='flex flex-col gap-3'>
                                    <label className='text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1'>Full Name</label>
                                    <div className='relative group'>
                                        <input type="text" {...register("name", { required: "Name is required" })} className='premium-input pl-14 h-14' placeholder='Admin Name' />
                                    </div>
                                    {errors.name && <p className='text-rose-400 text-[10px] font-bold ml-1'>{errors.name.message}</p>}
                                </div>

                                <div className='flex flex-col gap-3'>
                                    <label className='text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1'>Phone Number</label>
                                    <div className='relative group'>
                                        <input type="text" {...register("phone", { pattern: { value: /^[0-9]{10}$/, message: "Valid 10 digits required" } })} className='premium-input pl-14 h-14' placeholder='1234567890' />
                                    </div>
                                    {errors.phone && <p className='text-rose-400 text-[10px] font-bold ml-1'>{errors.phone.message}</p>}
                                </div>
                            </div>

                            <div className='flex flex-col gap-3'>
                                <label className='text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1'>Email Address</label>
                                <div className='relative opacity-60'>
                                    <input type="email" readOnly {...register("email")} className='premium-input pl-14 h-14 bg-white/02 cursor-not-allowed' />
                                </div>
                            </div>

                            <div className='flex flex-col sm:flex-row gap-4 pt-4'>
                                <button type='submit' disabled={isLoading} className='btn-premium flex-1 py-4 px-8 rounded-2xl font-black text-sm flex items-center justify-center gap-3 shadow-xl shadow-indigo-600/20 active:scale-[0.98] transition-all disabled:opacity-50'>
                                    {isLoading ? 'Processing...' : 'Save Profile Changes'}
                                    <FontAwesomeIcon icon={faArrowRight} />
                                </button>
                                <button type='button' onClick={() => navigate('/changePassword')} className='flex-1 py-4 px-8 rounded-2xl font-black text-sm text-slate-300 hover:text-white hover:bg-white/05 border border-white/05 transition-all active:scale-[0.98]'>
                                    Reset Password
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </section>

            {/* Delete Image Confirmation Modal */}
            <PopUp openPopUp={showDeleteImageModal} closePopUp={() => setShowDeleteImageModal(false)} id="deleteImageConfirm" className="items-center justify-center" innerClass="w-full max-w-sm glass rounded-[2.5rem] border border-white/10 shadow-3xl p-8">
                <div className='text-center space-y-6'>
                    <div className='w-20 h-20 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500 mx-auto'>
                        <FontAwesomeIcon icon={faCamera} className='text-3xl' />
                    </div>
                    <div>
                        <h3 className='text-xl font-black text-white'>Remove Admin Avatar?</h3>
                        <p className='text-slate-400 text-sm mt-2'>This will revert to the initial-based placeholder. Confirm removal?</p>
                    </div>
                    <div className='flex flex-col gap-3'>
                        <button
                            onClick={handleDeleteImage}
                            className='w-full py-4 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-black text-sm transition-all active:scale-[0.98]'
                        >
                            Yes, Remove Avatar
                        </button>
                        <button
                            onClick={() => setShowDeleteImageModal(false)}
                            className='w-full py-4 rounded-2xl bg-white/05 hover:bg-white/10 text-slate-300 font-bold text-sm transition-all'
                        >
                            Keep Current photo
                        </button>
                    </div>
                </div>
            </PopUp>
        </div>
    )
}

export default AdminProfile
