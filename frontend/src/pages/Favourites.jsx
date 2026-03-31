import { faChevronLeft, faBoxArchive } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { toast } from 'react-toastify'
import { api } from '../utils/api'
import Card from '../components/Card'
import { Oval } from 'react-loader-spinner'

function Favourites() {
    const [favourites, setFavourites] = useState([])
    const [products, setProducts] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchFavourites = async () => {
            try {
                const res = await api.get("/favourites/getFavourites")
                if (res.status === 200) {
                    setProducts(res.data.data)
                    const favouriteProducts = res.data.data.map(fav => fav.product._id)
                    setFavourites(favouriteProducts)
                }
            } catch (error) {
                const msg = error.response?.data?.message || 'something went wrong. Please try again.'
                toast.error(msg, {
                    theme: 'dark',
                    autoClose: 3000,
                })
            } finally {
                setIsLoading(false)
            }
        }
        fetchFavourites()
    }, [favourites])
    return (
        <div className='max-w-7xl mx-auto px-6 pt-36 pb-24'>
            <div className='flex flex-col gap-10'>

                {/* Header */}
                <div className='flex items-center gap-4 animate-fade-in'>
                    <Link to="/" className='w-10 h-10 rounded-full glass border border-white/05 flex items-center justify-center hover:bg-white/05 transition-colors'>
                        <FontAwesomeIcon icon={faChevronLeft} className='text-xs' />
                    </Link>
                    <div>
                        <h1 className='text-4xl font-black text-white'>Favourites</h1>
                        <p className='text-slate-400 text-sm'>{favourites.length}  Favourites</p>
                    </div>
                </div>
                {
                    isLoading ? (
                        <div className="min-h-screen pt-32 pb-24 px-6 max-w-7xl mx-auto overflow-hidden">

                            <div className='flex m-auto'>
                                <Oval
                                    height={100}
                                    width={100}
                                    color="#6a6ff2"
                                    wrapperStyle={{}}
                                    wrapperClass=""
                                    visible={true}
                                    ariaLabel='oval-loading'
                                    secondaryColor="#6a6ff2"
                                    strokeWidth={2}
                                    strokeWidthSecondary={2}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className='flex flex-col gap-8'>
                            {products.length === 0 ? (
                                <div className='text-center py-36 glass rounded-3xl border border-white/05 flex flex-col items-center gap-6 animate-fade-in'>
                                    <div className='w-24 h-24 rounded-3xl glass border border-white/05 flex items-center justify-center animate-float'>
                                        <FontAwesomeIcon icon={faBoxArchive} className='text-3xl text-slate-600' />
                                    </div>
                                    <div>
                                        <h2 className='text-2xl font-black mb-2 text-white'>No favourites yet</h2>
                                        <p className='text-slate-400'>When you add products to your favourites, they will appear here.</p>
                                    </div>
                                    <Link to="/" className='btn-premium px-8 py-4 rounded-2xl font-bold'>
                                        Explore Products
                                    </Link>
                                </div>
                            ) : (
                                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'>
                                    {products.map((favouriteProduct) => (
                                        <Card key={favouriteProduct.product._id} product={favouriteProduct.product} favourites={favourites} />
                                    ))}
                                </div>
                            )}
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default Favourites