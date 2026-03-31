import { faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect } from 'react'
import { createPortal } from 'react-dom';

const PopUp = ({ openPopUp, closePopUp, children, className, innerClass = "w-fit" }) => {

  useEffect(() => {
    if (openPopUp) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [openPopUp]);

  const handlelosePopUp = (e) => {
    if (e.target.id === 'ModelContainer') {
      closePopUp();
    }
  }

  if (!openPopUp) return null

  return createPortal(
    <div
      id='ModelContainer'
      onClick={handlelosePopUp}
      className={`fixed inset-0 z-[100] bg-slate-950/60 backdrop-blur-md flex transition-all duration-500 animate-in fade-in ${className}`}>
      <div
        className={`relative ${innerClass} animate-in slide-in-from-right duration-500 shadow-2xl flex flex-col`}>
        <div className='absolute top-6 right-6 z-10'>
          <button
            className='w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-white hover:text-gray-400 transition-colors'
            onClick={closePopUp}
          >
            <FontAwesomeIcon icon={faClose} />
          </button>
        </div>
        <div className='flex-1 overflow-y-auto custom-scrollbar'>
          {children}
        </div>
      </div>
    </div>,
    document.body
  )
}

export default PopUp