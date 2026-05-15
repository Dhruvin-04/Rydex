'use client'
import React, { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowLeft, Bike, Car, CheckCircle, ChevronRight, LocateFixed, MapPin, Navigation, Phone, Pilcrow, Truck } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { vehicleType } from '@/models/vehicle.model'
import { label, s } from 'motion/react-client'
import { set } from 'mongoose'
import axios from 'axios'

const stepVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0 }
}

const Vehicles = [
    { id: "bike", label: "Bike", Icon: Bike, desc: "Quick & Affordable" },
    { id: "car", label: "Car", Icon: Car, desc: "Comfort Rides" },
    { id: "auto", label: "Auto", Icon: Car, desc: "Everyday Rides" },
    { id: "loading", label: "Loading", Icon: Truck, desc: "Small Cargo" },
    { id: "truck", label: "Truck", Icon: Truck, desc: "Heavy Transports" },
]

type Place = {
    id: string,
    name: string,
    city?: string,
    state?: string,
    country?: string,
    latitude: number,
    longitude: number
    countryCode?: string
}

const page = () => {
    const router = useRouter()
    const [vehicle, setVehicle] = useState<vehicleType>()
    const [mobile, setMobile] = useState('')
    const [pickup, setPickup] = useState('')
    const [drop, setDrop] = useState('')
    const [pickUpCountry, setPickUpCountry] = useState('')
    const [pickUpLatitude, setPickUpLatitude] = useState<Number>()
    const [pickUpLongitude, setPickUpLongitude] = useState<Number>()
    const [dropCountry, setDropCountry] = useState('')
    const [dropLatitude, setDropLatitude] = useState<Number>()
    const [dropLongitude, setDropLongitude] = useState<Number>()
    const [locating, setLocating] = useState(false)
    const [pickupSuggestions, setPickupSuggestions] = useState<Place[]>([])
    const [dropSuggestions, setDropSuggestions] = useState<Place[]>([])
    const canContinue = !!(vehicle && mobile && pickup && drop && pickUpLatitude && pickUpLongitude && dropLatitude && dropLongitude)
    const progress = [!!vehicle, !!(mobile.length == 10), !!pickup, !!drop].filter(Boolean).length
    const useCurrentLocation = ()=>{
        setLocating(true)
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(async ({coords})=>{
                try {
                    const {data} = await axios.get(`https://photon.komoot.io/reverse?lon=${coords.longitude}&lat=${coords.latitude}`)
                    if(data.features.length){
                        const p = data.features[0].properties
                        const address = [p.name, p.street, p.city, p.state, p.country].filter(Boolean).join(', ')
                        setPickup(address)
                        setPickUpCountry(p.country)
                        setPickUpLatitude(coords.latitude)
                        setPickUpLongitude(coords.longitude)
                        setPickupSuggestions([])
                        setLocating(false)
                    }
                } catch (error) {
                    console.log(error)
                    setLocating(false)
                }
            })
        } else {
            alert("Geolocation is not supported by this browser.")
        }
    }

    const searchAddress = async(q:string, setResults: (results: Place[])=>void, restrict?: string|null)=>{
        try {
            if(!q || q.trim().length < 3) {
                setResults([])
                return
            }
            const {data} = await axios.get(`https://photon.komoot.io/api/?q=${encodeURIComponent(q.trim())}&limit=8&lang=en`)
            const results: Place[] = (data.features ?? []).map((feature: any) => ({
                id: String(feature.properties.osm_id),
                name: feature.properties.name || '',
                city: feature.properties.city || '',
                state: feature.properties.state || '',
                country: feature.properties.country || '',
                latitude: feature.geometry.coordinates[1] || 0,
                longitude: feature.geometry.coordinates[0] || 0,
                countryCode: feature.properties.countrycode || ''
            }))
            if(restrict){
                setResults(results.filter((r) => r.country === restrict))
                return
            }
            setResults(results)
        } catch (error) {
            console.log(error)
            setResults([])
        }
    }

     const suggestion = (p: Place) => [p.name, p.city, p.state, p.country].filter(Boolean).join(', ')

    return (
        <div className='min-h-screen flex items-center justify-center px-4 py-6 bg-zinc-100'>
            <motion.div
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className='w-full max-w-md'
            >
                <div className='flex items-center gap-4 mb-6 px-1'>
                    <motion.button
                        whileTap={{ scale: 0.88 }}
                        onClick={() => router.back()}
                        className='w-11 h-11 rounded-2xl bg-white border border-zinc-200 shadow-sm flex items-center justify-center hover:bg-zinc-50 transition-colors shrink-0'
                    >
                        <ArrowLeft size={13} className='text-zinc-900' />
                    </motion.button>
                    <div className='flex-1 min-w-0'>
                        <h1 className='text-zinc-900 text-xl font-black tracking-tight'>Book A Ride</h1>
                        <p className='text-zinc-600 text-xs mt-0.5'>Fill in the details below to book your ride.</p>
                    </div>
                    <div className='flex items-center gap-2 shrink-0'>
                        {
                            [1, 2, 3, 4].map((d, i) => (
                                <motion.div
                                    key={i}
                                    animate={{ width: progress > i ? 20 : 8, backgroundColor: progress > i ? '#09090b' : '#d4d4d8' }}
                                    className='h-2 rounded-full'
                                    transition={{ duration: 0.3 }}
                                />
                            ))
                        }
                    </div>
                </div>

                <div className='bg-white rounded-2xl shadow-sm overflow-visible'>
                    <div className='h-1 bg-zinc-900 w-[92%] m-auto outline-none rounded-full'/>

                    <div className='p-6 space-y-5'>
                        <motion.div
                            variants={stepVariants}
                            initial="hidden"
                            animate="visible"
                            transition={{ delay: 0.05 }}
                        >
                            <div className='flex items-center gap-2 mb-3'>
                                <div className='w-5 h-5 rounded-full bg-zinc-900 flex items-center justify-center shrink-0'>
                                    <span className='text-white text-sm font-black'>1</span>
                                </div>
                                <p className='text-xs font-bold text-zinc-500 uppercase tracking-widest'>
                                    Choose Vehicle Type
                                </p>

                            </div>
                            <div className='grid grid-cols-2 gap-3'>
                                {
                                    Vehicles.map((v, i) => {
                                        const active = vehicle == v.id
                                        return (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, y: 16 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.1 + i * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => setVehicle(v.id as vehicleType)}
                                                className={`relative flex items-center gap-3 text-left transition-all duration-200 p-3 rounded-xl border-2 ${active ? 'border-zinc-900 bg-zinc-900 text-white' : 'border-zinc-300 bg-white text-zinc-900'}`}
                                            >
                                                <div className={`p-3 rounded-lg ${active ? 'bg-white' : 'bg-zinc-100'}`}>
                                                    <v.Icon size={16} className={active ? 'text-zinc-900' : 'text-zinc-500'} />
                                                </div>
                                                <div className='min-w-0'>
                                                    <p className='font-bold'>{v.label}</p>
                                                    <p className='text-xs text-zinc-500'>{v.desc}</p>
                                                </div>
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.5 }}
                                                    animate={{ opacity: active ? 1 : 0, scale: active ? 1 : 0.5 }}
                                                    transition={{ duration: 0.2 }}
                                                    className='absolute top-2 right-2 text-green-500'
                                                >
                                                    <CheckCircle size={13} className='text-white fill-white/20' />
                                                </motion.div>

                                            </motion.div>)
                                    })
                                }
                            </div>
                        </motion.div>

                        <div className='h-px bg-zinc-200' />

                        <motion.div
                            variants={stepVariants}
                            initial="hidden"
                            animate="visible"
                            transition={{ delay: 0.05 }}
                        >
                            <div className='flex items-center gap-2 mb-3'>
                                <div className='w-5 h-5 rounded-full bg-zinc-900 flex items-center justify-center shrink-0'>
                                    <span className='text-white text-sm font-black'>2</span>
                                </div>
                                <p className='text-xs font-bold text-zinc-500 uppercase tracking-widest'>
                                    Mobile
                                </p>

                            </div>
                            <div className='flex items-center gap-3 text-left transition-all duration-200 p-2 rounded-xl border-2 border-zinc-300 bg-white text-zinc-900'>
                                <div className='p-3 rounded-lg bg-zinc-100'>
                                    <Phone size={16} />
                                </div>
                                <input type="tel" placeholder='Enter your mobile number' className='w-full bg-transparent border-none focus:outline-none' value={mobile} onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))} />
                                <AnimatePresence>
                                    {mobile.length == 10 && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.5 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.5 }}
                                        >
                                            <CheckCircle size={16} className='text-emerald-500 fill-emerald-50 shrink-0 mr-4' />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <p className='text-xs text-zinc-500 mt-2'>
                                Ride updates will be sent to your mobile number.
                            </p>

                        </motion.div>

                        <div className='h-px bg-zinc-200' />

                        <motion.div
                            variants={stepVariants}
                            initial="hidden"
                            animate="visible"
                            transition={{ delay: 0.05 }}
                        >
                            <div className='flex items-center gap-2 mb-3'>
                                <div className='w-5 h-5 rounded-full bg-zinc-900 flex items-center justify-center shrink-0'>
                                    <span className='text-white text-sm font-black'>3</span>
                                </div>
                                <p className='text-xs font-bold text-zinc-500 uppercase tracking-widest'>
                                    Route
                                </p>
                            </div>
                            <div className='bg-zinc-50 rounded-xl border border-zinc-200 overflow-visible'>

                                <div className='relative z-30'>
                                    <div className='flex items-center gap-3 px-4 py-3.5 focus-within:bg-white rounded-t-2xl transition-colors'>
                                        <div className='flex flex-col items-center shrink-0'>
                                            <div className='w-3 h-3 rounded-full bg-zinc-900'/>
                                            <div className='w-px h-4 bg-zinc-300'/>
                                        </div>
                                        <input className='text-zinc-900 w-full outline-none placeholder:text-zinc-400 '
                                        placeholder='Pickup Location'
                                        onChange={(e)=>{
                                            setPickup(e.target.value)
                                            searchAddress(e.target.value, setPickupSuggestions)
                                        }}
                                        value={pickup}
                                        />
                                        <motion.button
                                            whileTap={{scale: 0.88}}
                                            disabled={locating}
                                            onClick={useCurrentLocation}
                                            className='ml-auto p-2 rounded-full bg-white text-white flex items-center justify-center border border-zinc-300 shadow-sm hover:bg-zinc-50 transition-colors'
                                        >
                                            <LocateFixed size={14} className={`text-zinc-700 ${locating ? 'animate-spin' : ''}`}/>
                                        </motion.button>
                                    </div>
                                    <AnimatePresence>
                                        {pickupSuggestions.length > 0 && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -8 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -8 }}
                                                transition={{duration: 0.2}}
                                                className='absolute top-full left-0 right-0 bg-white border border-zinc-200 rounded-b-2xl shadow-lg overflow-y-auto z-50 mt-1 max-h-28'
                                            >
                                                
                                                    {
                                                        pickupSuggestions.map((s, i) => (
                                                            <motion.div
                                                                initial={{ opacity: 0 }}
                                                                animate={{ opacity: 1 }}
                                                                exit={{ opacity: 0 }}
                                                                transition={{delay: i*0.03}}
                                                                key={s.id}
                                                                className='flex items-center gap-3 w-full text-left transition-colors border border-zinc-100 last:border-0 px-4 py-3.5 hover:bg-zinc-100 cursor-pointer'
                                                                onClick={() => {
                                                                    setPickup(suggestion(s))
                                                                    setPickupSuggestions([])
                                                                    setPickUpCountry(s.country ?? "")
                                                                    setPickUpLatitude(s.latitude)
                                                                    setPickUpLongitude(s.longitude)
                                                                }}
                                                            >
                                                                <MapPin size={13} className='text-zinc-400 shrink-0'/>
                                                                <p className='text-zinc-900 text-sm truncate font-medium'>{suggestion(s)}</p>
                                                                <ChevronRight size={13} className='ml-auto text-zinc-300 shrink-0'/>
                                                            </motion.div>
                                                        ))
                                                    }
                                                
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                                
                                <div className='h-px bg-zinc-200' />

                                <div className='relative z-10'>
                                    <div className='flex items-center gap-3 px-4 py-3.5 focus-within:bg-white rounded-t-2xl transition-colors'>
                                        <div className='flex flex-col items-center shrink-0'>
                                            <div className='w-3 h-3 rounded-full bg-zinc-900'/>
                                            
                                        </div>
                                        <input className='text-zinc-900 w-full outline-none placeholder:text-zinc-400 '
                                        placeholder={pickUpCountry ? 'Drop Location' : 'Select pickup location first'}
                                        onChange={(e)=>{
                                            setDrop(e.target.value)
                                            searchAddress(e.target.value, setDropSuggestions, pickUpCountry)
                                        }}
                                        disabled={!pickUpCountry}
                                        value={drop}
                                        />
                                        <Navigation size={14} className='text-zinc-500 shrink-0'/>
                                    </div>
                                    <AnimatePresence>
                                        {dropSuggestions.length > 0 && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -8 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -8 }}
                                                className='absolute top-full left-0 right-0 bg-white border border-zinc-200 rounded-b-2xl shadow-lg overflow-y-auto z-50 mt-1 max-h-28'
                                            >
                                                
                                                    {
                                                        dropSuggestions.map((s, i) => (
                                                            <motion.div
                                                                initial={{ opacity: 0 }}
                                                                animate={{ opacity: 1 }}
                                                                exit={{ opacity: 0 }}
                                                                transition={{delay: i*0.03}}
                                                                key={s.id}
                                                                className='flex items-center gap-3 w-full text-left transition-colors border border-zinc-100 last:border-0 px-4 py-3.5 hover:bg-zinc-100 cursor-pointer'
                                                                onClick={() => {
                                                                    setDrop(suggestion(s))
                                                                    setDropSuggestions([])
                                                                    setDropCountry(s.country ?? "")
                                                                    setDropLatitude(s.latitude)
                                                                    setDropLongitude(s.longitude)
                                                                }}
                                                            >
                                                                <Navigation size={14} className='text-zinc-500 shrink-0'/>
                                                                <p className='text-zinc-900 text-sm truncate font-medium'>{suggestion(s)}</p>
                                                                <ChevronRight size={13} className='ml-auto text-zinc-300 shrink-0'/>
                                                            </motion.div>
                                                        ))
                                                    }
                                                
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                            </div>

                        </motion.div>

                        <motion.div
                            variants={stepVariants}
                            initial="hidden"
                            animate="visible"
                            transition={{ delay: 0.05 }}
                        >
                            <motion.button
                                whileTap={{scale: 0.97}}
                                disabled={!canContinue}
                                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white ${canContinue ? 'bg-zinc-900 hover:bg-zinc-800' : 'bg-zinc-300 cursor-not-allowed'}`}
                                onClick={()=>{
                                    router.push(`/user/search?pickup=${encodeURIComponent(pickup)}&drop=${encodeURIComponent(drop)}&vehicle=${vehicle}&mobile=${mobile}&pickUpLatitude=${pickUpLatitude}&pickUpLongitude=${pickUpLongitude}&dropLatitude=${dropLatitude}&dropLongitude=${dropLongitude}`)
                                }}
                            >
                                Continue
                                <ChevronRight size={14} />
                            

                            </motion.button>
                        </motion.div>

                    </div>

                </div>




            </motion.div>
        </div>
    )
}

export default page