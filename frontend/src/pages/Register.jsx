import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faEnvelope, faLock, faShieldHalved, faArrowRight, faShoppingBag, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { api } from '../utils/api'
import { toast } from 'react-toastify'
import {useDispatch} from "react-redux"
import { setLoggedinUser } from '../features/AuthSlice'

function Register() {
  const { register, handleSubmit, formState: { errors }, watch } = useForm()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const dispatch =useDispatch()

  const password = watch("password")
  const navigate=useNavigate()

  const submitHandler = async (data) => {
    try {
      const res = await api.post("/auth/register", data)
      if (res.status === 201) {
        toast.success(res.data.message || 'Account created successfully! 🎉', {
          theme: 'dark',
          autoClose: 2500,
        })
        dispatch(setLoggedinUser(res.data.data))
        navigate('/')
      } else {
        toast.warning(res.data.message || 'Something went wrong', {
          theme: 'dark',
        })
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed. Please try again.'
      toast.error(msg, {
        theme: 'dark',
        autoClose: 3000,
      })
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center px-6 py-16 relative overflow-hidden'>

      {/* Decorative blobs */}
      <div className='absolute top-1/3 right-0 w-[500px] h-[500px] bg-indigo-600/15 blur-[140px] rounded-full -z-10' />
      <div className='absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-600/08 blur-[100px] rounded-full -z-10' />
      <div className='absolute top-10 left-1/4 w-[200px] h-[200px] bg-violet-600/12 blur-[80px] rounded-full -z-10' />

      <div className='w-full max-w-md animate-fade-in'>

        {/* Logo / Brand */}
        <div className='text-center mb-10'>
          <Link to='/' className='inline-flex items-center gap-3 group mb-6'>
            <div className='w-12 h-12 rounded-2xl bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center group-hover:scale-110 transition-transform'>
              <FontAwesomeIcon icon={faShoppingBag} className='text-indigo-400 text-lg' />
            </div>
            <span className='text-2xl font-black text-white'>ShoppyMart</span>
          </Link>
          <h1 className='text-4xl md:text-5xl font-black text-white mb-3'>Create Account</h1>
          <p className='text-slate-400'>Join us and start your premium shopping journey</p>
        </div>

        {/* Form Card */}
        <div className='glass rounded-3xl p-8 md:p-10 border border-white/05 animate-slide-up'>
          <form onSubmit={handleSubmit(submitHandler)} className='flex flex-col gap-5'>

            {/* Name Field */}
            <div className='flex flex-col gap-2'>
              <label htmlFor="register-name" className='text-xs font-black text-slate-400 uppercase tracking-widest'>
                Full Name
              </label>
              <div className='relative'>
                <div className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-500'>
                  <FontAwesomeIcon icon={faUser} className='text-sm' />
                </div>
                <input
                  type="text"
                  id="register-name"
                  placeholder='Enter your full name'
                  className='premium-input'
                  style={{ paddingLeft: '2.75rem' }}
                  {...register("name", { required: "Name is required" })}
                />
              </div>
              {errors.name && <p className='text-red-400 text-xs font-semibold'>{errors.name.message}</p>}
            </div>

            {/* Email Field */}
            <div className='flex flex-col gap-2'>
              <label htmlFor="register-email" className='text-xs font-black text-slate-400 uppercase tracking-widest'>
                Email Address
              </label>
              <div className='relative'>
                <div className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-500'>
                  <FontAwesomeIcon icon={faEnvelope} className='text-sm' />
                </div>
                <input
                  type="email"
                  id="register-email"
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
              <label htmlFor="register-password" className='text-xs font-black text-slate-400 uppercase tracking-widest'>
                Password
              </label>
              <div className='relative'>
                <div className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-500'>
                  <FontAwesomeIcon icon={faLock} className='text-sm' />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="register-password"
                  placeholder='Create a password'
                  className='premium-input'
                  style={{ paddingLeft: '2.75rem', paddingRight: '2.75rem' }}
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 6, message: "Password must be at least 6 characters" }
                  })}
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

            {/* Confirm Password Field */}
            <div className='flex flex-col gap-2'>
              <label htmlFor="register-confirm-password" className='text-xs font-black text-slate-400 uppercase tracking-widest'>
                Confirm Password
              </label>
              <div className='relative'>
                <div className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-500'>
                  <FontAwesomeIcon icon={faShieldHalved} className='text-sm' />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="register-confirm-password"
                  placeholder='Confirm your password'
                  className='premium-input'
                  style={{ paddingLeft: '2.75rem', paddingRight: '2.75rem' }}
                  {...register("confirm_password", {
                    required: "Please confirm your password",
                    validate: value => value === password || "Passwords do not match"
                  })}
                />
                <button
                  type='button'
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className='absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors'
                >
                  <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} className='text-sm' />
                </button>
              </div>
              {errors.confirm_password && <p className='text-red-400 text-xs font-semibold'>{errors.confirm_password.message}</p>}
            </div>

            {/* Submit Button */}
            <button
              type='submit'
              className='btn-premium w-full py-4 rounded-2xl font-extrabold text-base flex items-center justify-center gap-3 group shadow-xl shadow-indigo-600/20 mt-2'
            >
              Create Account
              <FontAwesomeIcon icon={faArrowRight} className='group-hover:translate-x-1.5 transition-transform' />
            </button>
          </form>

          {/* Divider */}
          <div className='flex items-center gap-4 my-8'>
            <div className='h-px flex-1 bg-gradient-to-r from-transparent to-white/08' />
            <span className='text-xs text-slate-600 font-bold uppercase tracking-widest'>or</span>
            <div className='h-px flex-1 bg-gradient-to-l from-transparent to-white/08' />
          </div>

          {/* Login Link */}
          <p className='text-center text-slate-400 text-sm'>
            Already have an account?{' '}
            <Link to='/login' className='text-indigo-400 font-bold hover:text-indigo-300 transition-colors'>
              Sign In
            </Link>
          </p>
        </div>

        {/* Bottom text */}
        <p className='text-center text-slate-600 text-xs mt-6'>
          By signing up, you agree to our Terms of Service & Privacy Policy
        </p>
      </div>
    </div>
  )
}

export default Register