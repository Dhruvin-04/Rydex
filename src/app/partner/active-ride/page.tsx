'use client'
import LiveRideMap from '@/components/LiveRideMap'
import PanelContent from '@/components/PanelContent'
import { BookingStatus, IBooking, PaymentStatus } from '@/models/booking.model'
import axios from 'axios'
import { Zap } from 'lucide-react'
import {motion} from 'motion/react'
import React, { useEffect, useState } from 'react'

const MAP_STATUS: Record<BookingStatus, 'arriving' | 'ongoing' | 'completed'> = {
    idle: 'arriving',
    requested: 'arriving',
    awaiting_payment: 'arriving',
    confirmed: 'arriving',
    started: 'ongoing',
    completed: 'completed',
    cancelled: 'completed',
    rejected: 'completed',
    expired: 'completed',
}

const STATUS_LABEL: Record<BookingStatus, {label: string; sublabel: string; dot: string}> = {
    idle: { label: 'Idle', sublabel: 'Waiting for driver', dot: 'bg-gray-400' },
    requested: { label: 'Requested', sublabel: 'Driver is on the way', dot: 'bg-blue-500' },
    awaiting_payment: { label: 'Awaiting Payment', sublabel: 'Please complete payment', dot: 'bg-yellow-500' },
    confirmed: { label: 'Confirmed', sublabel: 'Driver has accepted the ride', dot: 'bg-green-500' },
    started: { label: 'In Progress', sublabel: 'Ride is in progress', dot: 'bg-purple-500' },
    completed: { label: 'Completed', sublabel: 'Ride has been completed', dot: 'bg-gray-500' },
    cancelled: { label: 'Cancelled', sublabel: 'Ride has been cancelled', dot: 'bg-red-500' },
    rejected: { label: 'Rejected', sublabel: 'Driver has rejected the ride', dot: 'bg-red-500' },
    expired: { label: 'Expired', sublabel: 'Ride has expired', dot: 'bg-red-500' }
}

const PAYMENT_BADGE: Record<PaymentStatus, {label: string; cls: string}> = {
    pending: { label: 'Pending', cls: 'bg-amber-100 text-amber-700' },
    paid: { label: 'Paid', cls: 'bg-emerald-100 text-emerald-700' },
    cash: { label: 'Cash', cls: 'bg-zinc-100 text-zinc-700' },
    failed: { label: 'Failed', cls: 'bg-red-100 text-red-700' },
}

const page = () => {
    const [booking, setBooking] = useState<IBooking | null>(null)
    const [loading, setLoading] = useState(false)
    const [driverPos, setDriverPos] = useState<[number, number] | null>(null)
    const [pickUpPos, setPickUpPos] = useState<[number, number] | null>(null)
    const [dropPos, setDropPos] = useState<[number, number] | null>(null)
    const [distanceToPickup, setDistanceToPickup] = useState<number>(0)
    const [distanceToDrop, setDistanceToDrop] = useState<number>(0)
    const [etaToPickup, setEtaToPickup] = useState<number>(0)
    const [etaToDrop, setEtaToDrop] = useState<number>(0)
    const [status, setStatus] = useState('')

    useEffect(() => {
        async function fetch() {
            setLoading(true)
            try {
                const {data} = await axios.get('/api/partner/my-active')
                console.log('Active booking:', data)
                setBooking(data)
                setStatus(data.bookingStatus)
                setPickUpPos([data.pickupLocation.coordinates[1], data.pickupLocation.coordinates[0]])
                setDropPos([data.dropLocation.coordinates[1], data.dropLocation.coordinates[0]])
                setLoading(false)
            } catch (error) {
                console.error('Error fetching active booking:', error)
                setLoading(false)
            }
        }
        fetch()
    }, [])

    useEffect(() => {
        if(!navigator.geolocation) return
        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                setDriverPos([position.coords.latitude, position.coords.longitude])
            }, 
            (error) => {
                console.error('Error getting location:', error)
            },
            { enableHighAccuracy: true, maximumAge: 2000, timeout: 10000 }
        )
        return () => {
            navigator.geolocation.clearWatch(watchId)
        }
    }, [])

    const onChatToggle = () => {
        setChatOpen(prev => !prev)
    }

    const [chatOpen, setChatOpen] = useState(false)
    const cfg = STATUS_LABEL[booking?.bookingStatus! ?? 'confirmed']
    const isActive = ['confirmed', 'started'].includes(status)
    const canChat = booking?.bookingStatus === 'confirmed'
    const displayEta = status=='confirmed' ? etaToPickup : etaToDrop
    const displayDistance = status=='confirmed' ? distanceToPickup : distanceToDrop
    const paymentStatus = PAYMENT_BADGE[booking?.paymentStatus! ?? 'pending']
    const panelProps = { isActive, displayEta, displayDistance, cfg, status, booking, paymentStatus, canChat, chatOpen, onChatToggle, currentRole: "driver"}

    if(loading){
        return (
            <div className='h-screen w-full flex items-center justify-center bg-zinc-900'>
                <div className='flex flex-col items-center gap-4'>
                    <div className='w-12 h-12 border-2 border-white/20 border-t-white animate-spin rounded-full'/>
                    <p className='text-white/40 text-sm tracking-widest uppercase font-medium'>Loading Ride...</p>
                </div>
            </div>
        )
    }

  return (
    <div className='h-screen w-full bg-zinc-100 flex flex-col overflow-hidden lg:flex-row'>
        <div className='relative flex-1 h-full z-0'>
            <LiveRideMap 
                driverLocation={driverPos}
                pickUpLocation={pickUpPos}
                dropLocation={dropPos}
                mapStatus={MAP_STATUS[booking?.bookingStatus!]}
                onStats={((stats)=> {
                    setDistanceToPickup(stats.distanceToPickup)
                    setEtaToPickup(stats.etaToPickup)
                    setDistanceToDrop(stats.distanceToDrop)
                    setEtaToDrop(stats.etaToDrop)
                })}
            /> 
            <motion.div
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className='absolute top-4 left-1/2 -translate-x-1/2 z-500 pointer-events-none'
            >
                <div className='flex items-center gap-2 bg-white/95 backdrop-blur-sm rounded-full px-4 py-2 shadow-md border border-zinc-200'>
                    <span className={`w-3 h-3 rounded-full ${cfg.dot} animate-pulse`}/>
                    <div className='flex flex-col'>
                        <p className='text-sm font-medium text-zinc-900'>{cfg.label}</p>
                        <p className='text-xs text-zinc-500'>{cfg.sublabel}</p>
                    </div>
                </div>
            </motion.div>
            
        </div>
        <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className='lg:w-100 w-full h-full bg-white/95 backdrop-blur-sm border-l border-zinc-200 z-500 hidden lg:flex flex-col gap-4 overflow-hidden'
        >
            <div className='bg-zinc-950 px-6 py-5 shrink-0'>
                <p className='text-sm text-zinc-400 tracking-widest uppercase font-medium'>Driver Panel</p>
                <div className='flex items-center gap-4 mt-2 justify-between'>
                    <h1 className='text-lg font-bold text-white'>Active Ride</h1>
                    {isActive && (
                        <div className='flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 shadow-md border border-zinc-200'>
                            <Zap className=' text-amber-400' size={12}/>
                            <span className='text-sm font-medium text-white'>{Math.round(displayEta)} min</span>
                        </div>
                    )}
                </div>
            </div>
            <div className='flex-1 overflow-hidden flex flex-col'>
                <div className='flex-1 overflow-y-auto scrollbar-hide'>
                    <PanelContent {...panelProps} />
                </div>
            </div>
        </motion.div>
    </div>
  )
}

export default page