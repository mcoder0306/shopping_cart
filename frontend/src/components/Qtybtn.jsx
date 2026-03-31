import React from 'react'

function Qtybtn({ children, onclick }) {
  return (
    <button
      className='w-8 h-8 rounded-full glass border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all active:scale-95 text-xs font-bold'
      onClick={onclick}
    >
      {children}
    </button>
  )
}

export default Qtybtn