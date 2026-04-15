import React from 'react'
import { Link } from 'react-router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRotateLeft, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'

function NotFound() {
  return (
    <div className='max-w-7xl mx-auto px-6 pt-44 pb-24 text-center flex flex-col items-center gap-10'>
      {/* Icon */}
      <div className='relative'>
        <div className='w-28 h-28 rounded-3xl glass border border-white/08 flex items-center justify-center text-indigo-400 shadow-2xl animate-float'>
          <FontAwesomeIcon icon={faTriangleExclamation} className='text-4xl' />
        </div>
        <div className='absolute inset-0 bg-indigo-500/20 rounded-3xl blur-xl -z-10 animate-pulse' />
      </div>

      <div className='flex flex-col gap-4 animate-slide-up'>
        <h1 className='text-8xl md:text-[10rem] font-black leading-none'>
          <span className='text-gradient-gold'>4</span>
          <span className='text-indigo-500'>0</span>
          <span className='text-gradient-gold'>4</span>
        </h1>
        <h2 className='text-3xl font-black text-white'>Lost in Space?</h2>
        <p className='text-slate-400 max-w-sm mx-auto text-lg'>
          The page you're looking for doesn't exist or has been moved to a different dimension.
        </p>
      </div>

      <div className='flex gap-4 flex-wrap justify-center'>
        <Link to="/" className='btn-premium px-10 py-4 rounded-2xl font-bold flex items-center gap-3 shadow-2xl shadow-indigo-600/30'>
          <FontAwesomeIcon icon={faRotateLeft} className='text-sm' />
          Back to Home
        </Link>
        <Link to="/shop" className='btn-ghost px-10 py-4 rounded-2xl font-bold'>
          Browse Shop
        </Link>
      </div>
    </div>
  )
}

export default NotFound