'use client'
import React from 'react'
import {motion} from 'motion/react'

const StatusCard = ({ icon, title, desc }: any) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className='bg-white border rounded-2xl p-5 shadow-md flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5 md:p-8 sm:p-6'
    >
      <div className='bg-black text-white p-3 rounded-2xl flex items-center gap-3'>
        {icon}
      </div>
      <div className='flex-1'>
        <h3 className='text-base sm:text-lg md:text-xl font-semibold'>{title}</h3>
        <p className='text-gray-600'>{desc}</p>
      </div>
    </motion.div>
  )
}

export default StatusCard