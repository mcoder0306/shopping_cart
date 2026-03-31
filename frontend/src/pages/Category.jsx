import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router';
import { addProducts } from '../features/ProductSlice';
import Card from '../components/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faFaceFrown } from '@fortawesome/free-solid-svg-icons';
import { api } from '../utils/api';

function Category() {
    const products = useSelector(state => state.product.products)
    const dispatch = useDispatch();
    const { category } = useParams()

    useEffect(() => {
        const loadProducts = async () => {
            try {
            const result = await api.get("/products/getProducts")
                if (result.status === 200) {
                    dispatch(addProducts(result.data.data));
                }
            } catch (error) {
                console.log("error in loadproducts!!", error)
            }

        }
        loadProducts()
    }, [dispatch]);

    const filteredProducts = products.filter(product => product.category.title === category)

    return (
        <div className='max-w-7xl mx-auto px-6 pt-36 pb-24'>
            <div className='flex flex-col gap-10'>

                {/* Header */}
                <div className='flex items-center gap-4 animate-fade-in'>
                    <Link to="/" className='w-10 h-10 rounded-full glass border border-white/05 flex items-center justify-center hover:bg-white/05 transition-colors'>
                        <FontAwesomeIcon icon={faChevronLeft} className='text-xs' />
                    </Link>
                    <div>
                        <span className='badge badge-indigo mb-2 inline-flex'>Collection</span>
                        <h1 className='text-4xl font-black text-white'>
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                        </h1>
                        {filteredProducts.length > 0 && (
                            <p className='text-slate-400 text-sm mt-1'>{filteredProducts.length} products</p>
                        )}
                    </div>
                </div>

                <div className='section-divider' />

                {filteredProducts.length === 0 ? (
                    <div className='text-center py-32 glass rounded-3xl border border-white/05 flex flex-col items-center gap-5'>
                        <FontAwesomeIcon icon={faFaceFrown} className='text-5xl text-slate-600' />
                        <div>
                            <h2 className='text-xl font-bold text-white mb-2'>No products found</h2>
                            <p className='text-slate-400 text-sm'>There are no products in this category yet.</p>
                        </div>
                        <Link to='/' className='btn-premium px-8 py-3 rounded-xl font-bold text-sm'>
                            Back to Home
                        </Link>
                    </div>
                ) : (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'>
                        {filteredProducts.map((product) => (
                            <Card key={product._id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Category