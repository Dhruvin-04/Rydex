'use client'
import { Bike, Car, Clock, IndianRupee, MessageCircle, Phone, Truck, User } from 'lucide-react'
import React, { useEffect } from 'react'
import {AnimatePresence, motion} from 'motion/react'
import RideChat from './RideChat'
import { RootState } from '@/redux/store'
import { useSelector } from 'react-redux'

const getVehicleIcon = (vehicleType: string) => {
    switch (vehicleType?.toLowerCase()) {
      case 'bike':
        return <Bike className='text-white' size={18} />
      case 'auto':
      case 'car':
        return <Car className='text-white' size={18} />
      case 'truck':
      case 'loading':
        return <Truck className='text-white' size={18} />
    }
  }

const PanelContent = ({ isActive, displayEta, displayDistance, cfg, status, booking, paymentStatus, canChat, chatOpen, onChatToggle, currentRole }: any) => {
    
  return (
    <div className='flex flex-col gap-4 pb-3'>
        {isActive && (
            <div className='mx-5 lg:mx-6 grid grid-cols-2 gap-2'>
                <div className='bg-zinc-100 border border-zinc-200 rounded-2xl p-4 flex items-center gap-3'>
                    <div className='w-8 h-8 rounded-full bg-zinc-200 flex items-center justify-center shrink-0'>
                        <Clock className='text-zinc-500' size={16}/>
                    </div>
                    <div>
                        <p className='text-sm font-medium text-zinc-500 uppercase tracking-wider'>ETA</p>
                        <p className='text-lg font-black text-zinc-900'>{Math.round(displayEta)} min</p>
                    </div>
                </div>
                <div className='bg-zinc-950 rounded-2xl p-4 flex items-center gap-3'>
                    <div className='w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0'>
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
        {booking?.vehicle && (
            <div className='mx-5 lg:mx-6'>
                <div className='bg-zinc-50 border border-zinc-100 rounded-2xl p-4 flex items-center gap-3'>
                    <div className='w-11 h-11 rounded-xl bg-zinc-900 flex items-center justify-center shrink-0'>
                        {getVehicleIcon(booking.vehicle.type)}
                    </div>
                    <div className='flex-1 min-w-0'>
                        <p className='text-xs font-medium text-zinc-500 uppercase tracking-wider'>Your Vehicle</p>
                        <p className='text-lg font-black text-zinc-900'>{booking.vehicle.model || 'Vehicle'}</p>
                    </div>
                    <div className='shrink-0 bg-zinc-900 px-3 py-1.5 rounded-xl'>
                        <p className='text-white text-xs font-bold tracking-widest font-mono'>{booking.vehicle.licensePlate || 'Number'}</p>
                    </div>
                </div>
            </div>
        )}

        <div className='mx-5 lg:mx-6'>
            <div className='bg-zinc-50 border border-zinc-100 rounded-2xl overflow-hidden'>
                <div className='border-b border-zinc-100 px-4 py-3 flex gap-2'>
                    <div className='flex flex-col items-center shrink-0 pt-1'>
                        <div className='w-3 h-3 rounded-full bg-zinc-900 border-2 border-white shadow-sm'/>
                        <div className='w-px mt-1 bg-zinc-300' style={{ height: 20 }}/>
                    </div>
                    <div className='flex-1 min-w-0'>
                        <p className='text-xs font-medium text-zinc-500 uppercase tracking-wider mb-0.5'>Pickup</p>
                        <p className='text-sm font-black text-zinc-800 leading-snug'>{booking?.pickupAddress || 'Location'}</p>
                    </div>
                </div>
                <div className='border-b border-zinc-100 px-4 py-3 flex gap-2'>
                    <div className='flex flex-col items-center shrink-0 pt-1'>
                        <div className='w-3 h-3 rounded-full bg-zinc-900 border-2 border-white shadow-sm'/>
                        <div className='w-px mt-1 bg-zinc-300' style={{ height: 20 }}/>
                    </div>
                    <div className='flex-1 min-w-0'>
                        <p className='text-xs font-medium text-zinc-500 uppercase tracking-wider mb-0.5'>Drop</p>
                        <p className='text-sm font-black text-zinc-800 leading-snug'>{booking?.dropAddress || 'Location'}</p>
                    </div>
                </div>
            </div>
        </div>

    </div>
  )
}

export default PanelContent