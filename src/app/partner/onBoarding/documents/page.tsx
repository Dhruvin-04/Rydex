'use client'
import React, { useState } from 'react'
import { motion } from "motion/react"
import { Button } from '@/components/ui/button'
import { ArrowLeft, CircleDashed, FileCheck, UploadCloud } from 'lucide-react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { set } from 'mongoose'

type docsType = "aadhaar" | "license" | "rc"

function page() {
    const router = useRouter();
    const [docs, setDocs] = useState<Record<docsType, File | null>>({
        aadhaar: null,
        license: null,
        rc: null
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleDocs = async () => {
        setLoading(true);
        setError("");
        try {
            const formData = new FormData();
            if (!docs.aadhaar || !docs.license || !docs.rc) {
                setError("Please upload all required documents.");
                setLoading(false);
                return;
            }
            formData.append("aadhaar", docs.aadhaar as Blob);
            formData.append("license", docs.license as Blob);
            formData.append("rc", docs.rc as Blob);
            const { data } = await axios.post("/api/partner/onBoarding/documents", formData)
            setLoading(false);
        } catch (error: any) {
            setLoading(false);
            setError(error?.response?.data?.message || "Something went wrong. Please try again.");
            setLoading(false);
        }
    }

    const handleImage = (doc: docsType, file: File | null) => {
        if (!file) return;
        setDocs(prev => ({ ...prev, [doc]: file }))
    }
    const isCompleted = docs.aadhaar && docs.license && docs.rc
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
                        Step 2 of 3
                    </p>
                    <h1 className='text-2xl font-bold mt-1'>
                        Upload Your Documents
                    </h1>
                    <p className='text-sm text-gray-500 mt-2'>
                        Required for Verification
                    </p>
                </div>

                <div className='mt-8 space-y-5'>
                    <motion.label
                        whileHover={{ scale: 1.02 }}
                        className='flex items-center justify-between p-4 rounded-2xl border border-gray-300 cursor-pointer hover:border-black transition'
                    >
                        <div>
                            <p className='text-sm font-semibold'>Aadhaar / ID Proof</p>
                            <p className='text-xs text-gray-500'>Government Issued ID</p>
                        </div>


                        {docs.aadhaar ? <span className='text-xs font-medium text-green-600'>Uploaded</span> : <div>
                            <span className='text-xs text-gray-400'>Upload</span>
                            <div className='w-10 h-10 rounded-full bg-black text-white flex items-center justify-center'><UploadCloud size={18} /></div>
                        </div>}



                        <input type="file" hidden accept='image/*,.pdf' onChange={(e) => handleImage("aadhaar", e.target.files?.[0] || null)} />
                    </motion.label>

                    <motion.label
                        whileHover={{ scale: 1.02 }}
                        className='flex items-center justify-between p-4 rounded-2xl border border-gray-300 cursor-pointer hover:border-black transition'
                    >
                        <div>
                            <p className='text-sm font-semibold'>Driving License</p>
                            <p className='text-xs text-gray-500'>Valid Driving License</p>
                        </div>

                        {docs.license ? <span className='text-xs font-medium text-green-600'>Uploaded</span> : <div>
                            <span className='text-xs text-gray-400'>Upload</span>
                            <div className='w-10 h-10 rounded-full bg-black text-white flex items-center justify-center'><UploadCloud size={18} /></div>
                        </div>}
                        <input type="file" hidden accept='image/*,.pdf' onChange={(e) => handleImage("license", e.target.files?.[0] || null)} />
                    </motion.label>
                    <motion.label
                        whileHover={{ scale: 1.02 }}
                        className='flex items-center justify-between p-4 rounded-2xl border border-gray-300 cursor-pointer hover:border-black transition'
                    >
                        <div>
                            <p className='text-sm font-semibold'>Vehicle RC</p>
                            <p className='text-xs text-gray-500'>Registration Certificate</p>
                        </div>

                        {docs.rc ? <span className='text-xs font-medium text-green-600'>Uploaded</span> : <div>
                            <span className='text-xs text-gray-400'>Upload</span>
                            <div className='w-10 h-10 rounded-full bg-black text-white flex items-center justify-center'><UploadCloud size={18} /></div>
                        </div>}
                        <input type="file" hidden accept='image/*,.pdf' onChange={(e) => handleImage("rc", e.target.files?.[0] || null)} />
                    </motion.label>

                </div>

                <div className='mt-6 flex items-center gap-3 text-xs text-gray-500'>
                    <FileCheck size={16} className='mt-0.5' />
                    <p>Documents are securely stored and manually verified by our team</p>
                </div>
                {error && <p className='mt-4 text-sm text-red-500'>{error}</p>}
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    disabled={loading || !isCompleted}
                    className='mt-8 w-full h-14 rounded-2xl bg-black text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-40 transition'
                    onClick={handleDocs}
                >
                    {loading ? <CircleDashed className='text-white animate-spin' /> : "Continue"}
                </motion.button>

            </motion.div>
        </div>
    )
}

export default page
