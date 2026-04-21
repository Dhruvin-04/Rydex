'use client'
import React from 'react'
import {motion} from "motion/react"

const TabButton = ({ active, count, icon, onClick, children }: { active: boolean, count: number, icon: React.ReactNode, onClick: () => void, children: React.ReactNode }) => {
  return (
    <motion.div
    onClick={onClick}
    whileTap={{scale: 0.95}}
    className={`relative flex items-center gap-2 px-4 py-2 rounded-2xl transition-all text-sm font-medium duration-200 select-none ${
      active ? 'bg-neutral-950 text-white shadow-lg shadow-black/20' : 'hover:text-gray-800 text-gray-500 hover:bg-gray-100'
    }`}
    >
      <span className={`flex items-center ${active ? 'text-white' : 'text-gray-500'}`}>{icon}</span>
      <span className='hidden sm:inline'>{children}</span>
      <span className={`absolute top-0 right-0 text-xs rounded-full h-5 w-6 flex items-center justify-center font-semibold ${active ? 'bg-gray-100 text-black' : count>0 ? 'bg-red-400 text-white' : 'bg-gray-300 text-gray-500'}`}>
        {count}
      </span>
    </motion.div>
  )
}

export default TabButton