'use client'
import React from 'react'
import { motion } from "motion/react"
import Image from 'next/image'

const socialIcons = [
  { name: 'Facebook', src: '/facebook.png', href: '#' },
  { name: 'Twitter', src: '/twitter.png', href: '#' },
  { name: 'Instagram', src: '/instagram.png', href: '#' },
]

const Footer = () => {
  return (
    <div className='w-full bg-black text-white'>
      <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{opacity: 1, y: 0}}
      transition={{duration: 0.6, ease: 'easeOut'}}
      viewport={{once: true}}
      className='max-w-7xl mx-auto px-6 py-16'
      >
        <div className='grid grid-col-1 sm:grid-cols-2 lg:grid-cols-4 gap-12'>
          <div>
            <h2 className='text-2xl font-bold tracking-wide'>RYDEX</h2>
            <p className='mt-4 text-gray-400 text-sm leading-relaxed'>Book any vehicle - from bikes to trucks. <br/>
                              Trusted owners. Transparent pricing</p>
            <div className='mt-6 flex items-center gap-3'>
              {socialIcons.map((icon) => (
                <motion.a
                  key={icon.name}
                  whileHover={{y: -3}}
                  href={icon.href}
                  aria-label={icon.name}
                  className='w-10 h-10 flex items-center justify-center rounded-full border border-white/20 hover:bg-white hover:text-black transition'
                >
                  <Image
                    src={icon.src}
                    alt={icon.name}
                    width={18}
                    height={18}
                    className='h-4.5 w-4.5 object-contain'
                  />
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Footer