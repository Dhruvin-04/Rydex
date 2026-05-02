'use client'
import React from 'react'

const ActionCard = ({ icon, title, button, onClick }: any) => {
  return (
    <div className='bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col justify-between items-start sm:items-center gap-5 sm:flex-row sm-p-6 md:p-8'>
      <div className='flex items-center gap-4'>
        <div className='bg-black text-white p-2 md:p-4 rounded-2xl shrink-0'>{icon}</div>
        <div className='text-base font-semibold'>{title}</div>
      </div>
      <button 
        onClick={onClick}
        className='bg-black text-white py-2 px-4 rounded-xl hover:bg-gray-800 transition-colors w-full sm:w-auto'
      >
        {button}
      </button>
    </div>
  )
}

export default ActionCard