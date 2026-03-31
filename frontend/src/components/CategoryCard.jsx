import React from 'react'
import { Link } from 'react-router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'


function CategoryCard({ category, image, count }) {
    return (
        <Link to={`/category/${category}`} className='group block'>
            <div className={`relative h-[380px] rounded-3xl overflow-hidden border border-white/08 shadow-2xl transition-all duration-500 group-hover:border-indigo-500/30 group-hover:shadow-indigo-500/10 group-hover:shadow-2xl`}
                style={{ background: 'rgba(10,16,32,0.9)' }}>

                {/* Gradient bg */}
                <div className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                {/* Image */}
                <div className='absolute inset-0 flex items-center justify-center p-10'>
                    <img
                        src={image}
                        alt={category}
                        className='w-full h-full object-contain group-hover:scale-110 transition-transform duration-700 ease-out opacity-70 group-hover:opacity-100 mix-blend-luminosity group-hover:mix-blend-normal'
                    />
                </div>

                {/* Overlay gradient */}
                <div className='absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent' />

                {/* Content */}
                <div className='absolute bottom-0 left-0 right-0 p-7 z-10'>
                    <h3 className='text-2xl font-black text-white mb-1'>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                    </h3>
                    {count && (
                        <p className='text-slate-400 text-sm mb-4'>{count} products</p>
                    )}
                    <div className='flex items-center gap-2 text-indigo-400 font-bold group-hover:gap-4 transition-all duration-300'>
                        <span className='text-sm'>Shop Now</span>
                        <FontAwesomeIcon icon={faArrowRight} className='text-xs' />
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default CategoryCard