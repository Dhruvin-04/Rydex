'use client'
import { IVehicle } from '@/models/vehicle.model'
import { useEffect, useState } from 'react'
import {AnimatePresence, motion} from 'motion/react'
import { ImagePlus, IndianRupee } from 'lucide-react'
import axios from 'axios'

interface PricingModalProps {
    open: boolean,
    onClose: () => void,
    data: IVehicle | null
}

const PricingModal = ({ open, onClose, data }: PricingModalProps) => {
    const [image, setImage] = useState<File | null>(null)
    const [preview, setPreview] = useState<string | null>(null)
    const [baseFare, setBaseFare] = useState("")
    const [pricePerKm, setPricePerKm] = useState("")
    const [waitingCharge, setWaitingCharge] = useState("")
    const [loading, setLoading] = useState(false)
    const handleSubmit = async () => {
        setLoading(true)
        try {
            const formData = new FormData()
            formData.append("baseFare", baseFare)
            formData.append("pricePerKm", pricePerKm)
            formData.append("waitingCharge", waitingCharge)
            if(image){
                formData.append("image", image)
            }
            const {data} = await axios.post("/api/partner/onBoarding/pricing", formData)
            console.log(data)
            setLoading(false)
            onClose()
        } catch (error) {
            console.error(error)
            setLoading(false)
        }
    }
    useEffect(()=>{
        if(data){
            setPreview(data.imageUrl || null)
            setBaseFare(data.baseFare !== undefined && data.baseFare !== null ? data.baseFare.toString() : "")
            setPricePerKm(data.pricePerKm !== undefined && data.pricePerKm !== null ? data.pricePerKm.toString() : "")
            setWaitingCharge(data.waitingCharge !== undefined && data.waitingCharge !== null ? data.waitingCharge.toString() : "")
        }
    }, [data])
  return (
    <AnimatePresence>
        {open && (
            <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4'
            >   
                <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className='bg-white rounded-3xl shadow-2xl w-full overflow-hidden max-w-lg '
                >
                    <div className='border-b p-6'>
                        <h2 className='text-xl font-bold'>Pricing and Vehicle Image</h2>
                    </div>
                    <div className='p-6 space-y-6'>
                        <label htmlFor='imageLabel' className='relative h-44 border-2 border-dashed rounded-2xl flex items-center justify-center cursor-pointer'>
                            {!preview ? (
                                <ImagePlus size={28}/>):(
                                    <img src={preview} className='absolute inset-0 w-full h-full object-cover rounded-2xl'/>
                                )
                            }
                            <input id='imageLabel' type='file'  accept='image/*' hidden onChange={(e)=>{
                                if(e.target.files?.[0]){
                                    setImage(e.target.files[0])
                                    setPreview(URL.createObjectURL(e.target.files[0]))
                                }
                            }}/>
                        </label>
                        <div>
                            <p className='text-sm font-semibold mb-1'>Base Fare</p>
                            <div className='flex items-center gap-2 border rounded-xl px-4 py-3 bg-white'>
                                <IndianRupee size={20}/>
                                <input type='number' value={baseFare} onChange={(e)=>setBaseFare(e.target.value)} placeholder='Enter base fare' className='w-full outline-none'/>
                            </div>
                        </div>
                        <div>
                            <p className='text-sm font-semibold mb-1'>Price/km</p>
                            <div className='flex items-center gap-2 border rounded-xl px-4 py-3 bg-white'>
                                <IndianRupee size={20}/>
                                <input type='number' value={pricePerKm} onChange={(e)=>setPricePerKm(e.target.value)} placeholder='Enter price per km' className='w-full outline-none'/>
                            </div>
                        </div>
                        <div>
                            <p className='text-sm font-semibold mb-1'>Waiting Charge/min</p>
                            <div className='flex items-center gap-2 border rounded-xl px-4 py-3 bg-white'>
                                <IndianRupee size={20}/>
                                <input type='number' value={waitingCharge} onChange={(e)=>setWaitingCharge(e.target.value)} placeholder='Enter waiting charge' className='w-full outline-none'/>
                            </div>
                        </div>

                    </div>
                    
                    <div className='p-6 border-t flex gap-3'>
                        <button onClick={()=>onClose()} className='flex-1 border rounded-xl py-2'>Cancel</button>
                        <button onClick={handleSubmit} className='flex-1 bg-black text-white py-2 rounded-xl' disabled={loading}>
                            {loading ? "Saving..." : "Save"}
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        )}
    </AnimatePresence>
    
  )
}

export default PricingModal