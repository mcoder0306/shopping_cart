import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faLock, faArrowRight, faShoppingBag, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { api } from '../utils/api'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { setLoggedinUser } from '../features/AuthSlice'
import { clearCart } from '../features/CartSlice'

function Login() {
    const { register, handleSubmit, formState: { errors } } = useForm()
    const [showPassword, setShowPassword] = useState(false)
    const navigate=useNavigate()
    const dispatch=useDispatch()
    const location=useLocation()

    const submitHandler = async (data) => {
        try {
            const res = await api.post("/auth/login", data)
            if (res.status === 200) {
                toast.success(res.data.data.message || 'Loggedin successfully! 🎉', {
                    theme: 'dark',
                    autoClose: 2500,
                })
                dispatch(setLoggedinUser(res.data.data))
                const guestCart=JSON.parse(localStorage.getItem("cart"))
                if(guestCart){
                    const res=await api.post("/carts/mergeCart",{
                        items:guestCart
                    })
                    if(res.status===200 || res.status===201){
                        dispatch(clearCart())
                    }
                }
                const from=location.state?.from || "/";
                navigate(from)
            } else {
                toast.warning(res.data.data.message || 'Something went wrong', {
                    theme: 'dark',
                })
            }
        } catch (error) {
            console.log(error)
            const msg = error.response?.data?.message || 'login failed. Please try again.'
            toast.error(msg, {
                theme: 'dark',
                autoClose: 3000,
            })
        }
    }
    return (
        <div className='min-h-screen flex items-center justify-center px-6 py-16 relative overflow-hidden'>

            {/* Decorative blobs */}
            <div className='absolute top-1/4 left-0 w-[500px] h-[500px] bg-indigo-600/15 blur-[140px] rounded-full -z-10' />
            <div className='absolute bottom-0 right-0 w-[400px] h-[400px] bg-emerald-600/08 blur-[100px] rounded-full -z-10' />
            <div className='absolute top-10 right-1/4 w-[200px] h-[200px] bg-violet-600/12 blur-[80px] rounded-full -z-10' />

            <div className='w-full max-w-md animate-fade-in'>

                {/* Logo / Brand */}
                <div className='text-center mb-10'>
                    <Link to='/' className='inline-flex items-center gap-3 group mb-6'>
                        <div className='w-12 h-12 rounded-2xl bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center group-hover:scale-110 transition-transform'>
                            <FontAwesomeIcon icon={faShoppingBag} className='text-indigo-400 text-lg' />
                        </div>
                        <span className='text-2xl font-black text-white'>ShoppyMart</span>
                    </Link>
                    <h1 className='text-4xl md:text-5xl font-black text-white mb-3'>Welcome Back</h1>
                    <p className='text-slate-400'>Sign in to continue your premium shopping experience</p>
                </div>

                {/* Form Card */}
                <div className='glass rounded-3xl p-8 md:p-10 border border-white/05 animate-slide-up'>
                    <form onSubmit={handleSubmit(submitHandler)} className='flex flex-col gap-6'>

                        {/* Email Field */}
                        <div className='flex flex-col gap-2'>
                            <label htmlFor="email" className='text-xs font-black text-slate-400 uppercase tracking-widest'>
                                Email Address
                            </label>
                            <div className='relative'>
                                <div className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-500'>
                                    <FontAwesomeIcon icon={faEnvelope} className='text-sm' />
                                </div>
                                <input
                                    type="email"
                                    id="login-email"
                                    placeholder='Enter your email'
                                    className='premium-input'
                                    style={{ paddingLeft: '2.75rem' }}
                                    {...register("email", { required: "Email is required" })}
                                />
                            </div>
                            {errors.email && <p className='text-red-400 text-xs font-semibold'>{errors.email.message}</p>}
                        </div>

                        {/* Password Field */}
                        <div className='flex flex-col gap-2'>
                            <label htmlFor="password" className='text-xs font-black text-slate-400 uppercase tracking-widest'>
                                Password
                            </label>
                            <div className='relative'>
                                <div className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-500'>
                                    <FontAwesomeIcon icon={faLock} className='text-sm' />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="login-password"
                                    placeholder='Enter your password'
                                    className='premium-input'
                                    style={{ paddingLeft: '2.75rem', paddingRight: '2.75rem' }}
                                    {...register("password", { required: "Password is required" })}
                                />
                                <button
                                    type='button'
                                    onClick={() => setShowPassword(!showPassword)}
                                    className='absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors'
                                >
                                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className='text-sm' />
                                </button>
                            </div>
                            {errors.password && <p className='text-red-400 text-xs font-semibold'>{errors.password.message}</p>}
                        </div>

                        {/* Submit Button */}
                        <button
                            type='submit'
                            className='btn-premium w-full py-4 rounded-2xl font-extrabold text-base flex items-center justify-center gap-3 group shadow-xl shadow-indigo-600/20 mt-2'
                        >
                            Sign In
                            <FontAwesomeIcon icon={faArrowRight} className='group-hover:translate-x-1.5 transition-transform' />
                        </button>
                    </form>

                    {/* Divider */}
                    <div className='flex items-center gap-4 my-8'>
                        <div className='h-px flex-1 bg-gradient-to-r from-transparent to-white/08' />
                        <span className='text-xs text-slate-600 font-bold uppercase tracking-widest'>or</span>
                        <div className='h-px flex-1 bg-gradient-to-l from-transparent to-white/08' />
                    </div>

                    {/* Register Link */}
                    <p className='text-center text-slate-400 text-sm'>
                        Don't have an account?{' '}
                        <Link to='/register' className='text-indigo-400 font-bold hover:text-indigo-300 transition-colors'>
                            Create Account
                        </Link>
                    </p>
                     <p className='text-center text-slate-400 text-sm'>
                        Forgot Password?{' '}
                        <Link to='/changePassword' className='text-indigo-400 font-bold hover:text-indigo-300 transition-colors'>
                            Change Password
                        </Link>
                    </p>
                </div>

                {/* Bottom text */}
                <p className='text-center text-slate-600 text-xs mt-6'>
                    Secure login · Your data is encrypted & protected
                </p>
            </div>
        </div>
    )
}

export default Login