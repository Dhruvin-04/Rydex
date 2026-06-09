'use client'
import React, { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, Bike, Car, Clock, CreditCard, IndianRupee, MapPin, Navigation, Shield, Truck } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import axios from 'axios'

const VEHICLE_META: any = {
    bike: { label: 'Bike', Icon: Bike },
    auto: { label: 'Auto', Icon: Car },
    car: { label: 'Car', Icon: Car },
    loading: { label: 'Loading', Icon: Truck },
    truck: { label: 'Truck', Icon: Truck },
}

type Status = "idle" | "requested" | "awaiting_payment" | "confirmed" | "payment" | "cancelled" | "rejected" | "expired";

const page = () => {
    const router = useRouter()
      const params = useSearchParams()
      const [pickup, setPickup] = useState(params.get('pickup') || '')
      const [drop, setDrop] = useState(params.get('drop') || '')
      const mobile = params.get('mobile') || ''
      const pickUpLat = Number(params.get('pickUpLatitude'))
      const pickUpLng = Number(params.get('pickUpLongitude'))
      const dropLat = Number(params.get('dropLatitude'))
      const dropLng = Number(params.get('dropLongitude'))
      const vehicle = params.get('vehicle') || ''
      const driverId = params.get('driverId') || ''
      const vehicleId = params.get('vehicleId') || ''
      const fare = Math.round(Number(params.get('fare')) || 0)
      const {Icon, label} = VEHICLE_META[vehicle]
      const [status, setStatus] = useState<Status>("idle")
      const [handle, setHandle] = useState<Status>('idle')
      const handleRequestBooking = async () => {
        try{
            const {data} = await axios.post('/api/booking/create', {
                driverId,
                vehicleId: vehicleId,
                pickupAddress: pickup,
                dropAddress: drop,
                pickupLocation: {
                    type: "Point",
                    coordinates: [pickUpLng, pickUpLat]
                },
                dropLocation: {
                    type: "Point",
                    coordinates: [dropLng, dropLat]
                },
                fare,
                mobileNumber: mobile
            })
            console.log(data)
        }catch(error: any){
            console.error(error.response?.data || error.message)
        }
      }
  return (
    <div className='min-h-screen bg-zinc-100 px-4 py-12'>
        <div className='relative max-w-6xl mx-auto z-10'>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className='mb-10'
            >
                <div className='flex items-center gap-2 mb-2'>
                    <div className='h-px w-8 bg-zinc-900'/>
                    <span className='text-lg font-bold text-zinc-900'>Booking</span>
                </div>
                <h1 className='text-4xl font-black tracking-tight text-zinc-900'>Checkout</h1>
                <p className='text-zinc-600 text-sm mt-2 font-medium'>Review your booking details and proceed to payment.</p>
            </motion.div>
            <div className='grid lg:grid-cols-2 gap-8'>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                    className="bg-white rounded-3xl px-4 border border-zinc-200 overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.05)] flex flex-col"
                >
                    <div className='h-1 bg-zinc-900'/>
                    <div className='p-8 sm:p-10'>
                        <div className='flex items-center gap-4 mb-6 justify-between'>
                            <div>
                                <div className='font-black text-zinc-700 uppercase tracking-wider text-sm'>Selected Vehicle</div>
                                <div className='text-2xl font-bold text-zinc-900 tracking-tight'>{label}</div>
                            </div>
                            <div className='w-14 h-14 rounded-full bg-zinc-900 flex items-center justify-center'>
                                <Icon size={28} className='text-white'/>
                            </div>
                        </div>

                        <div className='bg-zinc-50 border border-zinc-100 rounded-lg p-4 mb-6 overflow-hidden'>
                            <div className='flex gap-4 px-5 py-4 border-b border-zinc-100'>
                                <div className='flex flex-col items-center shrink-0 pt-0.5'>
                                    <div className='w-3 h-3 rounded-full bg-zinc-900 border-2 border-white ring ring-zinc-300'/>
                                    <div className='w-px flex-1 bg-zinc-300 my-1' style={{ minHeight: 12 }}/>
                                </div>
                                <div className='flex-1 min-w-0'>
                                    <div className='text-[0.625rem] font-black uppercase tracking-[0.18em] text-zinc-400 mb-1'>Pickup</div>
                                    <div className='text-sm font-semibold text-zinc-900 leading-snug truncate'>{pickup || 'Not specified'}</div>
                                </div>
                                <MapPin size={20} className='text-zinc-400 shrink-0 mt-1'/>
                            </div>

                            <div className='flex gap-4 px-5 py-4 border-b border-zinc-100'>
                                <div className='flex flex-col items-center shrink-0 pt-0.5'>
                                    <div className='w-3 h-3 rounded-full bg-zinc-900 border-2 border-white ring ring-zinc-300'/>
                                </div>
                                <div className='flex-1 min-w-0'>
                                    <div className='text-[0.625rem] font-black uppercase tracking-[0.18em] text-zinc-400 mb-1'>Drop</div>
                                    <div className='text-sm font-semibold text-zinc-900 leading-snug truncate'>{drop || 'Not specified'}</div>
                                </div>
                                <Navigation size={20} className='text-zinc-400 shrink-0 mt-1'/>
                            </div>
                        </div>

                        <div className='flex items-end justify-between pt-6 border-t border-zinc-100'>
                            <div>
                                <p className='text-[10px] font-bold text-zinc-900 uppercase tracking=[0.18em]'>Total Fare</p>
                                <p className='text-sm font-medium text-zinc-600'>Includes base + distance charges</p>
                            </div>
                            <motion.div
                                initial={{scale: 0.95, opacity: 0}}
                                animate={{scale: 1, opacity: 1}}
                                transition={{duration: 0.2, type: 'spring', stiffness: 200, damping: 20}}
                                className='text-2xl font-bold text-zinc-900 flex items-baseline gap-1'
                            >
                                <span className='text-lg font-bold text-zinc-400'><IndianRupee/></span>
                                <span className='text-4xl font-black text-zinc-900 tracking-tight leading-none'>{fare}</span>
                            </motion.div>
                        </div>

                    </div>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
                    className="bg-white rounded-3xl px-4 border border-zinc-200 overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.05)] flex flex-col"
                >
                    <div className='h-1 bg-zinc-900'/>
                    <div className='p-8 sm:p-10 flex flex-col gap-6 flex-1'>
                        <AnimatePresence mode='wait'>
                            {
                                status === "idle" && (
                                    <motion.div
                                        key="idle"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className='flex flex-col flex-1 justify-between gap-4'
                                    >
                                        <div>
                                            <p className='font-black text-zinc-700 uppercase tracking-wider text-sm'>Ready to go?</p>
                                            <h3 className='text-2xl font-bold text-zinc-900 tracking-tight'>Confirm Your Ride</h3>
                                            <div className='bg-zinc-50 border border-zinc-100 rounded-2xl p-4 mt-6'>
                                                {
                                                    [
                                                        {icon: <Clock size={14}/>, text: "Estimated arrival time, 2 mins"},
                                                        {icon: <Shield size={14}/>, text: "Verified & Insured drivers only"},
                                                        {icon: <CreditCard size={14}/>, text: "Pay after driver accepts"},
                                                        
                                                    ].map((item, index)=>(
                                                        <div key={index} className='flex items-center gap-3 mb-3 last:mb-0'>
                                                            <div className='w-6 h-6 rounded-full bg-zinc-200 flex items-center justify-center text-zinc-600 shrink-0'>
                                                                {item.icon}
                                                            </div>
                                                            <p className='text-zinc-600 text-xs font-medium'>{item.text}</p>
                                                        </div>
                                                        
                                                    ))
                                                }
                                            </div>
                                        </div>
                                        <motion.button
                                            onClick={handleRequestBooking}
                                            whileTap={{ scale: 0.95 }}
                                            whileHover={{ scale: 1.05 }}
                                            className='w-full h-14 mt-8 bg-zinc-900 hover:bg-black disabled:opacity-40 text-white font-black text-sm rounded-2xl flex items-center justify-center gap-3 transition-colors shadow-md'
                                        >
                                            <span className='flex items-center gap-2'>Request Ride <ArrowRight size={16}/></span>
                                        </motion.button>
                                    </motion.div>
                                )
                            }
                        </AnimatePresence>
                    </div>
                    
                </motion.div>
            </div>
        </div>
    </div>
  )
}

export default page