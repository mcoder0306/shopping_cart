import React, { useEffect, useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faUser, faEnvelope, faArrowRight, faIdBadge, faCamera,
    faMapMarkerAlt, faPlus, faTrashAlt, faEdit, faHome,
    faBriefcase, faMapPin, faCheckCircle, faPhone, faCompass, faXmark
} from '@fortawesome/free-solid-svg-icons'
import { api } from '../../utils/api'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { setLoggedinUser } from '../../features/AuthSlice'
import PopUp from '../../components/user/Popup'

function Profile() {
    const { register, handleSubmit, formState: { errors }, reset } = useForm()
    const {
        register: registerAddress,
        handleSubmit: handleSubmitAddress,
        reset: resetAddress,
        formState: { errors: addressErrors },
        setValue: setAddressValue
    } = useForm()

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const user = useSelector(state => state.auth.user)
    const [isLoading, setIsLoading] = useState(false)
    const [isAddressLoading, setIsAddressLoading] = useState(false)
    const [selectedFile, setSelectedFile] = useState(null)
    const [previewUrl, setPreviewUrl] = useState(null)
    const [addresses, setAddresses] = useState([])
    const [showAddressModal, setShowAddressModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showDeleteImageModal, setShowDeleteImageModal] = useState(false)
    const [addressToDelete, setAddressToDelete] = useState(null)
    const [editingAddress, setEditingAddress] = useState(null)
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (user) {
            reset({
                name: user.name,
                email: user.email,
                phone: user.phone || ''
            })
            fetchAddresses()
        }
    }, [user, reset])

    const fetchAddresses = async () => {
        try {
            const res = await api.get("/users/getAllAddresses")
            if (res.status === 200) {
                setAddresses(res.data.data)
            }
        } catch (error) {
            console.error("Error fetching addresses:", error)
        }
    }

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
        // If there's just a local preview (not yet saved), clear it without an API call
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
                toast.success('Profile updated successfully! 🎉', {
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

    const addressSubmitHandler = async (data) => {
        setIsAddressLoading(true)
        try {
            let res;
            if (editingAddress) {
                res = await api.put(`/users/updateAddress/${editingAddress._id}`, data)
            } else {
                res = await api.post("/users/addAddress", data)
            }

            if (res.status === 200 || res.status === 201) {
                toast.success(editingAddress ? 'Address updated! 🏠' : 'Address added! 🏠', {
                    theme: 'dark',
                    autoClose: 2000,
                })
                fetchAddresses()
                closeAddressModal()
            }
        } catch (error) {
            const msg = error.response?.data?.message || 'Action failed. Please try again.'
            toast.error(msg, { theme: 'dark' })
        } finally {
            setIsAddressLoading(false)
        }
    }

    const handleDeleteClick = (id) => {
        setAddressToDelete(id)
        setShowDeleteModal(true)
    }

    const confirmDelete = async () => {
        if (!addressToDelete) return
        setIsAddressLoading(true)
        try {
            const res = await api.delete(`/users/deleteAddress/${addressToDelete}`)
            if (res.status === 200) {
                toast.success('Address removed', { theme: 'dark', autoClose: 1500 })
                fetchAddresses()
                setShowDeleteModal(false)
            }
        } catch (error) {
            toast.error("Failed to delete address", { theme: 'dark' })
        } finally {
            setIsAddressLoading(false)
            setAddressToDelete(null)
        }
    }


    const setDefaultAddress = async (id) => {
        try {
            const res = await api.put(`/users/updateAddress/${id}`, { isDefault: true })
            if (res.status === 200) {
                toast.success('Default address updated', { theme: 'dark', autoClose: 1500 })
                fetchAddresses()
            }
        } catch (error) {
            toast.error("Failed to set default address", { theme: 'dark' })
        }
    }

    const openAddressModal = (address = null) => {
        setEditingAddress(address)
        if (address) {
            resetAddress({
                name: address.name,
                phone: address.phone,
                city: address.city,
                state: address.state,
                pincode: address.pincode,
                addressLine: address.addressLine,
                label: address.label
            })
        } else {
            resetAddress({
                name: '', phone: '', city: '', state: '', pincode: '', addressLine: '', label: 'home'
            })
        }
        setShowAddressModal(true)
    }

    const closeAddressModal = () => {
        setShowAddressModal(false)
        setEditingAddress(null)
    }

    return (
        <div className='min-h-screen px-6 py-24 relative overflow-hidden bg-[#0f172a]'>
            {/* Decorative blobs */}
            <div className='absolute top-1/4 left-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[140px] rounded-full -z-10' />
            <div className='absolute bottom-0 right-0 w-[400px] h-[400px] bg-emerald-600/05 blur-[100px] rounded-full -z-10' />

            <div className='max-w-6xl mx-auto space-y-12'>
                {/* Header */}
                <div className='text-center animate-fade-in'>
                    <h1 className='text-4xl md:text-5xl font-black text-white mb-3 tracking-tight'>
                        Account <span className='text-gradient'>Settings</span>
                    </h1>
                    <p className='text-slate-400'>Manage your profile, addresses, and account security</p>
                </div>

                {/* Profile Section */}
                <section className='glass rounded-[2.5rem] p-8 md:p-12 border border-white/05 shadow-2xl'>
                    <form onSubmit={handleSubmit(submitHandler)}>
                        <div className='grid grid-cols-1 lg:grid-cols-12 gap-12'>
                            {/* Avatar Part */}
                            <div className='lg:col-span-4 flex flex-col items-center gap-6'>
                                <div className='relative group'>
                                    <div className='w-40 h-40 rounded-[2rem] bg-indigo-500/10 border-2 border-dashed border-white/10 flex items-center justify-center text-indigo-400 text-6xl shadow-inner overflow-hidden group-hover:border-indigo-500/50 transition-all duration-500'>
                                        {
                                            previewUrl ? (
                                                <img src={previewUrl} alt="preview" className='w-full h-full object-cover' />
                                            ) : user?.image ? (
                                                <img src={`http://localhost:3000/${user.image?.replace('uploads/', '')}`} alt="profile image" className='w-full h-full object-cover' />
                                            ) : (
                                                <span className="text-6xl font-black text-indigo-400 uppercase">{user.name?.charAt(0)}</span>
                                            )
                                        }
                                        <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handleImageChange} />
                                        <div onClick={handleCameraClick} className='absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex rounded-[2rem] flex-col items-center justify-center cursor-pointer transition-all duration-300'>
                                            <FontAwesomeIcon icon={faCamera} className='text-white text-2xl mb-2' />
                                            <span className='text-white text-xs font-bold uppercase tracking-tighter'>Change Photo</span>
                                        </div>
                                    </div>
                                    {/* Delete image button – visible only when an image exists */}
                                    {(previewUrl || user?.image) && (
                                        <button
                                            type="button"
                                            onClick={() => setShowDeleteImageModal(true)}
                                            title="Remove photo"
                                            className='absolute -top-2 -right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110 z-10'
                                        >
                                            <FontAwesomeIcon icon={faTrashAlt} className='text-xs' />
                                        </button>
                                    )}
                                </div>
                                <div className='text-center'>
                                    <h3 className='text-white font-black text-2xl'>{user?.name}</h3>
                                    <p className='text-indigo-400 font-bold text-xs uppercase tracking-[0.2em] mt-1'>{user?.isAdmin ? 'Administrator' : 'Customer'}</p>
                                </div>
                            </div>

                            {/* Details Part */}
                            <div className='lg:col-span-8 space-y-8'>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                    <div className='flex flex-col gap-3'>
                                        <label className='text-xs font-black text-slate-500 uppercase tracking-widest ml-1'>Full Name</label>
                                        <div className='relative'>
                                            <input type="text" {...register("name", { required: "Name is required" })} className='premium-input pl-14' placeholder='Your name' />
                                        </div>
                                        {errors.name && <p className='text-red-400 text-xs font-semibold ml-1'>{errors.name.message}</p>}
                                    </div>
                                    <div className='flex flex-col gap-3'>
                                        <label className='text-xs font-black text-slate-500 uppercase tracking-widest ml-1'>Phone Number</label>
                                        <div className='relative'>
                                            <input type="text" {...register("phone", { pattern: { value: /^[0-9]{10}$/, message: "Valid 10 digits required" } })} className='premium-input pl-14' placeholder='1234567890' />
                                        </div>
                                        {errors.phone && <p className='text-red-400 text-xs font-semibold ml-1'>{errors.phone.message}</p>}
                                    </div>
                                </div>

                                <div className='flex flex-col gap-3 opacity-60'>
                                    <label className='text-xs font-black text-slate-500 uppercase tracking-widest ml-1'>Email Address </label>
                                    <div className='relative'>
                                        <input type="email" readOnly {...register("email")} className='premium-input pl-14 bg-white/02 cursor-not-allowed' />
                                    </div>
                                </div>

                                <div className='flex flex-col sm:flex-row gap-4'>
                                    <button type='submit' disabled={isLoading} className='btn-premium flex-1 py-4 px-8 rounded-2xl font-black text-sm flex items-center justify-center gap-3 shadow-xl shadow-indigo-600/20 active:scale-[0.98] transition-all disabled:opacity-50'>
                                        {isLoading ? 'Updating...' : 'Save Profile Changes'}
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

                {/* Addresses Section */}
                <section className='space-y-8 animate-slide-up'>
                    <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
                        <div className='flex items-center gap-4'>
                            <div className='w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 shadow-lg'>
                                <FontAwesomeIcon icon={faMapMarkerAlt} className='text-xl' />
                            </div>
                            <div>
                                <h2 className='text-2xl font-black text-white leading-none'>Saved Addresses</h2>
                                <p className='text-slate-500 text-sm mt-1'>Manage your delivery locations</p>
                            </div>
                        </div>
                        <button onClick={() => openAddressModal()} className='bg-white/05 hover:bg-white/10 text-white font-black text-xs uppercase tracking-widest py-4 px-8 rounded-2xl border border-white/10 transition-all flex items-center justify-center gap-3 active:scale-[0.98]'>
                            <FontAwesomeIcon icon={faPlus} />
                            Add New Address
                        </button>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {addresses.map((addr) => (
                            <div key={addr._id} className={`group relative glass rounded-[2rem] p-6 border transition-all duration-300 ${addr.isDefault ? 'border-indigo-500/50 bg-indigo-500/05 shadow-indigo-500/10' : 'border-white/05 hover:border-white/10 hover:shadow-2xl'}`}>
                                {addr.isDefault && (
                                    <div className='absolute -top-3 -right-3 bg-indigo-500 text-white text-[10px] font-black uppercase tracking-tighter px-3 py-1.5 rounded-full shadow-lg z-10 animate-bounce-in'>
                                        Default
                                    </div>
                                )}
                                <div className='flex justify-between items-start mb-4'>
                                    <div className='w-10 h-10 rounded-xl bg-white/05 flex items-center justify-center text-slate-400 group-hover:text-indigo-400 transition-colors'>
                                        <FontAwesomeIcon icon={addr.label === 'home' ? faHome : addr.label === 'work' ? faBriefcase : faMapPin} />
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <button onClick={() => openAddressModal(addr)} className='p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-all'>
                                            <FontAwesomeIcon icon={faEdit} className='text-xs' />
                                        </button>
                                        <button onClick={() => handleDeleteClick(addr._id)} className='p-2 hover:bg-red-500/20 rounded-lg text-slate-400 hover:text-red-400 transition-all'>
                                            <FontAwesomeIcon icon={faTrashAlt} className='text-xs' />
                                        </button>
                                    </div>
                                </div>
                                <h4 className='text-white font-black text-lg mb-1'>{addr.name}</h4>
                                <p className='text-slate-400 text-xs font-bold flex items-center gap-2 mb-4'>
                                    <FontAwesomeIcon icon={faPhone} className='text-[10px] text-indigo-500' />
                                    {addr.phone}
                                </p>
                                <p className='text-slate-500 text-sm leading-relaxed mb-6 line-clamp-2'>
                                    {addr.addressLine}, {addr.city}, {addr.state} - {addr.pincode}
                                </p>
                                {!addr.isDefault && (
                                    <button onClick={() => setDefaultAddress(addr._id)} className='w-full py-3 rounded-xl border border-white/05 hover:border-indigo-500/50 hover:bg-indigo-500/10 text-slate-400 hover:text-indigo-400 text-[10px] font-black uppercase tracking-widest transition-all'>
                                        Set as Default
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    {addresses.length === 0 && (
                        <div className='glass rounded-[2.5rem] p-16 border border-dashed border-white/10 flex flex-col items-center text-center'>
                            <div className='w-20 h-20 rounded-full bg-white/05 flex items-center justify-center text-slate-600 mb-6'>
                                <FontAwesomeIcon icon={faMapMarkerAlt} className='text-3xl' />
                            </div>
                            <h3 className='text-xl font-bold text-white mb-2'>No addresses yet</h3>
                            <p className='text-slate-500 max-w-xs'>Add your shipping addresses for a faster checkout experience.</p>
                        </div>
                    )}
                </section>
            </div>

            {/* Address Modal */}
            <PopUp openPopUp={showAddressModal} closePopUp={closeAddressModal} id="addressModal" className="items-center justify-center" innerClass="w-full max-w-lg glass rounded-[2.5rem] border border-white/10 shadow-3xl p-8 overflow-y-auto max-h-[90vh]">
                <div className='space-y-8'>
                    <div className='flex items-center gap-4'>
                        <div className='w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400'>
                            <FontAwesomeIcon icon={editingAddress ? faEdit : faPlus} className='text-xl' />
                        </div>
                        <div>
                            <h2 className='text-2xl font-black text-white leading-none'>{editingAddress ? 'Update' : 'Add New'} Address</h2>
                            <p className='text-slate-500 text-sm mt-1'>Fill in the delivery details below</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmitAddress(addressSubmitHandler)} className='space-y-5'>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                            <div className='flex flex-col gap-2'>
                                <label className='text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1'>Full Name</label>
                                <input type="text" {...registerAddress("name", { required: "Name is required" })} className='premium-input text-sm' placeholder='John Doe' />
                                {addressErrors.name && <p className='text-red-400 text-[10px] font-bold'>{addressErrors.name.message}</p>}
                            </div>
                            <div className='flex flex-col gap-2'>
                                <label className='text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1'>Phone Number</label>
                                <input type="text" {...registerAddress("phone", { required: "Required", pattern: { value: /^[0-9]{10}$/, message: "Valid 10 digits required" } })} className='premium-input text-sm' placeholder='1234567890' />
                                {addressErrors.phone && <p className='text-red-400 text-[10px] font-bold'>{addressErrors.phone.message}</p>}
                            </div>
                        </div>

                        <div className='flex flex-col gap-2'>
                            <label className='text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1'>Address Line</label>
                            <textarea {...registerAddress("addressLine", { required: "Required" })} className='premium-input text-sm min-h-[100px] resize-none' placeholder='House No, Street, Area...' />
                            {addressErrors.addressLine && <p className='text-red-400 text-[10px] font-bold'>{addressErrors.addressLine.message}</p>}
                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
                            <div className='flex flex-col gap-2'>
                                <label className='text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1'>City</label>
                                <input type="text" {...registerAddress("city", { required: "Required" })} className='premium-input text-sm' placeholder='New York' />
                            </div>
                            <div className='flex flex-col gap-2'>
                                <label className='text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1'>State</label>
                                <input type="text" {...registerAddress("state", { required: "Required" })} className='premium-input text-sm' placeholder='NY' />
                            </div>
                            <div className='flex flex-col gap-2'>
                                <label className='text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1'>Pincode</label>
                                <input type="text" {...registerAddress("pincode", { required: "Required", pattern: { value: /^[0-9]{6}$/, message: "6 digits only" } })} className='premium-input text-sm' placeholder='100011' />
                            </div>
                        </div>

                        <div className='flex flex-col gap-4'>
                            <label className='text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1'>Address Label</label>
                            <div className='flex gap-4'>
                                {['home', 'work', 'other'].map((lbl) => (
                                    <label key={lbl} className='flex-1 cursor-pointer group'>
                                        <input type="radio" value={lbl} {...registerAddress("label")} className='hidden peer' />
                                        <div className='py-4 px-2 border border-white/05 rounded-2xl flex flex-col items-center gap-2 transition-all peer-checked:bg-indigo-500/20 peer-checked:border-indigo-500 peer-checked:text-white text-slate-500 bg-white/02'>
                                            <FontAwesomeIcon icon={lbl === 'home' ? faHome : lbl === 'work' ? faBriefcase : faCompass} className='text-lg' />
                                            <span className='text-[9px] font-black uppercase tracking-widest'>{lbl}</span>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className='pt-4'>
                            <button type='submit' disabled={isAddressLoading} className='w-full btn-premium py-4 rounded-2xl font-black text-sm shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-3 active:scale-[0.98] transition-all disabled:opacity-50'>
                                {isAddressLoading ? 'Processing...' : editingAddress ? 'Update Address' : 'Add This Address'}
                                <FontAwesomeIcon icon={editingAddress ? faCheckCircle : faArrowRight} />
                            </button>
                        </div>
                    </form>
                </div>
            </PopUp>

            {/* Delete Confirmation Modal */}
            <PopUp openPopUp={showDeleteModal} closePopUp={() => setShowDeleteModal(false)} id="deleteConfirm" className="items-center justify-center" innerClass="w-full max-w-sm glass rounded-[2.5rem] border border-white/10 shadow-3xl p-8">
                <div className='text-center space-y-6'>
                    <div className='w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mx-auto'>
                        <FontAwesomeIcon icon={faTrashAlt} className='text-3xl' />
                    </div>
                    <div>
                        <h3 className='text-xl font-black text-white'>Delete Address?</h3>
                        <p className='text-slate-400 text-sm mt-2'>This action cannot be undone. Are you sure you want to proceed?</p>
                    </div>
                    <div className='flex flex-col gap-3'>
                        <button
                            onClick={confirmDelete}
                            disabled={isAddressLoading}
                            className='w-full py-4 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-black text-sm transition-all active:scale-[0.98] disabled:opacity-50'
                        >
                            {isAddressLoading ? 'Deleting...' : 'Yes, Delete Address'}
                        </button>
                        <button
                            onClick={() => setShowDeleteModal(false)}
                            className='w-full py-4 rounded-2xl bg-white/05 hover:bg-white/10 text-slate-300 font-bold text-sm transition-all'
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </PopUp>

            {/* Delete Image Confirmation Modal */}
            <PopUp openPopUp={showDeleteImageModal} closePopUp={() => setShowDeleteImageModal(false)} id="deleteImageConfirm" className="items-center justify-center" innerClass="w-full max-w-sm glass rounded-[2.5rem] border border-white/10 shadow-3xl p-8">
                <div className='text-center space-y-6'>
                    <div className='w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mx-auto'>
                        <FontAwesomeIcon icon={faCamera} className='text-3xl' />
                    </div>
                    <div>
                        <h3 className='text-xl font-black text-white'>Remove Profile Photo?</h3>
                        <p className='text-slate-400 text-sm mt-2'>This will permanently delete your profile picture. Are you sure?</p>
                    </div>
                    <div className='flex flex-col gap-3'>
                        <button
                            onClick={handleDeleteImage}
                            className='w-full py-4 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-black text-sm transition-all active:scale-[0.98]'
                        >
                            Yes, Remove Photo
                        </button>
                        <button
                            onClick={() => setShowDeleteImageModal(false)}
                            className='w-full py-4 rounded-2xl bg-white/05 hover:bg-white/10 text-slate-300 font-bold text-sm transition-all'
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </PopUp>

        </div>
    )
}

export default Profile