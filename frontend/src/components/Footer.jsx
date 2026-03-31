import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTwitter, faInstagram, faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons'
import { faBagShopping, faEnvelope, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router'

const socials = [
  { icon: faTwitter, href: '#', label: 'Twitter' },
  { icon: faInstagram, href: '#', label: 'Instagram' },
  { icon: faGithub, href: '#', label: 'GitHub' },
  { icon: faLinkedin, href: '#', label: 'LinkedIn' },
]

function Footer() {
  return (
    <footer className='bg-slate-950/80 pb-10 px-6'>
      <div className='max-w-7xl mx-auto'>

        {/* <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16'> */}

          {/* Brand */}
          {/* <div className='lg:col-span-2'>
            <Link to='/' className='flex items-center gap-3 mb-5 group w-fit'>
              <div className='w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform'
                style={{ background: 'linear-gradient(135deg, #6366f1, #818cf8)' }}>
                <FontAwesomeIcon icon={faBagShopping} className='text-white text-base' />
              </div>
              <span className='font-black text-2xl'>
                <span className='text-gradient'>Shoppy</span>
                <span className='text-white'>Mart</span>
              </span>
            </Link>
            <p className='text-slate-400 max-w-xs leading-relaxed text-sm mb-8'>
              We provide the finest selection of premium products for the modern individual. Quality and style in every delivery.
            </p> */}

            {/* Newsletter */}
            {/* <div>
              <p className='text-sm font-bold text-slate-200 mb-3'>Stay in the loop</p>
              <div className='flex gap-2'>
                <div className='flex-1 relative'>
                  <FontAwesomeIcon icon={faEnvelope} className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm' />
                  <input
                    type='email'
                    placeholder='your@email.com'
                    className='premium-input pl-9 text-sm'
                  />
                </div>
                <button className='btn-premium px-4 py-3 rounded-xl text-sm font-bold flex-shrink-0'>
                  <FontAwesomeIcon icon={faArrowRight} />
                </button>
              </div>
            </div>
          </div> */}

          {/* Link columns */}
          {/* {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className='text-white font-black mb-6 text-sm uppercase tracking-widest'>{title}</h4>
              <ul className='flex flex-col gap-3'>
                {links.map(link => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className='text-slate-400 hover:text-indigo-400 transition-colors text-sm flex items-center gap-2 group'
                    >
                      <span className='w-0 group-hover:w-3 overflow-hidden transition-all duration-300 text-indigo-500'>›</span>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))} */}
        {/* </div> */}

        {/* Bottom */}
        <div className='section-divider mb-8' />
        <div className='flex flex-col md:flex-row justify-between items-center gap-4'>

          <div className='flex items-center gap-3'>
            {socials.map(({ icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className='w-9 h-9 rounded-full glass border border-white/05 flex items-center justify-center text-slate-500 hover:text-indigo-400 hover:border-indigo-500/30 transition-all'
              >
                <FontAwesomeIcon icon={icon} className='text-sm' />
              </a>
            ))}
          </div>
          <p className='text-slate-500 text-sm'>© 2026 ShoppyMart. All rights reserved.</p>


          <div className='flex gap-6 text-slate-500 text-sm'>
            <span className='hover:text-slate-300 transition-colors cursor-pointer'>Terms</span>
            <span className='hover:text-slate-300 transition-colors cursor-pointer'>Cookies</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer