'use client'
import LiveRideMap from '@/components/LiveRideMap'
import { BookingStatus, IBooking } from '@/models/booking.model'
import axios from 'axios'
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

const page = () => {
    const [booking, setBooking] = useState<IBooking | null>(null)
    const [loading, setLoading] = useState(false)
    const [driverPos, setDriverPos] = useState<[number, number] | null>(null)
    const [pickUpPos, setPickUpPos] = useState<[number, number] | null>(null)
    const [dropPos, setDropPos] = useState<[number, number] | null>(null)
    useEffect(() => {
        async function fetch() {
            setLoading(true)
            try {
                const {data} = await axios.get('/api/partner/my-active')
                console.log('Active booking:', data)
                setBooking(data)
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
            />
        </div>
    </div>
  )
}

export default page