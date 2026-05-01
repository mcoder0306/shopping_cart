import React from 'react'
import { api } from '../../utils/api'
import { toast } from 'react-toastify'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'

function DeleteConfirmation({ popup, setPopup, setRefresh }) {
    const handleDelete = async (data) => {
        try {
            const { module, id } = data;
            const res = await api.delete(`/admin/${module}/${id}`);

            if (res.status === 200) {
                setPopup({ type: null, data: null })
                setRefresh && setRefresh(prev => prev + 1)
                toast.success(`${module.slice(0, -1)} deleted successfully`, {
                    theme: 'dark',
                })
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Something went wrong', {
                theme: 'dark',
            })
        }
    }

    return (
        <div className="glass rounded-3xl overflow-hidden border border-white/05 animate-zoom-in">
            <div className="p-8 text-center">
                <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-rose-500">
                    <FontAwesomeIcon icon={faTriangleExclamation} size="2x" />
                </div>

                <h2 className="text-white text-2xl font-black mb-3 uppercase tracking-tight">Are you sure?</h2>
                <p className="text-slate-400 mb-8 max-w-[280px] mx-auto text-sm leading-relaxed">
                    This action cannot be undone. All data associated with this entry will be permanently removed.
                </p>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={() => handleDelete(popup.data)}
                        className="w-full py-4 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl font-extrabold transition-all shadow-lg shadow-rose-600/20 active:scale-[0.98]"
                    >
                        YES, DELETE IT
                    </button>

                    <button
                        onClick={() => setPopup({ type: null, data: null })}
                        className="w-full py-4 glass text-slate-300 hover:text-white rounded-2xl font-bold transition-all"
                    >
                        CANCEL
                    </button>
                </div>
            </div>
        </div>
    )
}

export default DeleteConfirmation