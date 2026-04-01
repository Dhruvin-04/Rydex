import { Bike, Bus, Car, CarTaxiFront, ChevronLeft, ChevronRight, Sparkle, Sparkles, Truck } from 'lucide-react'
import React, { useState } from 'react'
import { motion } from "motion/react"

const Vehicle_Categories = [
  { title: "All Vehicles", description: "Browse the full fleet", Icon: CarTaxiFront, tag: "Popular" },
  { title: "Bikes", description: "Fast & Affordable Rides", Icon: Bike, tag: "Quick" },
  { title: "Cars", description: "Comfortable city travel", Icon: Car, tag: "Comfort" },
  { title: "Trucks", description: "Heavy & Commercial Transport", Icon: Truck, tag: "Cargo" },
  { title: "SUVs", description: "Premium & spacious", Icon: Car, tag: "Premium" },
  { title: "Vans", description: "Family & group transport", Icon: Bus, tag: "Family" },
]

const VehicleSlider = () => {
  const [hover, setHover] = useState<number | null>(null)
  const sliderRef = React.useRef<HTMLDivElement>(null)
  const scroll = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const scrollAmount = sliderRef.current.clientWidth * 0.8;
      sliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };
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
                  className='absolute left-0 bottom-0 right-0 h-1 w-full bg-zinc-800 origin-left'
                />
              </span>
            </h2>
            <p className='text-zinc-400 text-sm mt-3 font-medium'>Choose the ride that best fits your needs</p>
          </div>

          <div className='hidden md:flex items-center gap-2'>
            <motion.div
              onClick={() => scroll('left')}
              whileTap={{ scale: 0.88 }}
              className='w-11 h-11 rounded-2xl border border-zinc-200 bg-white flex items-center justify-center hover:bg-zinc-900 hover:text-white disabled:opacity-25 disabled:hover:bg-white disabled:hover:text-zinc-900 disabled:hover:border-zinc-200 transition-all text-zinc-700 shadow-sm'
            >
              <ChevronLeft size={18} strokeWidth={2.5} />
            </motion.div>
            <motion.div
              onClick={() => scroll('right')}
              whileTap={{ scale: 0.88 }}
              className='w-11 h-11 rounded-2xl border border-zinc-200 bg-white flex items-center justify-center hover:bg-zinc-900 hover:text-white disabled:opacity-25 disabled:hover:bg-white disabled:hover:text-zinc-900 disabled:hover:border-zinc-200 transition-all text-zinc-700 shadow-sm'>
              <ChevronRight size={18} strokeWidth={2.5} />
            </motion.div>
          </div>

        </motion.div>

        <div className='relative'>
          <div ref={sliderRef} className='flex gap-5 pt-20 overflow-x-auto scroll-smooth pb-4 px-1' style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {Vehicle_Categories.map((vehicle, index) => {
              const isHovered = hover === index;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 + index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  onHoverStart={() => setHover(index)}
                  onHoverEnd={() => setHover(null)}
                  whileHover={{ y: -8 }}
                  className='group relative min-w-60 sm:min-w-65 shrink-0 cursor-pointer'
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
                      animate={{
                        backgroundColor: isHovered ? 'rgba(255, 255, 255, 0.12)' : '#f4f4f5',
                        color: isHovered ? '#ffffff' : '#71717a',
                        borderColor: isHovered ? 'rgba(255, 255, 255, 0.15)' : '#e4e4e7',
                      }}
                      className='inline-flex items-center gap-1.5 border text-[9px] font-black uppaercase tracking-[0.18em] px-2.5 py-1.5 rounded-full mb-5 transition-colors'
                    >

                      <Sparkles size={8} />
                      {vehicle.tag}
                    </motion.div>

                    <motion.div
                      animate={{
                        backgroundColor: isHovered ? 'rgba(255, 255, 255, 0.12)' : '#f4f4f5',
                        borderColor: isHovered ? 'rgba(255, 255, 255, 0.15)' : '#e4e4e7',
                      }}
                      className='w-12 h-12 rounded-xl border flex items-center justify-center mb-5 transition-colors'
                    >
                      <motion.div
                      animate={{
                        color: isHovered ? '#ffffff' : '#3f3f46',
                        transition: { duration: 0.2 },
                      }}
                      >
                        <vehicle.Icon size={24} strokeWidth={1.4}/>
                      </motion.div>
                    </motion.div>

                    <motion.h3
                    animate={{color: isHovered ? '#ffffff' : '#3f3f46'}}
                    transition={{ duration: 0.2 }}
                    className='text-lg font-black tracking-tight leading-none mb-2'
                    >
                      {vehicle.title}
                    </motion.h3>

                    <motion.p
                    animate={{color: isHovered ? 'rgba(255, 255, 255, 0.5)' : '#a1a1aa'}}
                    transition={{ duration: 0.2 }}
                    className='text-base font-medium leading-relaxed'
                    >
                      {vehicle.description}
                    </motion.p>



                  </motion.div>
                </motion.div>
              )
            })}
          </div>
        </div>

        <motion.div
        initial={{ opacity: 0 }}
        whileInView={{opacity: 1}}
        transition={{delay: 0.7}}
        className='flex items-center gap-6 mt-8 pt-8 border-t border-zinc-100'
        >
          {
            [
              {num: "6+", label: "Categories"},
              {num: "10+", label: "Vehicle types"},
              {num: "24/7", label: "Availability"},
            ].map((item, index) => (
              <div key={index} className='flex items-center gap-3'>
                <p className='text-zinc-900 text-lg font-black tracking-tight'>{item.num}</p>
                <p className='text-zinc-400 text-xs font-medium'>{item.label}</p>
              </div>
            ))
          }
        </motion.div>

      </div>
    </div>
  )
}

export default VehicleSlider