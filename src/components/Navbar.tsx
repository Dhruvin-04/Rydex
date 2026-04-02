"use client"
import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion } from "motion/react"
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from './ui/button'
import AuthModel from './AuthModel'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/redux/store'
import { div } from 'motion/react-client'
import { Bike, Car, ChevronRight, LogOut, Menu, Truck, X } from 'lucide-react'
import { signOut } from 'next-auth/react'
import { setUserData } from '@/redux/userSlice'
import { set } from 'mongoose'

const NavItem = ['Home', 'Bookings', 'About Us', 'Contact']
const Navbar = () => {
    const router = useRouter()
    const pathname = usePathname()
    const [authOpen, setAuthOpen] = useState(false)
    const [profileOpen, setProfileOpen] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const { userData } = useSelector((state: RootState) => state.user)
    useEffect(() => {
        { userData && console.log('User data aa gaya') }
    }, [userData])

    const dispatch = useDispatch<AppDispatch>()
    const handleLogout = async () => {
        await signOut({ redirect: false })
        dispatch(setUserData(null))
        setProfileOpen(false)
    }

    return (
        <>
            <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }} className='fixed top-3 left-1/2 -translate-x-1/2 z-50 rounded-full w-[94%] md:w-[80%] bg-[#111111] text-white shadow-[0_15px_50px_rgba(0,0,0,0.7)] py-4'>
                <div className='flex items-center justify-between px-4 md:px-8 max-w-7xl mx-auto'>
                    <Image
                        src="/logo.png"
                        alt="Rydex Logo"
                        width={44}
                        height={44}
                        style={{ width: "auto" }}
                        priority={true}
                    />
                    <div className='hidden md:flex items-center gap-10'>
                        {NavItem.map((item, index) => {
                            let href
                            if (item === "Home") {
                                href = `/`
                            } else {
                                href = `/${item.toLowerCase()}`
                            }
                            var active = href === pathname
                            return <Link key={index} href={href} className={`text-sm md:text-base lg:text-lg font-medium mx-4 cursor-pointer hover:text-gray-300 transition ${active ? 'text-white' : 'text-gray-400 hover:text-white'}`}>{item}</Link>
                        })
                        }
                    </div>
                    <div className='flex items-center gap-3 relative'>
                        <div className='hidden md:block relative'>
                            {!userData ? (
                                <>
                                    <Button variant={'secondary'} className='rounded-full px-4 py-3 text-sm md:text-base lg:text-lg' onClick={() => setAuthOpen(true)}>
                                        Login
                                    </Button>
                                </>

                            ) : (
                                <>
                                    <Button variant={'outline'} className='h-11 w-11 text-black rounded-full text-lg font-bold' onClick={() => setProfileOpen(!profileOpen)}>
                                        {userData.name.charAt(0).toUpperCase()}
                                    </Button>
                                    <AnimatePresence>
                                        {profileOpen && (
                                            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className='absolute top-12 right-0 bg-white text-black rounded-md shadow-lg py-2 w-70'>
                                                <div className='px-5 py-3'>
                                                    <p className='font-semibold text-lg'>
                                                        {userData.name}
                                                    </p>
                                                    <p className='text-sm uppercase text-gray-500 mb-4'>
                                                        {userData.role}
                                                    </p>
                                                    {userData.role != 'partner' && (
                                                        <div onClick={()=>router.push('/partner/onBoarding/vehicle')} className='w-full flex items-center gap-3 py-3 hover:bg-gray-100 rounded-xl'>
                                                            <div className='flex -space-x-2'>
                                                                <div className='w-6 h-6 bg-black text-white flex items-center justify-center rounded-full'><Bike size={14} /></div>
                                                                <div className='w-6 h-6 bg-black text-white flex items-center justify-center rounded-full'><Car size={14} /></div>
                                                                <div className='w-6 h-6 bg-black text-white flex items-center justify-center rounded-full'><Truck size={14} /></div>
                                                            </div>
                                                            Become a Partner
                                                            <ChevronRight size={18} className='ml-auto' />
                                                        </div>
                                                    )}
                                                    <div className='w-full flex items-center gap-3 pt-3 hover:bg-gray-100 rounded-xl mt-2' onClick={handleLogout}>
                                                        <LogOut size={16} className='inline mr-2' />
                                                        Logout
                                                    </div>
                                                </div>
                                            </motion.div>

                                        )}
                                    </AnimatePresence>
                                </>

                            )}
                        </div>

                        <div className='md:hidden'>
                            {!userData ? (
                                <>
                                    <Button variant={'secondary'} className='rounded-full px-4 py-3 text-sm md:text-base lg:text-lg' onClick={() => setAuthOpen(true)}>
                                        Login
                                    </Button>
                                </>

                            ) : (
                                <>
                                    <Button variant={'outline'} className='h-11 w-11 text-black rounded-full text-lg font-bold' onClick={() => setProfileOpen(!profileOpen)}>
                                        {userData.name.charAt(0).toUpperCase()}
                                    </Button>

                                </>

                            )}
                        </div>

                        <button className='md:hidden text-white' onClick={() => setMenuOpen(!menuOpen)}>
                            {menuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>

                    </div>
                </div>
            </motion.div>

            <AnimatePresence>
                {menuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.4 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMenuOpen(false)}
                            className='fixed inset-0 bg-black z-30 md:hidden'
                        />
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.2 }}
                            className='fixed top-21 left-0.5 -translate-x-0.5 w-[92%] bg-[#0B0B0B] rounded-2xl shadow-2xl z-40 md:hidden overflow-hidden'
                        >
                            <div className='flex flex-col divide-y divide-gray-800'>
                                {NavItem.map((item, index) => {
                                    let href
                                    if (item === "Home") {
                                        href = `/`
                                    } else {
                                        href = `/${item.toLowerCase()}`
                                    }
                                    return <Link key={index} href={href} className='px-6 py-4 text-gray-300 hover:bg-white/5'>{item}</Link>
                                })
                                }
                            </div>
                        </motion.div>
                    </>


                )}
            </AnimatePresence>

            <AnimatePresence>
                {profileOpen && userData && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.4 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setProfileOpen(false)}
                            className='fixed inset-0 bg-black z-30 md:hidden'
                        />
                        <motion.div
                            initial={{ y: 400 }}
                            animate={{ y: 0 }}
                            exit={{ y: 400 }}
                            transition={{ type: 'spring', damping: 25 }}
                            className='fixed inset-x-0 bottom-0 bg-white rounded-t-3xl shadow-2xl z-50 md:hidden'
                        >
                            <div className='p-5'>
                                <p className='font-semibold text-lg'>
                                    {userData.name}
                                </p>
                                <p className='text-sm uppercase text-gray-500 mb-4'>
                                    {userData.role}
                                </p>
                                {userData.role != 'partner' && (
                                    <div onClick={()=>router.push('/partner/onBoarding/vehicle')} className='w-full flex items-center gap-3 py-3 hover:bg-gray-100 rounded-xl'>
                                        <div className='flex -space-x-2'>
                                            <div className='w-6 h-6 bg-black text-white flex items-center justify-center rounded-full'><Bike size={14} /></div>
                                            <div className='w-6 h-6 bg-black text-white flex items-center justify-center rounded-full'><Car size={14} /></div>
                                            <div className='w-6 h-6 bg-black text-white flex items-center justify-center rounded-full'><Truck size={14} /></div>
                                        </div>
                                        Become a Partner
                                        <ChevronRight size={18} className='ml-auto' />
                                    </div>
                                )}
                                <div className='w-full flex items-center gap-3 pt-3 hover:bg-gray-100 rounded-xl mt-2' onClick={handleLogout}>
                                    <LogOut size={16} className='inline mr-2' />
                                    Logout
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <AuthModel isOpen={authOpen} onClose={() => setAuthOpen(false)} />
        </>
    )
}

export default Navbar