'use client'
import React, { use, useState } from 'react'
import { motion } from "motion/react"
import { Button } from '@/components/ui/button'
import { ArrowLeft, BadgeCheck, CheckCircle, CircleDashed, CreditCard, Landmark, Phone } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { set } from 'mongoose'
import axios from 'axios'

function page() {
    const router = useRouter()
    const [accountHolderName, setAccountHolderName] = useState('')
    const [accountNumber, setAccountNumber] = useState('')
    const [ifscCode, setIfscCode] = useState('')
    const [mobileNumber, setMobileNumber] = useState('')
    const [upi, setUpi] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleBank = async () => {
        setLoading(true)
        setError('')
        try {
            const {data} = await axios.post('/api/partner/onBoarding/bank', {
                accountHolderName,
                accountNumber,
                ifscCode,
                mobileNumber,
                upi
            })
            setLoading(false)
            console.log(data)
        } catch (err: any) {
            setError(err.response?.data?.message || 'Something went wrong')
            setLoading(false)
            console.log(err)
        } 
    }
    return (
        <div className='min-h-screen bg-white flex items-center justify-center px-4'>
            <motion.div
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className='w-full max-w-xl bg-white rounded-3xl border border-gray-200 shadow-[0_25px_70px_rgba(0,0,0,0.15)] p-6 sm:p-8'
            >
                <div className='relative text-center'>
                    <Button variant="outline" className='absolute left-0 top-0 w-9 h-9 rounded-full flex items-center justify-center' onClick={() => router.back()}>
                        <ArrowLeft size={18} />
                    </Button>
                    <p className='text-xs text-gray-500 font-medium'>
                        Step 3 of 3
                    </p>
                    <h1 className='text-2xl font-bold mt-1'>
                        Bank & Payout Setup
                    </h1>
                    <p className='text-sm text-gray-500 mt-2'>
                        Used for Partner Payouts
                    </p>
                </div>

                <div className='mt-8 space-y-6'>
                    <div>
                        <label htmlFor="ahn" className='text-sm text-gray-500 font-semibold'>Account Holder Name</label>
                        <div className=' flex items-center gap-2 mt-2'>
                            <div className='text-gray-400'><BadgeCheck /></div>
                            <input type="text" id='ahn' placeholder='Enter Account Holder Name' className='flex-1 border-b pb-2 text-sm focus:outline-none border-gray-300 focus:border-black' onChange={(e)=>setAccountHolderName(e.target.value)} value={accountHolderName}/>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="ahn" className='text-sm text-gray-500 font-semibold'>Bank Account Number</label>
                        <div className=' flex items-center gap-2 mt-2'>
                            <div className='text-gray-400'><CreditCard /></div>
                            <input type="text" id='ahn' placeholder='Enter Account Number' className='flex-1 border-b pb-2 text-sm focus:outline-none border-gray-300 focus:border-black' onChange={(e)=>setAccountNumber(e.target.value)} value={accountNumber}/>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="ahn" className='text-sm text-gray-500 font-semibold'>IFSC code</label>
                        <div className=' flex items-center gap-2 mt-2'>
                            <div className='text-gray-400'><Landmark /></div>
                            <input type="text" id='ahn' placeholder='HDFC0001234' className='flex-1 border-b pb-2 text-sm focus:outline-none border-gray-300 focus:border-black' onChange={(e)=>setIfscCode(e.target.value)} value={ifscCode}/>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="ahn" className='text-sm text-gray-500 font-semibold'>Mobile Number</label>
                        <div className=' flex items-center gap-2 mt-2'>
                            <div className='text-gray-400'><Phone /></div>
                            <input type="text" id='ahn' placeholder='10-digit mobile number' className='flex-1 border-b pb-2 text-sm focus:outline-none border-gray-300 focus:border-black' onChange={(e)=>setMobileNumber(e.target.value)} value={mobileNumber}/>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="ahn" className='text-sm text-gray-500 font-semibold'>UPI ID (optional)</label>
                        <div className=' flex items-center gap-2 mt-2'>
                            <input type="text" id='ahn' placeholder='name@upi' className='flex-1 border-b pb-2 text-sm focus:outline-none border-gray-300 focus:border-black' onChange={(e)=>setUpi(e.target.value)} value={upi}/>
                        </div>
                    </div>
                </div>
                
                {error && <p className='mt-4 text-sm text-red-500'>{error}</p>}
                <div className='mt-6 flex items-start gap-3 text-xs text-gray-500'>
                    <CheckCircle size={16} className='mt-0.5' />
                    <p>Bank details are verified before first payout. This usually takes 24-48 hours</p>
                </div>
                
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className='mt-8 w-full h-14 rounded-2xl bg-black text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-40 transition'
                    onClick={handleBank}
                    disabled={loading}
                >
                    {loading? <CircleDashed className='text-white animate-spin'/> : "Continue"}
                </motion.button>

            </motion.div>
        </div>
    )
}

export default page
