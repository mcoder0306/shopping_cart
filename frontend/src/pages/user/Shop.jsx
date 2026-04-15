import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addProducts } from '../../features/ProductSlice';
import Card from '../../components/user/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStore } from '@fortawesome/free-solid-svg-icons';
import { api } from '../../utils/api';

function Shop() {
  const products = useSelector(state => state.product.products)
  const dispatch = useDispatch();
  const categories = [...new Set(products?.map(product => product?.category?.title))]
  const urlParams = new URLSearchParams(location.search)
  const query = urlParams.get("search")

  useEffect(() => {
    const loadProducts = async () => {
      try {
        let result
        if (query) {
          result = await api.get(`/products/getProducts?query=${query}`)
        }
        else {
          result = await api.get("/products/getProducts")
        }
        if (result.status === 200) {
          dispatch(addProducts(result.data.data));
        }
      } catch (error) {
        console.log("error in loadproducts!!", error)
      }

    }
    loadProducts()
  }, [dispatch, query]);

  return (
    <div className='max-w-7xl mx-auto px-6 pt-36 pb-24'>
      <div className='flex flex-col gap-20'>

        {/* Header */}
        <div className='animate-fade-in'>
          <span className='badge badge-indigo mb-4 inline-flex gap-2'>
            <FontAwesomeIcon icon={faStore} />
            Full Collection
          </span>
          {/* <h1 className='text-5xl md:text-7xl font-black tracking-tight mb-5 text-white'>
            All Products
          </h1> */}
          <p className='text-slate-400 max-w-2xl text-lg'>
            Browse our entire range of premium items — from high-end electronics to designer fashion.
          </p>
          <div className='section-divider mt-10' />
        </div>

        {categories.map(category => (
          <div key={category} className='flex flex-col gap-8'>
            {/* Category Header */}
            <div className='flex items-center gap-5'>
              <div>
                <p className='text-xs text-indigo-400 font-black uppercase tracking-widest mb-1'>Category</p>
                <h2 className='text-3xl font-black text-white'>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </h2>
              </div>
              <div className='h-px bg-gradient-to-r from-indigo-500/30 to-transparent flex-1 ml-4 mt-auto mb-2' />
              <span className='badge badge-indigo flex-shrink-0 text-xs'>
                {products.filter(p => p.category.title === category).length} items
              </span>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'>
              {products.filter(product => product.category.title === category)
                .map((product) => (
                  <Card key={product._id} product={product} />
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Shop