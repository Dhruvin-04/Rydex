"use client"
import React from 'react'
import { motion } from "motion/react"
import { Bike, Bus, Car, Truck } from 'lucide-react'

const HeroSection = () => {
  return (
    <div className='w-full min-h-screen relative overflow-hidden'>
      <div className='absolute inset-0 bg-cover bg-center' style={{backgroundImage: "url('/heroImage.jpg')"}}/>
      <div className='absolute inset-0 bg-black/80'/>
      <div className='relative flex flex-col items-center justify-center text-center z-10 min-h-screen px-4'>
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className='text-white text-4xl sm:text-5xl md:text-6xl font-bold'>
          Book A Vehicle, Anytime, Anywhere
        </motion.div>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className='text-gray-300 text-sm sm:text-lg md:text-xl mt-4 max-w-2xl'>
          Experience the freedom of seamless vehicle rentals with Rydex
        </motion.p>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className='mt-8 flex space-x-6 text-gray-300'>
          <Bike size={30}/>
          <Car size={30}/>
          <Bus size={30}/>
          <Truck size={30}/>
        </motion.div>
        <motion.button whileHover={{scale: 1.05}} whileTap={{scale: 0.95}} className='mt-8 font-semibold bg-white hover:bg-gray-200 text-gray-900 py-4 shadow-xl px-10 rounded-full'>
          Book Now
        </motion.button>
      </div>
    </div>
  )
}

export default HeroSection