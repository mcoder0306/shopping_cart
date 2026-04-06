import React, { useEffect, useState } from 'react'
import Card from '../components/Card';
import { useDispatch, useSelector } from 'react-redux'
import { addProducts } from '../features/ProductSlice';
import CategoryCard from '../components/CategoryCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faTruck, faShieldHalved, faHeadset, faTag } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router';
import { api } from '../utils/api';
import { toast } from 'react-toastify';

function Home() {
  const products = useSelector(state => state.product.products)
  const isLoggedin = useSelector(state => state.auth.isLoggedin)
  const dispatch = useDispatch();
  const [favourites, setFavourites] = useState([])

  const categories = [...new Set(products?.map(product => product.category?.title).filter(Boolean))]
  const featuredProducts = products?.slice(0, 4);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const result = await api.get("/products/getProducts")
        if (result.status === 200) {
          dispatch(addProducts(result.data.data));
        }
      } catch (error) {
        const msg = error.response?.data?.message || "error in loadproducts!!"
        toast.error(msg, {
          theme: 'dark',
          autoClose: 3000,
        })
      }

    }
    loadProducts()
  }, []);

  useEffect(() => {
    const fetchFavourites = async () => {
      try {
        const res = await api.get("/favourites/getFavourites")
        if (res.status === 200) {
          const favouriteProducts = res.data.data.map(fav => fav.product._id)
          setFavourites(favouriteProducts)
        }
      } catch (error) {
        const msg = error.response?.data?.message || 'something went wrong. Please try again.'
        toast.error(msg, {
          theme: 'dark',
          autoClose: 3000,
        })
      }
    }
    if (isLoggedin) {
      fetchFavourites()
    }
  }, [isLoggedin])


  const trustItems = [
    { icon: faTruck, title: 'Free Shipping', desc: 'On all orders over $50' },
    { icon: faShieldHalved, title: 'Secure Payments', desc: 'Encrypted & safe checkout' },
    { icon: faHeadset, title: '24/7 Support', desc: 'Always here to help' },
    { icon: faTag, title: 'Best Prices', desc: 'Guaranteed price match' },
  ]

  return (
    <div className='flex flex-col gap-20 pb-24'>

      {/* ── Hero ── */}
      <section className='relative pt-36 pb-28 px-6 overflow-hidden'>
        <div className='max-w-7xl mx-auto relative z-10'>
          <div className='max-w-3xl animate-fade-in'>
            <span className='badge badge-indigo mb-6 inline-flex gap-2'>
              ✦ New Season, New Arrivals
            </span>
            <h1 className='text-6xl md:text-8xl font-black tracking-tight mb-8 leading-[1.05]'>
              <span className='hero-gradient-text'>Elevate</span>{' '}
              <span className='text-white'>Your Style</span>
              <br />
              <span className='text-slate-400 text-5xl md:text-6xl font-bold'>With Every Click.</span>
            </h1>
            <p className='text-xl text-slate-400 mb-12 max-w-lg leading-relaxed'>
              Discover a curated collection of premium products crafted to
              elevate your everyday lifestyle.
            </p>
            <div className='flex flex-wrap gap-4'>
              <Link
                to='/shop'
                className='btn-premium px-9 py-4 rounded-2xl font-bold text-lg flex items-center gap-3 group shadow-2xl shadow-indigo-600/30'
              >
                Shop Now
                <FontAwesomeIcon icon={faArrowRight} className='group-hover:translate-x-1.5 transition-transform' />
              </Link>
              <Link
                to='/category/electronics'
                className='btn-ghost px-9 py-4 rounded-2xl font-bold text-lg'
              >
                View Collections
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative blobs */}
        <div className='absolute top-1/2 right-0 -translate-y-1/2 w-[700px] h-[700px] bg-indigo-600/15 blur-[140px] rounded-full -z-10 animate-pulse' />
        <div className='absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-emerald-600/08 blur-[100px] rounded-full -z-10' />
        <div className='absolute top-20 right-1/3 w-[200px] h-[200px] bg-violet-600/12 blur-[80px] rounded-full -z-10' />

        {/* Floating stat cards */}
        <div className='hidden lg:flex absolute right-8 top-1/2 -translate-y-1/2 flex-col gap-4 animate-float'>
          <div className='glass rounded-2xl p-5 border border-white/08 min-w-[160px]'>
            <p className='text-3xl font-black text-gradient'>10K+</p>
            <p className='text-sm text-slate-400 mt-1'>Happy Customers</p>
          </div>
          <div className='glass rounded-2xl p-5 border border-white/08 min-w-[160px]'>
            <p className='text-3xl font-black text-white'>4.9 ⭐</p>
            <p className='text-sm text-slate-400 mt-1'>Average Rating</p>
          </div>
          <div className='glass rounded-2xl p-5 border border-white/08 min-w-[160px]'>
            <p className='text-3xl font-black text-emerald-400'>Free</p>
            <p className='text-sm text-slate-400 mt-1'>Fast Shipping</p>
          </div>
        </div>
      </section>

      {/* ── Trust Strip ── */}
      <section className='trust-strip py-8 px-6'>
        <div className='max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8'>
          {trustItems.map((item, i) => (
            <div key={i} className='flex items-center gap-4'>
              <div className='w-11 h-11 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 flex-shrink-0'>
                <FontAwesomeIcon icon={item.icon} />
              </div>
              <div>
                <p className='font-bold text-sm text-slate-100'>{item.title}</p>
                <p className='text-xs text-slate-500'>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Categories ── */}
      <section className='px-6'>
        <div className='max-w-7xl mx-auto'>
          <div className='flex items-end justify-between mb-12'>
            <div>
              <span className='badge badge-indigo mb-3 inline-flex'>Categories</span>
              <h2 className='text-4xl md:text-5xl font-black text-white'>Shop by Category</h2>
              <p className='text-slate-400 mt-2'>Find exactly what you're looking for</p>
            </div>
            <Link to='/shop' className='hidden md:flex items-center gap-2 text-indigo-400 font-bold hover:text-indigo-300 transition-colors group'>
              View All <FontAwesomeIcon icon={faArrowRight} className='text-xs group-hover:translate-x-1 transition-transform' />
            </Link>
          </div>

          <div className='grid lg:grid-cols-4 md:grid-cols-2 gap-6'>
            {categories.map((category) => {
              const categoryproducts = products.filter(product => product.category?.title === category);
              const rawImage = categoryproducts[1]?.image || categoryproducts[0]?.image;
              const displayImage = rawImage ? `http://localhost:3000/${rawImage.replace('uploads/', '')}` : '';
              return (
                <CategoryCard key={category} category={category} image={displayImage} count={categoryproducts.length} />
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Featured Products ── */}
      {featuredProducts?.length > 0 && (
        <section className='px-6'>
          <div className='max-w-7xl mx-auto'>
            <div className='flex items-end justify-between mb-12'>
              <div>
                <span className='badge badge-amber mb-3 inline-flex'>✦ Trending</span>
                <h2 className='text-4xl md:text-5xl font-black text-white'>Featured Products</h2>
                <p className='text-slate-400 mt-2'>Handpicked for you this season</p>
              </div>
              <Link to='/shop' className='hidden md:flex items-center gap-2 text-indigo-400 font-bold hover:text-indigo-300 transition-colors group'>
                See all <FontAwesomeIcon icon={faArrowRight} className='text-xs group-hover:translate-x-1 transition-transform' />
              </Link>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
              {featuredProducts.map((product) => (
                <Card key={product._id} product={product} favourites={favourites} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Banner CTA ── */}
      <section className='px-6'>
        <div className='max-w-7xl mx-auto'>
          <div className='relative rounded-3xl overflow-hidden p-12 md:p-16 text-center' style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(16,185,129,0.1) 100%)', border: '1px solid rgba(99,102,241,0.2)' }}>
            <div className='absolute inset-0 bg-gradient-to-br from-indigo-600/10 to-emerald-600/05' />
            <div className='relative z-10'>
              <h2 className='text-4xl md:text-5xl font-black text-white mb-4'>Start Shopping Today</h2>
              <p className='text-slate-400 mb-8 max-w-md mx-auto'>Join thousands of satisfied customers who trust ShoppyMart for their premium shopping needs.</p>
              <Link to='/shop' className='btn-premium px-10 py-4 rounded-2xl font-bold text-lg inline-flex items-center gap-3 group shadow-2xl shadow-indigo-600/30'>
                Explore All Products
                <FontAwesomeIcon icon={faArrowRight} className='group-hover:translate-x-1 transition-transform' />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}

export default Home