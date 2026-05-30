'use client'
import React, { useState, Suspense, useEffect } from 'react'
import {motion} from 'motion/react'
import { ArrowLeft, MapPin, Navigation } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { vehicleType } from '@/models/vehicle.model'
import { param } from 'motion/react-client'
import dynamic from 'next/dynamic'
import axios from 'axios'

const SearchMap = dynamic(() => import('@/components/SearchMap'), { ssr: false })



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
  const vehicle = params.get('vehicle')

  const getNearbyVehicles = async (latitude: number, longitude: number, vehicleType: string | null) => {
  if (!latitude || !longitude || !vehicleType) return;
  console.log('Fetching nearby vehicles with:', { latitude, longitude, vehicleType })
  try{
    const {data} = await axios.post('/api/vehicles/near-by', {
      latitude,
      longitude,
      vehicleType
    })
    console.log('Nearby Vehicles:', data)
  }catch(err){
    console.error('Error fetching nearby vehicles:', err)
  }
}

useEffect(() => {
  getNearbyVehicles(pickUpLat, pickUpLng, vehicle)
}, [pickUpLat, pickUpLng])
    
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