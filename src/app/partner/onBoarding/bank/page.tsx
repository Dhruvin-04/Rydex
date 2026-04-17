'use client'
import React, { use, useEffect, useState } from 'react'
import { motion } from "motion/react"
import { Button } from '@/components/ui/button'
import { ArrowLeft, BadgeCheck, CheckCircle, CircleDashed, CreditCard, Landmark, Phone } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { set } from 'mongoose'
import axios from 'axios'

const IFSC_REGEX = /^[A-Z]{4}0[A-Z0-9]{6}$/
function page() {
    const router = useRouter()
    const [accountHolderName, setAccountHolderName] = useState('')
    const [accountNumber, setAccountNumber] = useState('')
    const [ifscCode, setIfscCode] = useState('')
    const [mobileNumber, setMobileNumber] = useState('')
    const [upi, setUpi] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const sanitizedIFSC = ifscCode.trim().toUpperCase()
    const isNameValid = accountHolderName.trim().length >= 3
    const isAccountNumberValid = accountNumber.trim().length >= 9 && accountNumber.trim().length <= 18
    const isIFSCValid = IFSC_REGEX.test(sanitizedIFSC)
    const isMobileNumberValid = /^\d{10}$/.test(mobileNumber.trim())
    const isFormValid = isNameValid && isAccountNumberValid && isIFSCValid && isMobileNumberValid

    const handleBank = async () => {
        setLoading(true)
        setError('')
        try {
            const {data} = await axios.post('/api/partner/onBoarding/bank', {
                accountHolderName,
                accountNumber,
                ifscCode: sanitizedIFSC,
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
    useEffect(() => {
        const handleGetBank = async () => {
        try {
            const {data} = await axios.get('/api/partner/onBoarding/bank')
            setAccountHolderName(data.bankDetails.accountHolderName)
            setAccountNumber(data.bankDetails.accountNumber)
            setIfscCode(data.bankDetails.ifscCode)
            setMobileNumber(data.mobileNumber)
            setUpi(data.bankDetails.upi)
        } catch (err: any) {

        } 
    }
    handleGetBank()
    }, [])
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
                            <input type="text" id='ahn' placeholder='Enter Account Holder Name' className={`flex-1 border-b pb-2 text-sm focus:outline-none border-gray-300 focus:border-black ${!isNameValid && accountHolderName.length > 0? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-black"}`} onChange={(e)=>setAccountHolderName(e.target.value)} value={accountHolderName}/>
                        </div>
                        {!isNameValid && accountHolderName.length > 0 && <p className='text-sm text-red-500 mt-1'>Please enter a valid name (at least 3 characters)</p>}
                    </div>
                    <div>
                        <label htmlFor="ahn" className='text-sm text-gray-500 font-semibold'>Bank Account Number</label>
                        <div className=' flex items-center gap-2 mt-2'>
                            <div className='text-gray-400'><CreditCard /></div>
                            <input type="text" id='ahn' placeholder='Enter Account Number' className={`flex-1 border-b pb-2 text-sm focus:outline-none border-gray-300 focus:border-black ${!isAccountNumberValid && accountNumber.length > 0? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-black"}`} onChange={(e)=>setAccountNumber(e.target.value)} value={accountNumber}/>
                        </div>
                        {!isAccountNumberValid && accountNumber.length > 0 && <p className='text-sm text-red-500 mt-1'>Please enter a valid account number (9-18 characters)</p>}
                    </div>
                    <div>
                        <label htmlFor="ahn" className='text-sm text-gray-500 font-semibold'>IFSC code</label>
                        <div className=' flex items-center gap-2 mt-2'>
                            <div className='text-gray-400'><Landmark /></div>
                            <input type="text" id='ahn' placeholder='HDFC0001234' className={`flex-1 border-b pb-2 text-sm focus:outline-none border-gray-300 focus:border-black ${!isIFSCValid && ifscCode.length > 0? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-black"}`} onChange={(e)=>setIfscCode(e.target.value)} value={ifscCode.toUpperCase()}/>
                        </div>
                        {!isIFSCValid && ifscCode.length > 0 && <p className='text-sm text-red-500 mt-1'>Please enter a valid IFSC code</p>}
                    </div>
                    <div>
                        <label htmlFor="ahn" className='text-sm text-gray-500 font-semibold'>Mobile Number</label>
                        <div className=' flex items-center gap-2 mt-2'>
                            <div className='text-gray-400'><Phone /></div>
                            <input type="text" id='ahn' placeholder='10-digit mobile number' className={`flex-1 border-b pb-2 text-sm focus:outline-none border-gray-300 focus:border-black ${!isMobileNumberValid && mobileNumber.length > 0? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-black"}`} onChange={(e)=>setMobileNumber(e.target.value)} value={mobileNumber}/>
                        </div>
                        {!isMobileNumberValid && mobileNumber.length > 0 && <p className='text-sm text-red-500 mt-1'>Please enter a valid mobile number (10 digits)</p>}
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
                    disabled={!isFormValid || loading}
                    className='mt-8 w-full h-14 rounded-2xl bg-black text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-40 transition'
                    onClick={handleBank}
                >
                    {loading? <CircleDashed className='text-white animate-spin'/> : "Continue"}
                </motion.button>

            </motion.div>
        </div>
    )
}

export default page
