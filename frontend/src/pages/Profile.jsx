import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faEnvelope, faArrowRight, faIdBadge, faCamera } from '@fortawesome/free-solid-svg-icons'
import { api } from '../utils/api'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { setLoggedinUser } from '../features/AuthSlice'

function Profile() {
    const { register, handleSubmit, formState: { errors }, reset } = useForm()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const user = useSelector(state => state.auth.user)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (user) {
            reset({
                name: user.name,
                email: user.email
            })
        }
    }, [user, reset])

    const submitHandler = async (data) => {
        setIsLoading(true)
        try {
            const res = await api.patch("/users/updateDetails", { name: data.name })
            if (res.status === 200) {
                toast.success('Profile updated successfully! 🎉', {
                    theme: 'dark',
                    autoClose: 2500,
                })
                dispatch(setLoggedinUser({ ...user, name: data.name }))
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
        <div className='min-h-screen flex items-center justify-center px-6 py-24 relative overflow-hidden'>
            {/* Decorative blobs */}
            <div className='absolute top-1/4 left-0 w-[500px] h-[500px] bg-indigo-600/15 blur-[140px] rounded-full -z-10' />
            <div className='absolute bottom-0 right-0 w-[400px] h-[400px] bg-emerald-600/08 blur-[100px] rounded-full -z-10' />
            <div className='absolute top-10 right-1/4 w-[200px] h-[200px] bg-violet-600/12 blur-[80px] rounded-full -z-10' />

            <div className='w-full max-w-2xl animate-fade-in'>
                <div className='text-center mb-10'>
                    <h1 className='text-4xl md:text-5xl font-black text-white mb-3 tracking-tight'>
                        Account <span className='text-gradient'>Settings</span>
                    </h1>
                    <p className='text-slate-400'>Manage your profile information and account security</p>
                </div>

                <div className='grid grid-cols-1 lg:grid-cols-12 gap-8'>
                    {/* Left Side - Avatar/Info (Optional visual) */}
                    <div className='lg:col-span-4 flex flex-col items-center gap-6'>
                        <div className='relative group'>
                            <div className='w-32 h-32 rounded-3xl bg-indigo-500/10 border border-white/05 flex items-center justify-center text-indigo-400 text-5xl shadow-2xl overflow-hidden group-hover:border-indigo-500/50 transition-all duration-500'>
                                <FontAwesomeIcon icon={faUser} />
                                <div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity'>
                                    <FontAwesomeIcon icon={faCamera} className='text-white text-xl' />
                                </div>
                            </div>
                        </div>
                        <div className='text-center'>
                            <h3 className='text-white font-bold text-lg'>{user?.name}</h3>
                            <p className='text-slate-500 text-sm'>{user?.isAdmin ? 'Administrator' : 'Premium Customer'}</p>
                        </div>
                    </div>

                    {/* Right Side - Form */}
                    <div className='lg:col-span-8'>
                        <div className='glass rounded-3xl p-8 border border-white/05'>
                            <form onSubmit={handleSubmit(submitHandler)} className='flex flex-col gap-6'>

                                {/* Name Field */}
                                <div className='flex flex-col gap-2'>
                                    <label htmlFor="name" className='text-xs font-black text-slate-400 uppercase tracking-widest'>
                                        Full Name
                                    </label>
                                    <div className='relative'>
                                        <div className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-500'>
                                            <FontAwesomeIcon icon={faIdBadge} className='text-sm' />
                                        </div>
                                        <input
                                            type="text"
                                            id="name"
                                            placeholder='Enter your name'
                                            className='premium-input'
                                            style={{ paddingLeft: '2.75rem' }}
                                            {...register("name", { required: "Name is required" })}
                                        />
                                    </div>
                                    {errors.name && <p className='text-red-400 text-xs font-semibold'>{errors.name.message}</p>}
                                </div>

                                {/* Email Field (Read Only example) */}
                                <div className='flex flex-col gap-2 opacity-60'>
                                    <label htmlFor="email" className='text-xs font-black text-slate-400 uppercase tracking-widest'>
                                        Email Address
                                    </label>
                                    <div className='relative'>
                                        <div className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-500'>
                                            <FontAwesomeIcon icon={faEnvelope} className='text-sm' />
                                        </div>
                                        <input
                                            type="email"
                                            id="email"
                                            readOnly
                                            className='premium-input bg-white/02'
                                            style={{ paddingLeft: '2.75rem' }}
                                            {...register("email")}
                                        />
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className='flex flex-col sm:flex-row gap-4 pt-2'>
                                    <button
                                        type='submit'
                                        disabled={isLoading}
                                        className='btn-premium flex-1 py-4 rounded-2xl font-extrabold text-base flex items-center justify-center gap-3 shadow-xl shadow-indigo-600/20 disabled:opacity-50'
                                    >
                                        {isLoading ? 'Saving...' : 'Save Changes'}
                                        <FontAwesomeIcon icon={faArrowRight} />
                                    </button>

                                    <button
                                        type='button'
                                        onClick={() => navigate('/changePassword')}
                                        className='flex-1 py-4 rounded-2xl font-bold text-slate-300 hover:text-white hover:bg-white/05 border border-white/05 transition-all'
                                    >
                                        Change Password
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile