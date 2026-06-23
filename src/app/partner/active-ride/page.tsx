'use client'
import CompletedScreen from '@/components/CompletedScreen'
import LiveRideMap from '@/components/LiveRideMap'
import PanelContent from '@/components/PanelContent'
import { getSocket } from '@/lib/socket'
import { BookingStatus, IBooking, PaymentStatus } from '@/models/booking.model'
import axios from 'axios'
import { ArrowRight, Check, ChevronUp, KeyRound, Loader2, MapPin, Navigation, Zap } from 'lucide-react'
import {AnimatePresence, motion} from 'motion/react'
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
    const [expanded, setExpanded] = useState(false)

    const [otpMode, setOtpMode] = useState(false)
    const [otp, setOtp] = useState('')
    const [loadingOtp, setLoadingOtp] = useState(false)
    const [otpVerified, setOtpVerified] = useState(false)
    const [otpError, setOtpError] = useState('')

    const [dropOtpMode, setDropOtpMode] = useState(false)
    const [dropOtp, setDropOtp] = useState('')
    const [loadingDropOtp, setLoadingDropOtp] = useState(false)
    //const [dropOtpVerified, setDropOtpVerified] = useState(false)
    const [dropOtpError, setDropOtpError] = useState('')

    const handleSendPickupOtp = async () => {
        try {
            const {data} = await axios.post('/api/partner/bookings/otp/pickup/send', {bookingId: booking?._id}) 
            console.log(data)
            setOtpMode(true)
        } catch (error) {
            console.log(error)
        }
    }   
    const handleSendDropOtp = async () => {
        try {
            const {data} = await axios.post('/api/partner/bookings/otp/drop/send', {bookingId: booking?._id}) 
            console.log(data)
            setDropOtpMode(true)
        } catch (error) {
            console.log(error)
        }
    }   
    const handleVerifyPickupOtp = async () => {
        setLoadingOtp(true)
        try {
            const {data} = await axios.post('/api/partner/bookings/otp/pickup/verify', {bookingId: booking?._id, otp: otp}) 
            console.log(data)
            setOtpMode(false)
            setOtp('')
            setOtpVerified(true)
            setBooking(prev=>prev?{...prev,bookingStatus:'started'}:prev)
            setLoadingOtp(false)
            setStatus('started')
        } catch (error: any) {
            setOtpError(error.response.data.message ?? 'verification failed')
            setLoadingOtp(false)
        }
    }   
    const handleVerifyDropOtp = async () => {
        setLoadingDropOtp(true)
        try {
            const {data} = await axios.post('/api/partner/bookings/otp/drop/verify', {bookingId: booking?._id, otp: dropOtp}) 
            console.log(data)
            setDropOtpMode(false)
            setDropOtp('')
            setBooking(prev=>prev?{...prev,bookingStatus:'completed'}:prev)
            setLoadingDropOtp(false)
            setStatus('completed')
        } catch (error: any) {
            setDropOtpError(error.response.data.message ?? 'verification failed')
            setLoadingDropOtp(false)
        }
    }   





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
        const socket = getSocket()
        if(!navigator.geolocation) return
        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                const lat = position.coords.latitude
                const lng = position.coords.longitude
                setDriverPos([lat, lng])
                socket.emit('driver-location-update', {
                    bookingId: booking?._id,
                    latitude: lat,
                    longitude: lng,
                    status: status
                })
            }, 
            (error) => {
                console.error('Error getting location:', error)
            },
            { enableHighAccuracy: true, maximumAge: 2000, timeout: 10000 }
        )
        return () => {
            navigator.geolocation.clearWatch(watchId)
        }
    }, [booking?._id])

    useEffect(() => {
        if(!booking?._id) return
        const socket = getSocket()
        socket.emit('join-ride', booking?._id)
        socket.on('driver-location', ({latitude, longitude}) => {
            setDriverPos([latitude, longitude])
        })
        return () => {
            socket.off('join-ride')
            socket.off('driver-location')
        }
    }, [booking?._id])

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

    if(status==='completed' && booking){
        return(
            <CompletedScreen booking={booking} role='driver' />
        )
    }

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

                <div className='shrink-0 border-t border-zonc-100 bg-white px-5 py-4'>
                    <AnimatePresence mode='wait'>
                        {status==='confirmed' && !otpMode && !otpVerified && (
                            <motion.button
                                key='arrived'
                                initial={{opacity: 0, scale: 0.95, y: 6}}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 6 }}
                                transition={{ duration: 0.25 }}
                                onClick={handleSendPickupOtp}
                                className='flex items-center justify-center gap-2 w-full bg-zinc-900 hover:bg-zinc-800 active:bg-zinc-700 text-sm tracking-wide transition-all text-white rounded-xl font-semibold py-3.5 shadow-lg'
                            >
                                <MapPin size={16} /> I've Arrived at Pickup <ArrowRight size={16} className='ml-1'/>
                            </motion.button>
                        )}
                        {status==='confirmed' && otpMode && !otpVerified && (
                            <motion.div
                                initial ={{opacity: 0, scale: 0.95, y: 6}}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 6 }}
                                transition={{ duration: 0.25 }}
                                className='bg-zinc-50 border border-zonc-200 rounded-2xl overflow-hidden'
                            >
                                <div className='bg-zonc-900 px-4 py-3 flex items-center gap-2'>
                                    <KeyRound className='text-white' size={18}/>
                                    <p className='text-sm font-bold text-white tracking-wide uppercase'>Enter Customer Otp</p>
                                </div>
                                <div className='p-4 space-y-3'>
                                    <p className='text-sm text-zinc-500'>
                                        Ask the customer for their OTP to start the ride
                                    </p>
                                    <div className='flex items-center justify-center gap-2 mt-3'>
                                        <input type='text' value={otp} onChange={(e)=>{setOtp(e.target.value.replace(/\D/g, "")); setOtpError("")}}
                                            className={`flex-1 border-zinc-200 rounded-lg p-3 text-center text-lg font-bold tracking-widest focus:border-zinc-900 focus:ring-2 outline-none`}
                                            maxLength={4}
                                            placeholder='****'
                                            autoFocus
                                        />
                                    </div>
                                    {otpError && (
                                        <motion.p
                                            initial={{opacity: 0}}
                                            animate={{opacity: 1}}
                                            exit={{opacity: 0}}
                                            className='text-xs text-red-500 font-medium text-center tracking-wide'
                                        >
                                            {otpError}
                                        </motion.p>
                                    )}

                                    <div className='flex items-center gap-2 mt-3'>
                                        <button onClick={() => {setOtpMode(false); setOtp(""); setOtpError("")}} className='flex-1 border border-zonc-200 bg-white text-zonc-700 py-3 rounded-xl text-sm font-semibold active:scale-[0.97] transition-all'>
                                            Cancel
                                        </button>
                                        <button onClick={handleVerifyPickupOtp} disabled={otp.length < 4 || loadingOtp}
                                            className='flex-1 bg-zinc-900 text-white p-3.5 rounded-lg hover:bg-zinc-800 active:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all'>
                                            {
                                                loadingOtp
                                                    ? <Loader2 size={18} className='animate-spin mx-auto'/>
                                                    : 'Verify OTP'
                                            }
                                        </button>
                                    </div>
                                    
                                </div>
                                
                            </motion.div>
                        )}
                        {status==='started' && !dropOtpMode && (
                            <motion.button
                                key='arrived'
                                initial={{opacity: 0, scale: 0.95, y: 6}}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 6 }}
                                transition={{ duration: 0.25 }}
                                onClick={handleSendDropOtp}
                                className='flex items-center justify-center gap-2 w-full bg-zinc-900 hover:bg-zinc-800 active:bg-zinc-700 text-sm tracking-wide transition-all text-white rounded-xl font-semibold py-3.5 shadow-lg'
                            >
                                <Navigation size={16} /> Mark as Dropped <ArrowRight size={16} className='ml-1'/>
                            </motion.button>
                        )}
                        {status==='started' && dropOtpMode && (
                            <motion.div
                                initial ={{opacity: 0, scale: 0.95, y: 6}}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 6 }}
                                transition={{ duration: 0.25 }}
                                className='bg-zinc-50 border border-zonc-200 rounded-2xl overflow-hidden'
                            >
                                <div className='bg-zonc-900 px-4 py-3 flex items-center gap-2'>
                                    <KeyRound className='text-white' size={18}/>
                                    <p className='text-sm font-bold text-white tracking-wide uppercase'>Enter Customer Otp</p>
                                </div>
                                <div className='p-4 space-y-3'>
                                    <p className='text-sm text-zinc-500'>
                                        Ask the customer for their OTP to complete the ride
                                    </p>
                                    <div className='flex items-center justify-center gap-2 mt-3'>
                                        <input type='text' value={dropOtp} onChange={(e)=>{setDropOtp(e.target.value.replace(/\D/g, "")); setDropOtpError("")}}
                                            className={`flex-1 border-zinc-200 rounded-lg p-3 text-center text-lg font-bold tracking-widest focus:border-zinc-900 focus:ring-2 outline-none`}
                                            maxLength={4}
                                            placeholder='****'
                                            autoFocus
                                        />
                                    </div>
                                    {dropOtpError && (
                                        <motion.p
                                            initial={{opacity: 0}}
                                            animate={{opacity: 1}}
                                            exit={{opacity: 0}}
                                            className='text-xs text-red-500 font-medium text-center tracking-wide'
                                        >
                                            {dropOtpError}
                                        </motion.p>
                                    )}

                                    <div className='flex items-center gap-2 mt-3'>
                                        <button onClick={() => {setDropOtpMode(false); setDropOtp(""); setDropOtpError("")}} className='flex-1 border border-zinc-200 bg-white text-zinc-700 py-3 rounded-xl text-sm font-semibold active:scale-[0.97] transition-all'>
                                            Cancel
                                        </button>
                                        <button onClick={handleVerifyDropOtp} disabled={dropOtp.length < 4 || loadingDropOtp}
                                            className='flex-1 bg-zinc-900 text-white p-3.5 rounded-lg hover:bg-zinc-800 active:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all'>
                                            {
                                                loadingDropOtp
                                                    ? <Loader2 size={18} className='animate-spin mx-auto'/>
                                                    : 'Verify OTP'
                                            }
                                        </button>
                                    </div>
                                    
                                </div>
                                
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

            </div>
        </motion.div>

        {/* mobile view */}
        <div className={`lg:hidden fixed bottom-0 left-0 right-0 pointer-events-none z-500`}>
            <motion.div
                className='bg-white rounded-t-3xl shadow-2xl pointer-events-auto overflow-hidden border border-zinc-200 flex flex-col'
                animate={{ height: expanded ? '82vh' : 142 }}
                transition={{type: 'spring', stiffness: 320, damping: 38}}
            >
                <div className='shrink-0 cursor-pointer select-none' onClick={() => setExpanded(prev => !prev)}>
                    <div className='pt-3 pb-1'>
                        <div className='w-10 h-1.5 rounded-full bg-zinc-300 mx-auto'/>
                    </div>

                    <div className='flex items-center justify-between px-6 py-3'>
                        <div className='flex items-center gap-3'>
                            <span className={`w-3 h-3 rounded-full ${cfg.dot} animate-pulse`}/>
                            <div>
                                <p className='text-sm font-bold leading-tight text-zinc-900'>{cfg.label}</p>
                                <p className='text-xs leading-tight text-zinc-500'>{cfg.sublabel}</p>
                            </div>
                        </div>
                        <div className='flex items-center gap-3'>
                            {isActive && (
                                <div className='text-right'>
                                    <p className='text-sm font-bold text-zinc-900'>{Math.round(displayEta)} min</p>
                                </div>
                            )}
                            <motion.div
                                animate={{ rotate: expanded ? 180 : 0 }}
                                transition={{ duration: 0.3 }}
                                className='w-6 h-6 rounded-full bg-zinc-100 flex items-center justify-center'
                            >
                                <ChevronUp size={16} className='text-zinc-900'/>
                            </motion.div>
                        </div>
                    </div>

                    <div className='h-px bg-zinc-200 mx-5'/>
                </div>

                <div className='flex-1 overflow-y-auto min-h-0'>
                    <PanelContent {...panelProps} />
                </div>

                <div className='shrink-0 border-t border-zinc-100 bg-white px-5 py-4'>
                    <AnimatePresence mode='wait'>
                        {status==='confirmed' && !otpMode && !otpVerified && (
                            <motion.button
                                key='arrived'
                                initial={{opacity: 0, scale: 0.95, y: 6}}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 6 }}
                                transition={{ duration: 0.25 }}
                                onClick={handleSendPickupOtp}
                                className='flex items-center justify-center gap-2 w-full bg-zinc-900 hover:bg-zinc-800 active:bg-zinc-700 transition-colors text-sm tracking-wide transition-all text-white rounded-xl font-semibold py-3.5 shadow-lg'
                            >
                                <MapPin size={16} /> I've Arrived at Pickup <ArrowRight size={16} className='ml-1'/>
                            </motion.button>
                        )}
                        {status==='confirmed' && otpMode && !otpVerified && (
                            <motion.div
                                initial ={{opacity: 0, scale: 0.95, y: 6}}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 6 }}
                                transition={{ duration: 0.25 }}
                                className='bg-zinc-50 border border-zonc-200 rounded-2xl overflow-hidden'
                            >
                                <div className='bg-zonc-900 px-4 py-3 flex items-center gap-2'>
                                    <KeyRound className='text-white' size={18}/>
                                    <p className='text-sm font-bold text-white tracking-wide uppercase'>Enter Customer Otp</p>
                                </div>
                                <div className='p-4 space-y-3'>
                                    <p className='text-sm text-zinc-500'>
                                        Ask the customer for their OTP to start the ride
                                    </p>
                                    <div className='flex items-center justify-center gap-2 mt-3'>
                                        <input type='text' value={otp} onChange={(e)=>{setOtp(e.target.value.replace(/\D/g, "")); setOtpError("")}}
                                            className={`flex-1 border-zinc-200 rounded-lg p-3 text-center text-lg font-bold tracking-widest focus:border-zinc-900 focus:ring-2 outline-none`}
                                            maxLength={4}
                                            placeholder='****'
                                            autoFocus
                                        />
                                    </div>
                                    {otpError && (
                                        <motion.p
                                            initial={{opacity: 0}}
                                            animate={{opacity: 1}}
                                            exit={{opacity: 0}}
                                            className='text-xs text-red-500 font-medium text-center tracking-wide'
                                        >
                                            {otpError}
                                        </motion.p>
                                    )}

                                    <div className='flex items-center gap-2 mt-3'>
                                        <button onClick={() => {setOtpMode(false); setOtp(""); setOtpError("")}} className='flex-1 border border-zonc-200 bg-white text-zonc-700 py-3 rounded-xl text-sm font-semibold active:scale-[0.97] transition-all'>
                                            Cancel
                                        </button>
                                        <button onClick={handleVerifyPickupOtp} disabled={otp.length < 4 || loadingOtp}
                                            className='flex-1 bg-zinc-900 text-white p-3.5 rounded-lg hover:bg-zinc-800 active:bg-zinc-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed transition-all'>
                                            {
                                                loadingOtp
                                                    ? <Loader2 size={18} className='animate-spin mx-auto'/>
                                                    : 'Verify OTP'
                                            }
                                        </button>
                                    </div>
                                    
                                </div>
                                
                            </motion.div>
                        )}
                        {status==='started' && !dropOtpMode && (
                            <motion.button
                                key='arrived'
                                initial={{opacity: 0, scale: 0.95, y: 6}}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 6 }}
                                transition={{ duration: 0.25 }}
                                onClick={handleSendDropOtp}
                                className='flex items-center justify-center gap-2 w-full bg-zinc-900 hover:bg-zinc-800 active:bg-zinc-700 transition-colors text-sm tracking-wide transition-all text-white rounded-xl font-semibold py-3.5 shadow-lg'
                            >
                                <Navigation size={16} /> Mark as Dropped <ArrowRight size={16} className='ml-1'/>
                            </motion.button>
                        )}
                        {status==='started' && dropOtpMode && (
                            <motion.div
                                initial ={{opacity: 0, scale: 0.95, y: 6}}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 6 }}
                                transition={{ duration: 0.25 }}
                                className='bg-zinc-50 border border-zonc-200 rounded-2xl overflow-hidden'
                            >
                                <div className='bg-zonc-900 px-4 py-3 flex items-center gap-2'>
                                    <KeyRound className='text-white' size={18}/>
                                    <p className='text-sm font-bold text-white tracking-wide uppercase'>Enter Customer Otp</p>
                                </div>
                                <div className='p-4 space-y-3'>
                                    <p className='text-sm text-zinc-500'>
                                        Ask the customer for their OTP to complete the ride
                                    </p>
                                    <div className='flex items-center justify-center gap-2 mt-3'>
                                        <input type='text' value={dropOtp} onChange={(e)=>{setDropOtp(e.target.value.replace(/\D/g, "")); setDropOtpError("")}}
                                            className={`flex-1 border-zinc-200 rounded-lg p-3 text-center text-lg font-bold tracking-widest focus:border-zinc-900 focus:ring-2 outline-none`}
                                            maxLength={4}
                                            placeholder='****'
                                            autoFocus
                                        />
                                    </div>
                                    {dropOtpError && (
                                        <motion.p
                                            initial={{opacity: 0}}
                                            animate={{opacity: 1}}
                                            exit={{opacity: 0}}
                                            className='text-xs text-red-500 font-medium text-center tracking-wide'
                                        >
                                            {dropOtpError}
                                        </motion.p>
                                    )}

                                    <div className='flex items-center gap-2 mt-3'>
                                        <button onClick={() => {setDropOtpMode(false); setDropOtp(""); setDropOtpError("")}} className='flex-1 border border-zonc-200 bg-white text-zonc-700 py-3 rounded-xl text-sm font-semibold active:scale-[0.97] transition-all'>
                                            Cancel
                                        </button>
                                        <button onClick={handleVerifyDropOtp} disabled={dropOtp.length < 4 || loadingDropOtp}
                                            className='flex-1 bg-zinc-900 text-white p-3.5 rounded-lg hover:bg-zinc-800 active:bg-zinc-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed transition-all'>
                                            {
                                                loadingDropOtp
                                                    ? <Loader2 size={18} className='animate-spin mx-auto'/>
                                                    : 'Verify OTP'
                                            }
                                        </button>
                                    </div>
                                    
                                </div>
                                
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>


            </motion.div>
        </div>

    </div>
  )
}

export default page