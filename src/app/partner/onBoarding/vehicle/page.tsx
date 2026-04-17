'use client'
import React, { useEffect, useState } from 'react'
import { motion } from "motion/react"
import { Button } from '@/components/ui/button'
import { ArrowLeft, Bike, Car, CarTaxiFront, CircleDashed, Package, Truck } from 'lucide-react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { set } from 'mongoose'

const Vehicles = [
  { id: "bike", description: "2 wheeler", Icon: Bike, label: "Bike" },
  { id: "auto", description: "3 wheeler", Icon: CarTaxiFront, label: "Auto" },
  { id: "car", description: "4 wheeler", Icon: Car, label: "Car" },
  { id: "loading", description: "small goods", Icon: Package, label: "Loading" },
  { id: "truck", description: "heavy transport", Icon: Truck, label: "Truck" },
]

function page() {
    const router = useRouter()
    const [vehicleType, setVehicleType] = useState("")
    const [vehicleNumber, setVehicleNumber] = useState("")
    const [vehicleModel, setVehicleModel] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleVehicle = async()=>{
        setError("")
        try {
            setLoading(true)
            const {data} = await axios.post("/api/partner/onBoarding/vehicle",{
                type: vehicleType, 
                licensePlate: vehicleNumber, 
                model: vehicleModel
            })
            setLoading(false)
        } catch (error:any) {
            setError(error.response?.data?.message || "An error occurred")
            setLoading(false)
        }
    }
    useEffect(()=>{
        const handleGetVehicle = async()=>{
        setError("")
        try {
            const {data} = await axios.get("/api/partner/onBoarding/vehicle")
            setVehicleType(data.type)
            setVehicleNumber(data.licensePlate)
            setVehicleModel(data.model)

        } catch (error:any) {
            console.log(error)
        }
    }
    handleGetVehicle()
    }, [])
    return (
        <div className='min-h-screen bg-white flex items-center justify-center px-4'>
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className='w-full max-w-xl bg-white rounded-3xl border border-gray-200 shadow-[0_25px_70px_rgba(0,0,0,0.15)] p-6 sm:p-8'
            >
                <div className='relative text-center'>
                    <Button variant="outline" className='absolute left-0 top-0 w-9 h-9 rounded-full flex items-center justify-center' onClick={() => router.back()}>
                        <ArrowLeft size={18} />
                    </Button>
                    <p className='text-xs text-gray-500 font-medium'>
                        Step 1 of 3
                    </p>
                    <h1 className='text-2xl font-bold mt-1'>
                        Vehicle Details
                    </h1>
                    <p className='text-sm text-gray-500 mt-2'>
                        Add Your Vehicle Information
                    </p>
                </div>

                <div className='mt-8 space-y-6'>
                    <div>
                        <p className='text-sm font-semibold text-gray-500 mb-3'>Vehicle Type</p>
                        <div className='grid grid-cols-2 sm:grid-cols-3 gap-3'>
                            {Vehicles.map((v, i)=>{
                                const Icon = v.Icon
                                const active = vehicleType==v.id
                                return(
                                    <motion.div
                                        key={v.id}
                                        whileHover={{scale: 1.05}}
                                        whileTap={{scale: 0.96}}
                                        onClick={()=>setVehicleType(v.id)}
                                        className={`rounded-2xl border p-4 flex flex-col items-center gap-2 transition ${active? "bg-black text-white border-black":"border-gray-200 hover:border-black"}`}
                                    >
                                        <div className={`w-11 h-11 rounded-full flex items-center justify-center ${active?"bg-white text-black":"bg-black text-white"}`}>
                                            <Icon/>
                                        </div>

                                        <div className='text-sm font-semibold'>
                                            {v.label}
                                        </div>
                                        <p className={`text-xs ${active?"text-gray-300":"text-gray-500"}`}>
                                            {v.description}
                                        </p>

                                    </motion.div>
                                )
                            })}
                        </div>
                    </div>

                    <div>
                        <label htmlFor="vn" className='text-sm font-semibold text-gray-500'>Vehicle Number</label>
                        <input type="text" id="vn" placeholder='MH12AB1234' className='mt-2 w-full border-b border-gray-300 pb-2 text-sm focus:outline-none focus:border-black transition' value={vehicleNumber} onChange={(e)=>setVehicleNumber(e.target.value.toUpperCase())}/>
                    </div>

                    <div>
                        <label htmlFor="vm" className='text-sm font-semibold text-gray-500'>Vehicle Model</label>
                        <input type="text" id="vm" placeholder='Suzuki i20' className='mt-2 w-full border-b border-gray-300 pb-2 text-sm focus:outline-none focus:border-black transition' value={vehicleModel} onChange={(e)=>setVehicleModel(e.target.value)}/>
                    </div>
                    {error && (
                        <p className='text-red-500 mt-4 text-sm'>*{error}</p>
                    )}

                    <motion.button
                    whileHover={{scale: 1.02}}
                    disabled={loading}
                    whileTap={{scale: 0.97}}
                    className='mt-8 w-full h-14 rounded-2xl bg-black text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-40 transition'
                    onClick={handleVehicle}
                    >
                        {loading? <CircleDashed className='text-white animate-spin'/> : "Continue"}
                    </motion.button>
                </div>

            </motion.div>
        </div>
    )
}

export default page
