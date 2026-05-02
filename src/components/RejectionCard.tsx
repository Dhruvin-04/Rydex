'use client'
import { AlertTriangle } from 'lucide-react'
import React from 'react'

const RejectionCard = ({ title, reason, actionLabel, onAction }: any) => {
  return (
    <div className='bg-red-100 border border-red-400 p-5 sm:p-6 md:p-8 rounded-2xl space-y-4'>
      <div className='flex items-center gap-2 text-red-600 font-semibold text-sm'>
        <AlertTriangle size={18}/>
        {title}
      </div>
      <div className='bg-white border rounded-xl p-4 text-sm'>{reason}</div>
      {onAction && (
        <button onClick={onAction} className='w-full sm:w-auto px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 font-medium transition'>{actionLabel || "Take Action"}</button>
      )}
    </div>
  )
}

export default RejectionCard