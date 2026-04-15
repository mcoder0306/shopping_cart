import React from 'react'

function Footer() {
  return (
    <footer className='bg-slate-950/80 pb-10 px-6'>
      <div className='max-w-7xl mx-auto'>

        {/* Bottom */}
        <div className='section-divider mb-8' />
        <div className='flex flex-col md:flex-row justify-center items-center gap-4'>
          <p className='text-slate-500 text-sm'>© 2026 ShoppyMart. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer