'use client'
import { Clock, IndianRupee, MessageCircle, Phone, User } from 'lucide-react'
import React, { useEffect } from 'react'
import {AnimatePresence, motion} from 'motion/react'
import RideChat from './RideChat'
import { RootState } from '@/redux/store'
import { useSelector } from 'react-redux'

const PanelContent = ({ isActive, displayEta, displayDistance, cfg, status, booking, paymentStatus, canChat, chatOpen, onChatToggle }: any) => {
    const {userData} = useSelector((state: RootState) => state.user)
    let currentRole
    useEffect(() => {
        if(userData){
            currentRole = userData?._id === booking?.driver?._id ? 'driver' : 'user'
        }
    }, [userData?._id])
    
  return (
    <div className='flex flex-col gap-4 pt-5 pb-4'>
        {isActive && (
            <div className='mx-5 lg:mx-6 grid grid-cols-2 gap-2'>
                <div className='bg-zinc-100 border border-zinc-200 rounded-2xl p-4 flex items-center gap-3'>
                    <div className='w-10 h-10 rounded-full bg-zinc-200 flex items-center justify-center shrink-0'>
                        <Clock className='text-zinc-500' size={16}/>
                    </div>
                    <div>
                        <p className='text-sm font-medium text-zinc-500 uppercase tracking-wider'>ETA</p>
                        <p className='text-lg font-black text-zinc-900'>{Math.round(displayEta)} min</p>
                    </div>
                </div>
                <div className='bg-zinc-950 rounded-2xl p-4 flex items-center gap-3'>
                    <div className='w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0'>
                        <IndianRupee className='text-white' size={16}/>
                    </div>
                    <div>
                        <p className='text-sm font-medium text-zinc-400 uppercase tracking-wider'>Fare</p>
                        <p className='text-lg font-black text-white'>{Math.round(booking.fare || 0)}</p>
                    </div>
                </div>
            </div>
        )}
        {booking?.user && (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className='mx-5 lg:mx-6'
            >
                <div className='bg-zinc-900 rounded-2xl p-4 flex items-center gap-4'>
                    <div className='relative shrink-0'>
                        <div className='w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center overflow-hidden'>
                            <User size={24} className='text-zinc-300' />
                        </div>
                        <div className='absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white'/>
                    </div>
                    <div className='min-w-0 flex-1'>
                        <div className='flex items-center justify-between gap-2'>
                            <p className='text-lg font-bold text-white'>{booking?.user?.name || 'Customer'}</p>
                            <div className='flex items-center gap-1 bg-white/10 py-1 px-2 rounded-full shrink-0'>
                                <IndianRupee className='text-white' size={12}/>
                                <p className='text-sm font-medium text-white'>{Math.round(booking?.fare || 0)}</p>
                            </div>
                        </div>
                        {
                            booking.paymentStatus && (
                                <div className='flex items-center gap-2 mt-1'>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${paymentStatus.cls}`}>{paymentStatus.label}</span>
                                </div>
                            )
                        }
                    </div>
                </div>
            
                {
                    isActive && (
                        <div className='flex gap-2 mt-2'>
                            {booking.userMobile && (
                                <a href={`tel:${booking.userMobile}`} className='flex flex-1 items-center justify-center gap-1 font-semibold text-sm hover:bg-zinc-200 active:scale-[0.97] transition-all text-zinc-900 bg-zinc-100 rounded-xl px-3 py-2'>
                                    <Phone className='text-zinc-400' size={15}/>
                                    Call
                                </a>
                            )}
                            {canChat && (
                                <button className={`flex-1 flex items-center justify-center gap-2 font-semibold text-sm  active:scale-[0.97] transition-all rounded-xl px-3 py-2 ${chatOpen ? 'bg-zinc-200 text-zinc-900' : 'bg-zinc-900 hover:bg-zinc-800 text-white'}`} onClick={onChatToggle}>
                                    <MessageCircle className={`text-sm ${chatOpen ? 'text-zinc-900' : 'text-white'}`} size={15}/>
                                    {chatOpen ? "Close Chat" : "Message"}
                                </button>
                            )}
                        </div>
                    )
                }

            </motion.div>
        )}
        <AnimatePresence>
            {chatOpen && (
                <motion.div
                    key='chat-panel'
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className='overflow-hidden mx-5 lg:mx-6'
                >
                    <div className='rounded-3xl overflow-hidden border border-zinc-200 bg-white/95 backdrop-blur-sm h-115'>
                        <RideChat currentRole={currentRole} bookingId={booking?._id} userName={booking?.user?.name || 'Customer'} driverName={booking?.driver?.name || 'Driver'} />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
  )
}

export default PanelContent