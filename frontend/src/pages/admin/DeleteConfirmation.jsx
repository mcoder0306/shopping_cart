import React from 'react'
import { api } from '../../utils/api'
import { toast } from 'react-toastify'

function DeleteConfirmation({ popup, setPopup, setRefresh }) {
    const handleDelete = async (data) => {
        try {
            let res
            if (data.product) {
                res = await api.delete(`/products/deleteProduct/${data.product}`)
            }
            else {
                res = await api.delete(`/categories/deleteCategory/${data.category}`)
            }
            if (res.status === 200) {
                setPopup({ type: null, data: null })
                setRefresh && setRefresh(prev => prev + 1)
                toast.success(res.data.data.message || 'item deleted successfully', {
                    theme: 'dark',
                })
            }
        } catch (error) {
            toast.warning(error || 'Something went wrong', {
                theme: 'dark',
            })
        }
    }
    return (
        <div className="p-6 text-center">
            <h2 className="text-white text-lg font-bold mb-4">Delete {popup.data?.product ? "Product" : "Category"}?</h2>
            <p className="text-slate-400 mb-6">This cannot be undone.</p>

            <div className="flex justify-center gap-4">
                <button
                    onClick={() => setPopup({ type: null, data: null })}
                    className="px-4 py-2 bg-gray-600 rounded-lg"
                >
                    Cancel
                </button>

                <button
                    onClick={() => handleDelete(popup.data)}
                    className="px-4 py-2 bg-rose-600 rounded-lg"
                >
                    Delete
                </button>
            </div>
        </div>
    )
}

export default DeleteConfirmation