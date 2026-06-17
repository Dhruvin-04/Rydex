'use client'
import React, { useEffect, useState } from 'react'
import {motion} from 'motion/react'
import axios from 'axios'
import { BookingStatus, PaymentStatus } from '@/models/booking.model'
import { Clock, IndianRupee, Loader2, MapPin, Navigation } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { getSocket } from '@/lib/socket'

interface IBooking{
    _id: string;
    user: string;
    driver: string;
    vehicle: string;
    pickupAddress: string;
    dropAddress: string;
    pickupLocation: {
        type: "Point",
        coordinates: [number, number]
    },
    dropLocation: {
        type: "Point",
        coordinates: [number, number]
    },
    fare: number;
    userMobile: string;
    driverMobile: string;
    bookingStatus: BookingStatus;
    paymentStatus: PaymentStatus;
    paymentDeadline: Date;
    adminCommission: number;
    partnerEarnings: number;
    pickupOtp: string;
    pickupOtpExpires: Date;
    dropOtp: string;
    dropOtpExpires: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

const page = () => {
  const router = useRouter()
  const [bookings, setBookings] = useState<IBooking[]>([])
  const [loading, setLoading] = useState(true)

  const pendingRequests = async () => {
    try{
      setLoading(true)
      const {data} = await axios.get('/api/partner/bookings/pending')
      setBookings(data)
      setLoading(false)
      console.log('Pending requests:', data)
    }catch(error){
      console.error('Error fetching pending requests:', error)
      setLoading(false)
    }
  }

  const handleAccept = async (id: string) => {
    try{
      const {data} = await axios.get(`/api/partner/bookings/${id}/accept`)
      router.push(`/partner/bookings`)
    }catch(error){
      console.error('Error accepting booking:', error)
    }
  }
  const handleReject = async (id: string) => {
    try{
      const {data} = await axios.get(`/api/partner/bookings/${id}/reject`)
      window.location.reload()
    }catch(error){
      console.error('Error rejecting booking:', error)
    }
  }

  useEffect(() => {
    pendingRequests()
  }, [])

  useEffect(() => {
    const socket = getSocket()
    socket.on('newBooking', (data) => {
      setBookings(prev => [data, ...prev])
    })
    return () => {
      socket.off('newBooking')
    }
  }, [])
  
  return (
    <div className='w-full min-h-screen'>
      <div className='bg-white border-b border-gray-200'>
        <div className='max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8'>
          <h1 className='text-2xl font-bold text-gray-900'>Ride Requests</h1>
          <p className='text-gray-500'>Manage your pending ride requests</p>
        </div>
      </div>
      <div className='max-w-7xl mx-auto py-6 sm:px-6 lg:px-8'>
        {loading ? (
            <div className='flex justify-center py-20'> 
              <Loader2 size={24} className='animate-spin text-gray-500' />
            </div>
          ):bookings.length === 0 ? (
            <div className='bg-white rounded-2xl shadow-sm p-6 border-gray-200 text-center'>
              <p className='text-gray-500'>No pending requests at the moment</p>
            </div>
          ):(
            <div className='space-y-6'>
              {bookings.map((booking, index) => (
                <motion.div 
                  key={index} 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: index * 0.1 }} 
                  className='bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow p-6 border-gray-200'
                >
                  <div className='flex flex-col lg:flex-row lg:items-center justify-between gap-8'>
                    <div className='flex-1 space-y-6'>
                      <div className='flex items-center gap-4'>
                        <div className='bg-gray-100 p-3 rounded-lg flex items-center justify-center'><MapPin size={18}/></div>
                        <div>
                          <p  className='text-sm text-gray-500 uppercase mb-1'>Pickup Location</p>
                          <p className='font-medium text-gray-900'>{booking.pickupAddress}</p>
                        </div>
                      </div>

                      <div className='flex items-center gap-4'>
                        <div className='bg-gray-100 p-3 rounded-lg flex items-center justify-center'><Navigation  size={18}/></div>
                        <div>
                          <p  className='text-sm text-gray-500 uppercase mb-1'>Drop Location</p>
                          <p className='font-medium text-gray-900'>{booking.dropAddress}</p>
                        </div>
                      </div>

                      <div className='flex items-center gap-2 text-sm text-gray-500 mt-2'>
                        <Clock size={16} className='opacity-70'/>
                        <span className='font-medium'>
                          {new Date(booking.createdAt!).toLocaleString('en-IN', {
                            month: 'short',
                            day: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>

                    <div className='flex flex-col justify-between lg:items-end gap-4 w-full lg:w-auto'> 
                        <div className='text-left lg:text-right'>
                          <p className='text-sm text-gray-500 uppercase mb-1'>Estimated Fare</p>
                          <div className='text-gray-900 font-bold text-3xl flex items-center lg:justify-end gap-1'>
                            <IndianRupee size={20}/>
                            {booking.fare}
                          </div>
                        </div>
                        <div className='flex gap-4 w-full lg:w-auto'>
                          <button className='flex-1 lg:flex-none px-6 py-3 rounded-xl border border-gray-300 bg-white text-gray-700 text-sm font-semibold hover:bg-gray-100 transition-all duration-200 active:scale-[0.98] disabled:opacity-50' onClick={() => handleReject(booking._id)}>
                            Reject
                          </button>
                          <button className='flex-1 lg:flex-none px-6 py-3 rounded-xl border border-transparent bg-black text-white text-sm font-semibold hover:bg-gray-900 transition-all duration-200 active:scale-[0.98] disabled:opacity-50 shadow-md flex items-center justify-center gap-2' onClick={() => handleAccept(booking._id)}>
                            Accept Ride
                          </button>
                        </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )
        }
      </div>
    </div>
  )
}

export default page