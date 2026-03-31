import { Bike, Bus, Car, CarTaxiFront, ChevronLeft, ChevronRight, Sparkle, Sparkles, Truck } from 'lucide-react'
import React, { useState } from 'react'
import { motion } from "motion/react"

const Vehicle_Categories = [
  { title: "All Vehicles", desc: "Browse the full fleet", Icon: CarTaxiFront, tag: "Popular" },
  { title: "Bikes", desc: "Fast & Affordable Rides", Icon: Bike, tag: "Quick" },
  { title: "Cars", desc: "Comfortable city travel", Icon: Car, tag: "Comfort" },
  { title: "Trucks", desc: "Heavy & Commercial Transport", Icon: Truck, tag: "Cargo" },
  { title: "SUVs", desc: "Premium & spacious", Icon: Car, tag: "Premium" },
  { title: "Vans", desc: "Family & group transport", Icon: Bus, tag: "Family" },
]

const VehicleSlider = () => {
  const [hover, setHover] = useState<number | null>(null)
  return (
    <div className='w-full bg-white py-20 px-4 overflow-hidden'>
      <div className='mx-auto max-w-7xl'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className='flex items-end justify-between mb-10'
        >
          <div>
            <div className='flex items-center gap-2 mb-3'>
              <div className='h-px w-8 bg-zinc-900' />
              <span className='text-sm uppercase text-zinc-900 tracking-[0.2em] font-black'>Our Fleet</span>
            </div>
            <h2 className='text-3xl sm:text-4xl text-zinc-900 tracking-tight font-black'>Explore Our Vehicle Options <br />
              <span className='relative inline-bloack'>Categories
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  transition={{ duration: 0.5, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className='absolute left-0 bottom-0 right-0 h-1 w-full bg-yellow-400 origin-left'
                />
              </span>
            </h2>
            <p className='text-zinc-400 text-sm mt-3 font-medium'>Choose the ride that best fits your needs</p>
          </div>

          <div className='hidden md:flex items-center gap-2'>
            <motion.div
              whileTap={{ scale: 0.88 }}
              className='w-11 h-11 rounded-2xl border border-zinc-200 bg-white flex items-center justify-center hover:bg-zinc-900 hover:text-white disabled:opacity-25 disabled:hover:bg-white disabled:hover:text-zinc-900 disabled:hover:border-zinc-200 transition-all text-zinc-700 shadow-sm'
            >
              <ChevronLeft size={18} strokeWidth={2.5} />
            </motion.div>
            <motion.div
              whileTap={{ scale: 0.88 }}
              className='w-11 h-11 rounded-2xl border border-zinc-200 bg-white flex items-center justify-center hover:bg-zinc-900 hover:text-white disabled:opacity-25 disabled:hover:bg-white disabled:hover:text-zinc-900 disabled:hover:border-zinc-200 transition-all text-zinc-700 shadow-sm'>
              <ChevronRight size={18} strokeWidth={2.5} />
            </motion.div>
          </div>

        </motion.div>
        <div className='relative'>
          <div className='flex gap-5 pt-20 overflow-x-auto scroll-smooth pb-4 px-1' style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
            {Vehicle_Categories.map((vehicle, index) => {
              const isHovered = hover === index; 
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 + index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  onHoverStart={()=>setHover(index)}
                  onHoverEnd={()=>setHover(null)}
                  whileHover={{y: -8}}
                  className='group relative min-w-55 sm:min-w-60 shrink-0 cursor-pointer'
                >
                  <motion.div
                    animate={{ 
                      backgroundColor: isHovered ? '#09090b' : '#ffffff',
                      borderColor: isHovered ? '#09090b' : '#e4e4e7',
                      boxShadow: isHovered ? '0 24px 56px rgba(0, 0, 0, 0.2)' : '0 2px 16px rgba(0, 0, 0, 0.06)',
                    }}
                    transition={{ duration: 0.3 }}
                    
                    className='relative rounded-3xl border p-6 sm-p-7 overflow-hidden h-full'
                  >
                    <motion.div
                    
                    >
                      <Sparkles/>
                      {vehicle.tag}
                    </motion.div>
                  </motion.div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default VehicleSlider