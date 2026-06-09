'use client'
import React, { useState, Suspense, useEffect } from 'react'
import {AnimatePresence, motion} from 'motion/react'
import { ArrowLeft, Bike, Car, MapPin, Navigation, RefreshCcw, Search, Truck, Zap } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { vehicleType } from '@/models/vehicle.model'
import { param } from 'motion/react-client'
import dynamic from 'next/dynamic'
import axios from 'axios'
import VehicleCard from '@/components/VehicleCard'

const SearchMap = dynamic(() => import('@/components/SearchMap'), { ssr: false })

const VEHICLE_META: any = {
  bike: { label: 'Bike', Icon: Bike },
  auto: { label: 'Auto', Icon: Car },
  car: { label: 'Car', Icon: Car },
  loading: { label: 'Loading', Icon: Truck },
  truck: { label: 'Truck', Icon: Truck },
}

export interface IVehicle {
    _id: string;
    owner: string
    type: vehicleType;
    imageUrl?: string;
    model: string;
    baseFare?: number;
    pricePerKm?: number;
    waitingCharge?: number;
    licensePlate: string;
    status: "approved" | "pending" | "rejected";
    rejectionReason?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}


const SearchContent = () => {
  const router = useRouter()
  const params = useSearchParams()
  const [pickup, setPickup] = useState(params.get('pickup') || '')
  const [drop, setDrop] = useState(params.get('drop') || '')
  const [km, setKm] = useState<number>(0)
  const mobile = params.get('mobile') || ''
  const pickUpLat = Number(params.get('pickUpLatitude'))
  const pickUpLng = Number(params.get('pickUpLongitude'))
  const dropLat = Number(params.get('dropLatitude'))
  const dropLng = Number(params.get('dropLongitude'))
  const vehicle = params.get('vehicle') || ''
  const [vehicles, setVehicles] = useState<IVehicle[]>([])
  const [loading, setLoading] = useState(false)
  const meta = VEHICLE_META[vehicle]

  const getNearbyVehicles = async (latitude: number, longitude: number, vehicleType: string | null) => {
  if (!latitude || !longitude || !vehicleType) return;
  console.log('Fetching nearby vehicles with:', { latitude, longitude, vehicleType })
  setLoading(true)
  try{
    const {data} = await axios.post('/api/vehicles/near-by', {
      latitude,
      longitude,
      vehicleType
    })
    setLoading(false)
    setVehicles(data)
  }catch(err){
    console.error('Error fetching nearby vehicles:', err)
    setLoading(false)
  }
}

useEffect(() => {
  getNearbyVehicles(pickUpLat, pickUpLng, vehicle)
}, [pickUpLat, pickUpLng, pickup]) 
    
  return (
    <div className='min-h-screen bg-zinc-100 text-zinc-900 overflow-x-hidden'>
      <div className='absolute top-5 left-5 z-50'>
        <motion.div
          whileTap={{scale: 0.88}}
          onClick={() => router.back()}
          className='w-11 h-11 rounded-full bg-white flex items-center justify-center cursor-pointer shadow-md'
        >
          <ArrowLeft size={17} className='text-zinc-900'/>
        </motion.div>
      </div>
      <div className='relative w-full h-[52vh] z-0'>
        <SearchMap pickup={pickup} drop={drop} onChange={(p, d) => {setPickup(p); setDrop(d)}} onDistance={setKm}/>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className='relative z-50 -mt-10 rounded-t-[28px] border-t border-zinc-200 shadow-[0_-8px_40px_rgba(0,0,0,0.08)] pt-5 pb-20 min-h-[52vh]'
        transition={{ type: 'spring', stiffness: 160, damping: 22 }}
      >
        <div className='px-5 lg:px-8 max-w-6xl mx-auto'>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{delay: 0.12}}
            className='bg-zinc-100 border border-zinc-200 rounded-2xl overflow-hidden mb-4'
          >
            <div className='flex gap-3 px-4 py-3 border-b border-zinc-100'>
              <div className='flex flex-col items-center pt-2 shrink-0'>
                <div className='w-3 h-3 bg-zinc-900 rounded-full'/>
                <div className='w-px flex-1 bg-zinc-300 my-1' style={{minHeight: 14}}/>
              </div>
              <div className='flex-1 flex flex-col gap-2 py-1'>
                <p className='text-sm text-zinc-500'>Pickup</p>
                <p className='text-lg'>{pickup || '-'}</p>
              </div>
              <MapPin size={18} className='text-zinc-400 shrink-0 mt-2'/>
            </div>
            <div className='flex gap-3 px-4 py-3 border-b border-zinc-100'>
              <div className='flex flex-col items-center pt-2 shrink-0'>
                <div className='w-3 h-3 bg-zinc-900 rounded-full'/>   
              </div>
              <div className='flex-1 flex flex-col gap-2 py-1'>
                <p className='text-sm text-zinc-500'>Drop</p>
                <p className='text-lg'>{drop || '-'}</p>
              </div>
              <Navigation size={18} className='text-zinc-400 shrink-0 mt-2'/>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{delay: 0.16}}
            className='flex items-baseline justify-between mb-4'
          >
            <div>
              <h2 className='text-lg font-medium text-zinc-900 tracking-tight'>
                {loading ? 'Finding vehicles...' : vehicles.length > 0 ? `Available` : 'No nearby vehicles found'}
              </h2>
              {
                meta && <div className='text-sm text-zinc-500 mt-1'>
                  {meta.label} rides nearby you
                </div>
              }
            </div>
            <AnimatePresence mode='wait'>
                  {loading ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className='text-sm text-zinc-500 flex items-center gap-1 rounded-full'
                    >
                      <div className='w-3 h-3 bg-zinc-500 rounded-full'/>
                      <span className='text-sm text-zinc-500'>Searching...</span>
                    </motion.div>
                  ):
                    vehicles.length > 0 ? (
                      <motion.div
                        key='live'
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className='text-sm bg-emerald-50 border border-emerald-200 flex items-center gap-1 rounded-full py-2 px-3 text-emerald-600'
                      >
                        <Zap size={11} className='text-emerald-600' fill='currentColor'/>
                        <span className='text-sm font-bold text-emerald-700'>Live</span>
                      </motion.div>
                    ):null
                  }
            </AnimatePresence>   
          </motion.div>
          <AnimatePresence>
              {vehicles.length == 0 && !loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className='text-sm text-zinc-500 mt-6 flex flex-col items-center gap-2'
                >
                  <div className='w-16 h-16 bg-zinc-200 rounded-full flex items-center justify-center'>
                    <Search size={24} className='text-zinc-500'/>
                  </div>
                  <p className='text-zinc-900 font-bold text-base mb-1'>Vehicles Not Found</p>
                  <p className='text-sm text-zinc-500'>Try adjusting your pickup location or check back later.</p>
                  <motion.button
                    whileTap={{scale: 0.88}}
                    onClick={() => getNearbyVehicles(pickUpLat, pickUpLng, vehicle)}
                    className='mt-5 rounded-2xl flex items-center cursor-pointer shadow-md gap-2 bg-zinc-900 text-white text-sm font-semibold px-6 py-3 hover:bg-zinc-800 transition-colors'
                  >
                    <RefreshCcw size={20} />Retry Search
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4'>
              {vehicles.map((v, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{delay: i * 0.06, duration: 0.4, ease:[0.22, 1, 0.36, 1]}}
                >
                  <VehicleCard 
                    vehicle={v}
                    distance={km}
                    onBook={() => {
                      const url = new URLSearchParams({
                        pickup,
                        drop,
                        vehicle: v.type,
                        vehicleId: String(v._id),
                        driverId: v.owner,
                        fare: String(Math.round((v.baseFare || 0) + (v.pricePerKm || 0) * km)),
                        pickUpLatitude: String(pickUpLat),
                        pickUpLongitude: String(pickUpLng),
                        dropLatitude: String(dropLat),
                        dropLongitude: String(dropLng),
                        mobile,
                      })
                      router.push(`/user/checkout?${url.toString()}`)
                    }}
                  />
                </motion.div>
              ))}
            </div>
        </div>
      </motion.div>
    </div>
  )
}

const page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchContent />
    </Suspense>
  )
}

export default page