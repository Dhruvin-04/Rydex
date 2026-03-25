"use client"
import React, { use } from 'react'
import {motion} from "motion/react"
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NavItem = ['Home', 'Bookings', 'About Us', 'Contact']
const Navbar = () => {
    const pathname = usePathname()
  return (
    <motion.div initial={{y: -50, opacity: 0}} animate={{y: 0, opacity: 1}} transition={{duration: 0.5}} className='fixed top-3 left-1/2 -translate-x-1/2 z-50 rounded-full w-[94%] md:w-[80%] bg-[#0B0B0B] text-white shadow-[0_15px_50px_rgba(0,0,0,0.7)] py-4'>
        <div className='flex items-center justify-between px-4 md:px-8 max-w-7xl mx-auto'>
            <Image src="/logo.png" alt="Rydex Logo" width={44} height={44} priority={true} />
            <div>
                {NavItem.map((item, index) => {
                    let href
                    if(item === "Home"){
                        href =`/`
                    }else{
                        href =`/${item.toLowerCase()}`
                    }
                    var active = href===pathname
                    return <Link key={index} href={href} className={`text-sm md:text-base lg:text-lg font-medium mx-4 cursor-pointer hover:text-gray-300 transition ${active ? 'text-white' : 'text-gray-400 hover:text-white'}`}>{item}</Link>
                    })
                }
            </div>
            
        </div>
    </motion.div>
  )
}

export default Navbar