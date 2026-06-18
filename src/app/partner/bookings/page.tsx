'use client'
import { BookingStatus, PaymentStatus } from '@/models/booking.model';
import { IUser } from '@/models/user.model';
import { IVehicle } from '@/models/vehicle.model';
import axios from 'axios'
import { Bike, Calendar, Car, ChevronRight, IndianRupee, Loader2, MapPin, Phone, Truck, User } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { useRouter } from 'next/navigation';

interface IBooking {
  user: IUser;
  driver: IUser;
  vehicle: IVehicle;
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
  const [selectStatus, setSelectStatus] = useState("All")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      try {
        const { data } = await axios.get('/api/partner/bookings')
        console.log(data)
        setBookings(data.bookings)
        setLoading(false)
      } catch (error: any) {
        console.log(error.response.data.message)
        setLoading(false)
      }
    }
    fetch()
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).replace(',', '');
  }

  const getStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      requested: "bg-yellow-100 text-yellow-800",
      awaiting_payment: "bg-orange-100 text-orange-800",
      confirmed: "bg-emerald-100 text-emerald-800",
      cancelled: "bg-rose-100 text-rose-800",
      completed: "bg-teal-100 text-teal-800",
      rejected: "bg-red-100 text-red-800",
      expired: "bg-purple-100 text-purple-800"
    }
    return statusColors[status] || "bg-gray-100 text-gray-800"
  }

  const getVehicleIcon = (vehicleType: string) => {
    switch (vehicleType?.toLowerCase()) {
      case 'bike':
        return <Bike className='w-4 h-4 text-gray-400' />
      case 'auto':
      case 'car':
        return <Car className='w-4 h-4 text-gray-400' />
      case 'truck':
      case 'loading':
        return <Truck className='w-4 h-4 text-gray-400' />
    }
  }

  const filter = selectStatus === "All" ? bookings : bookings.filter(booking => booking.bookingStatus === selectStatus.toLowerCase())

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='bg-white border-b border-gray-200'>
        <div className='max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8'>
          <div className='max-w-3xl mx-auto p-6'>
            <div className='flex items-center gap-3'>
              <div className='bg-blue-100 p-2 rounded-lg'>
                <Car className='w-5 h-5 text-blue-600' />
              </div>
              <div>
                <h1 className='text-2xl font-semibold text-gray-900'>Partner Bookings</h1>
                <p className='text-gray-500 text-sm mt-1'>
                  {bookings.length} {bookings.length === 1 ? "ride" : "rides"} assigned to you
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-3xl mx-auto'>
          <div className='flex justify-between items-center mb-6'>
            <div className='text-sm text-gray-500'>
              Showing {filter.length} bookings
            </div>
            <select
              value={selectStatus}
              onChange={(e) => { setSelectStatus(e.target.value) }}
              className='bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600'
            >
              <option>All</option>
              <option>Requested</option>
              <option>Awaiting_payment</option>
              <option>Confirmed</option>
              <option>Started</option>
              <option>Completed</option>
              <option>Rejected</option>
              <option>Expired</option>
            </select>
          </div>
          {
            loading && (
              <div className='flex justify-center items-center py-16'>
                <Loader2 className='animate-spin w-8 h-8 text-black' />
              </div>
            )
          }
          {
            !loading && filter.length === 0 && (
              <div className='bg-white rounded-xl shadow-sm p-12 text-center'>
                <Car className='w-12 h-12 text-gray-300 mx-auto mb-3' />
                <h1 className='text-lg font-medium text-gray-900'>No bookings yet</h1>
                <p className='text-gray-500 mt-1 text-sm'>When customers book rides, they'll appear here</p>
              </div>
            )
          }
          {
            !loading && filter.length > 0 && (
              <div className='space-y-4'>
                {filter.map((booking, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className='bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all overflow-hidden'>
                      <div className='flex items-center gap-3 p-4 bg-linear-to-r from-blue-50 to-indigo-50 border-b border-gray-20'>
                        <div className='w-12 h-12 rounded-full overflow-hidden bg-blue-200 shrink-0 border-2 border-white shadow-sm flex items-center justify-center'>
                          <User className='w-6 h-6 text-blue-600' />
                        </div>
                        <div className='flex-1'>
                          <div className='flex items-center justify-between'>
                            <h3 className='font-semibold text-gray-900'>{booking.user.name.toUpperCase() || 'Customer'}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.bookingStatus)}`}>{booking.bookingStatus}</span>
                          </div>
                          <div className='text-sm text-gray-500 flex items-center gap-1 mt-1'>
                            <Phone className='w-4 h-4 text-gray-400' />
                            <span>{booking.userMobile || 'N/A'}</span>
                          </div>

                        </div>
                      </div>

                      <div className='px-4 pt-3'>
                        <div className='bg-gray-50 rounlged-lg p-2 flex items-center'>
                          {getVehicleIcon(booking.vehicle?.type || 'car')}
                          <div className='ml-3 text-xs font-medium text-gray-700'>
                            {booking.vehicle?.model} - {booking.vehicle?.licensePlate || 'Not assigned'}
                          </div>
                        </div>
                      </div>

                      <div className='p-4 space-y-3'>
                        <div className='flex items-start gap-3'>
                          <div className='shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center'>
                            <MapPin className='w-3 h-3 text-green-600' />
                          </div>
                          <div className='flex-1 font-medium'>
                            <span className='text-xs font-medium text-green-600 tracking-wider'>
                              PICK UP
                            </span>
                            <p className='text-sm text-gray-600 mt-0.5 leading-relaxed'>
                              {booking.pickupAddress}
                            </p>
                          </div>
                        </div>
                        <div className='flex items-start gap-3'>
                          <div className='shrink-0 w-6 h-6 bg-red-100 rounded-full flex items-center justify-center'>
                            <MapPin className='w-3 h-3 text-red-600' />
                          </div>
                          <div className='flex-1 font-medium'>
                            <span className='text-xs font-medium text-red-600 tracking-wider'>
                              DROP
                            </span>
                            <p className='text-sm text-gray-600 mt-0.5 leading-relaxed'>
                              {booking.dropAddress}
                            </p>
                          </div>
                        </div>

                      </div>

                      <div className='px-4 py-3 bg-gray-50 flex items-center justify-between border-t border-gray-200'>
                        <div className='flex items-center gap-2 text-sm'>
                          <Calendar className='w-4 h-4 text-gray-400' />
                          <span>{formatDate(booking.createdAt?.toString()!)}</span>
                        </div>
                        <div className='flex items-center gap-1 font-semibold text-gray-900'>
                          <IndianRupee className='w-4 h-4 text-gray-400' />
                          <span>{booking.fare.toFixed(2)}</span>
                        </div>
                      </div>

                      <div className='px-4 py-3 bg-gray-50 flex items-center justify-between border-t border-gray-200'>
                        <div className='flex items-center gap-2 text-sm'>
                          <span className='text-gray-500'>Payment Status:</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${booking.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-700'}`}>
                            {booking.paymentStatus}
                          </span>
                        </div>
                        {(booking.bookingStatus === 'completed' || booking.bookingStatus === 'confirmed' || booking.bookingStatus === 'started' ) && (
                          <div className='flex items-center gap-2'>
                            <button
                              onClick={() => {
                                router.push(`/partner/active-ride`)
                              }}
                              className='flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-md transition'
                            >
                              <span>Details</span>
                              <ChevronRight className='w-4 h-4 text-gray-400' />
                            </button>
                          </div>
                        )}
                      </div>


                    </div>
                  </motion.div>
                ))}
              </div>
            )
          }
        </div>
      </div>
    </div>
  )
}

export default page