'use client'
import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, Banknote, Bike, Car, CheckCircle, Clock, CreditCard, IndianRupee, Loader2, MapPin, Navigation, Shield, Truck, Wallet, XCircle } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import axios from 'axios'

const VEHICLE_META: any = {
    bike: { label: 'Bike', Icon: Bike },
    auto: { label: 'Auto', Icon: Car },
    car: { label: 'Car', Icon: Car },
    loading: { label: 'Loading', Icon: Truck },
    truck: { label: 'Truck', Icon: Truck },
}

type Status = "idle" | "requested" | "awaiting_payment" | "confirmed" | "payment" | "rejected" | "expired";

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
    const { Icon, label } = VEHICLE_META[vehicle]
    const [status, setStatus] = useState<Status>("idle")
    const [handle, setHandle] = useState<Status>('idle')
    const [booking, setBooking] = useState<any>('')
    const [loading, setLoading] = useState(false)
    const [paymentMethod, setPaymentMethod] = useState<"cash" | "online">("cash")
    const handleRequestBooking = async () => {
        setLoading(true)
        try {
            const { data } = await axios.post('/api/booking/create', {
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
            setLoading(false)
            setStatus('requested')
            setBooking(data.booking)
        } catch (error: any) {
            setLoading(false)
            console.log(error.response?.data || error.message)
        }
    }

    const fetchActiveBooking = async () => {
        try {
            const { data } = await axios.get('/api/booking/active')
            console.log(data)
            setBooking(data.booking)
            setStatus(data.booking?.bookingStatus || data.booking)
        } catch (error) {
            console.log('Error fetching active booking:', error)
        }
    }
    const handleCancelBooking = async () => {
        try{
            const { data } = await axios.get(`/api/booking/${booking._id}/cancel`)
            console.log(data)
            setStatus('idle')
        }catch(error){
            console.log('Error cancelling booking:', error)
        }
    }

    const handleConfirmPayment = async () => {
        try{
            const { data } = await axios.post('/api/payment/create', {
                bookingId: booking._id,
                paymentMode: paymentMethod.toUpperCase()
            })
            if (data.url) {
                window.location.href = data.url
            }
        }catch(error){
            console.log('Error confirming payment:', error)
        }
    }

    useEffect(() => {
        fetchActiveBooking()
    }, [])
    useEffect(() => {
        if(status !== 'awaiting_payment') return
        const t = setTimeout(() => {
            setStatus('payment')
        }, 2000)
        return () => clearTimeout(t)
    }, [status])
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
                        <div className='h-px w-8 bg-zinc-900' />
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
                        <div className='h-1 bg-zinc-900' />
                        <div className='p-8 sm:p-10'>
                            <div className='flex items-center gap-4 mb-6 justify-between'>
                                <div>
                                    <div className='font-black text-zinc-700 uppercase tracking-wider text-sm'>Selected Vehicle</div>
                                    <div className='text-2xl font-bold text-zinc-900 tracking-tight'>{label}</div>
                                </div>
                                <div className='w-14 h-14 rounded-full bg-zinc-900 flex items-center justify-center'>
                                    <Icon size={28} className='text-white' />
                                </div>
                            </div>

                            <div className='bg-zinc-50 border border-zinc-100 rounded-lg p-4 mb-6 overflow-hidden'>
                                <div className='flex gap-4 px-5 py-4 border-b border-zinc-100'>
                                    <div className='flex flex-col items-center shrink-0 pt-0.5'>
                                        <div className='w-3 h-3 rounded-full bg-zinc-900 border-2 border-white ring ring-zinc-300' />
                                        <div className='w-px flex-1 bg-zinc-300 my-1' style={{ minHeight: 12 }} />
                                    </div>
                                    <div className='flex-1 min-w-0'>
                                        <div className='text-[0.625rem] font-black uppercase tracking-[0.18em] text-zinc-400 mb-1'>Pickup</div>
                                        <div className='text-sm font-semibold text-zinc-900 leading-snug truncate'>{pickup || 'Not specified'}</div>
                                    </div>
                                    <MapPin size={20} className='text-zinc-400 shrink-0 mt-1' />
                                </div>

                                <div className='flex gap-4 px-5 py-4 border-b border-zinc-100'>
                                    <div className='flex flex-col items-center shrink-0 pt-0.5'>
                                        <div className='w-3 h-3 rounded-full bg-zinc-900 border-2 border-white ring ring-zinc-300' />
                                    </div>
                                    <div className='flex-1 min-w-0'>
                                        <div className='text-[0.625rem] font-black uppercase tracking-[0.18em] text-zinc-400 mb-1'>Drop</div>
                                        <div className='text-sm font-semibold text-zinc-900 leading-snug truncate'>{drop || 'Not specified'}</div>
                                    </div>
                                    <Navigation size={20} className='text-zinc-400 shrink-0 mt-1' />
                                </div>
                            </div>

                            <div className='flex items-end justify-between pt-6 border-t border-zinc-100'>
                                <div>
                                    <p className='text-[10px] font-bold text-zinc-900 uppercase tracking=[0.18em]'>Total Fare</p>
                                    <p className='text-sm font-medium text-zinc-600'>Includes base + distance charges</p>
                                </div>
                                <motion.div
                                    initial={{ scale: 0.95, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 0.2, type: 'spring', stiffness: 200, damping: 20 }}
                                    className='text-2xl font-bold text-zinc-900 flex items-baseline gap-1'
                                >
                                    <span className='text-lg font-bold text-zinc-400'><IndianRupee /></span>
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
                        <div className='h-1 bg-zinc-900' />
                        <div className='p-6 sm:p-8 flex flex-col gap-6 flex-1'>
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
                                                            { icon: <Clock size={14} />, text: "Estimated arrival time, 2 mins" },
                                                            { icon: <Shield size={14} />, text: "Verified & Insured drivers only" },
                                                            { icon: <CreditCard size={14} />, text: "Pay after driver accepts" },

                                                        ].map((item, index) => (
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
                                                <span className='flex items-center gap-2'>Request Ride <ArrowRight size={16} /></span>
                                            </motion.button>
                                        </motion.div>
                                    )
                                }
                                {
                                    status === "requested" && (
                                        <motion.div
                                            key="requested"
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.35 }}
                                            className='flex flex-1 flex-col items-center text-center gap-6 justify-center'
                                        >
                                            <div className='relative w-20 h-20 flex items-center justify-center'>
                                                <motion.div
                                                    animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
                                                    transition={{ duration: 2, repeat: Infinity }}
                                                    className='absolute inset-0 rounded-full bg-zinc-900'
                                                />
                                                <div className='w-20 h-20 rounded-full bg-zinc-100 flex items-center justify-center relative z-10 border-2 border-zinc-300'>
                                                    <Loader2 size={28} className='animate-spin text-zinc-900' />
                                                </div>


                                            </div>
                                            <div>
                                                <h3 className='text-xl font-black text-zinc-900 mb-1'>Finding Your Driver</h3>
                                                <p className='text-zinc-600 text-sm font-medium'>Please wait while we connect you with a nearby driver.</p>
                                            </div>
                                            <motion.div
                                                whileTap={{ scale: 0.95 }}
                                                className='px-6 py-3 rounded-xl border border-gray-300 bg-white text-gray-700 text-sm font-semibold hover:bg-gray-100 transition-all duration-200 active:scale-[0.98] disabled:opacity-50 cursor-not-allowed flex items-center justify-center gap-2'
                                                onClick={handleCancelBooking}
                                            >
                                                <XCircle size={16} />
                                                Cancel Request
                                            </motion.div>
                                        </motion.div>
                                    )
                                }
                                {
                                    status === "awaiting_payment" && (
                                        <motion.div
                                            key="awaiting_payment"
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.35 }}
                                            className='flex flex-1 flex-col items-center text-center gap-6 justify-center'
                                        >
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ duration: 0.5, type: 'spring', stiffness: 300, damping: 20 }}
                                                className='w-20 h-20 rounded-full bg-zinc-100 flex items-center justify-center relative z-10 border-2 border-zinc-300'
                                            >
                                                <CheckCircle size={28} className='text-zinc-900' />
                                            </motion.div>
                                            <div>
                                                <h3 className='text-xl font-black text-zinc-900 mb-1'>Driver Accepted</h3>
                                                <p className='text-zinc-600 text-sm font-medium'>We are getting everything ready for your payment.</p>
                                            </div>
                                            <div className='w-48 h-1.5 bg-zinc-300 rounded-full overflow-hidden'>
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: "100%" }}
                                                    transition={{ duration: 2, ease: "easeInOut" }}
                                                    className='h-full bg-zinc-900 rounded-full'
                                                />
                                            </div>
                                        </motion.div>
                                    )
                                }
                                {
                                    status === "payment" && (
                                        <motion.div
                                            key="payment"
                                            initial={{ opacity: 0, y: 12 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.35 }}
                                            className='flex flex-col flex-1 gap-4'
                                        >
                                            <div>
                                                <p className='font-black text-zinc-500 uppercase tracking-wider text-sm'>Almost there!</p>
                                                <h3 className='text-2xl font-bold text-zinc-900 tracking-tight'>Select Payment Method</h3>
                                            </div>
                                            <div className='flex flex-col gap-4'>
                                                {[
                                                    { id: "cash", Icon: Banknote, title: "Cash", sub: "Pay with cash directly to the driver" },
                                                    { id: "online", Icon: Wallet, title: "Online Payment", sub: "UPI, Card, Net Banking" },
                                                ].map((method, index) => {
                                                    const active = paymentMethod === method.id
                                                    return(
                                                        <motion.div
                                                            key={index}
                                                            whileTap={{ scale: 0.98 }}
                                                            onClick={() => setPaymentMethod(method.id as any)}
                                                            className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all duration-200 ${active ? 'border-zinc-900 bg-zinc-900' : 'border-zinc-300 bg-white'} cursor-pointer`}
                                                        >
                                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${active ? 'bg-zinc-700 text-white' : 'bg-zinc-200 text-zinc-600'}`}>
                                                                <method.Icon size={20} className={active ? 'text-white' : 'text-zinc-600'} />
                                                            </div>
                                                            <div className='flex-1 min-w-0'>
                                                                <p className={`font-bold text-sm ${active ? 'text-white' : 'text-zinc-900'}`}>{method.title}</p>
                                                                <p className={`text-sm ${active ? 'text-zinc-300' : 'text-zinc-600'}`}>{method.sub}</p>
                                                            </div>
                                                            <AnimatePresence>
                                                                {active && (
                                                                    <motion.div
                                                                        initial={{ scale: 0, opacity: 0 }}
                                                                        animate={{ scale: 1, opacity: 1 }}
                                                                        exit={{ scale: 0, opacity: 0 }}
                                                                        transition={{ duration: 0.3 }}
                                                                        className='text-green-500'
                                                                    >
                                                                        <CheckCircle size={20} className='text-gray-200' />
                                                                    </motion.div>
                                                                )}
                                                            </AnimatePresence>
                                                            
                                                        </motion.div>
                                                    )
                                                })}
                                            </div>
                                            <motion.button
                                                onClick={handleConfirmPayment}
                                                whileTap={{ scale: 0.95 }}    
                                                whileHover={paymentMethod ? { scale: 1.05 }:{}}        
                                                disabled={!paymentMethod}
                                                className={`w-full h-14 mt-4 bg-zinc-900 hover:bg-black text-white font-bold text-sm rounded-2xl flex items-center justify-center gap-3 transition-colors shadow-md ${!paymentMethod && 'cursor-not-allowed opacity-50'}`}  
                                            >
                                                {paymentMethod === "cash" ? (
                                                    <>
                                                        <Banknote size={16} />
                                                        <span>Confirm Cash Ride</span>
                                                    </>
                                                ):(
                                                    <>
                                                        <Wallet size={16} />
                                                        <span>Proceed to Payment</span>
                                                        <ArrowRight size={16} />
                                                    </>
                                                )
                                                }
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