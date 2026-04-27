'use client'
import AnimatedCard from '@/components/AnimatedCard'
import DocPreview from '@/components/DocPreview'
import { IPartnerBank } from '@/models/partnerBank.model'
import { IPartnerDocs } from '@/models/partnerDocs.model'
import { IUser } from '@/models/user.model'
import { IVehicle } from '@/models/vehicle.model'
import axios from 'axios'
import { ArrowLeft, Car, CheckCircle, CircleDashed, Clock, FileText, Landmark, ShieldCheck, XCircle } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { set } from 'mongoose'

const page = () => {
  const { id } = useParams()
  const [data, setData] = useState<IUser | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const [vehicle, setVehicle] = useState<IVehicle | null>(null)
  const [docs, setDocs] = useState<IPartnerDocs | null>(null)
  const [partnerBank, setPartnerBank] = useState<IPartnerBank | null>(null)
  const [showApprove, setShowApprove] = useState(false)
  const [showReject, setShowReject] = useState(false)
  const [rejectionReason, setRejectionReason] = useState("")
  const [approveLoading, setApproveLoading] = useState(false)
  const [rejectLoading, setRejectLoading] = useState(false)

  const handleGetPartner = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get(`/api/admin/reviews/partner/${id}`)
      setData(data.partner)
      setVehicle(data.vehicle)
      setDocs(data.documents)
      setPartnerBank(data.bank)
      setLoading(false)
    } catch (error) {
      console.error(error)
      setLoading(false)
    }
  }
  useEffect(() => {
    handleGetPartner()
  }, [])
  if (loading) {
    return <div className='min-h-screen grid place-items-center text-gray-500'>Loading Partner...</div>
  }
  const handleApprove = async () => {
    setApproveLoading(true)
    try {
      const { data } = await axios.get(`/api/admin/reviews/partner/${id}/approve`)
      console.log(data)
      setApproveLoading(false)
      router.push("/")
    } catch (error) {
      console.error(error)
      setApproveLoading(false)
    }
  }
  const handleReject = async (rejectionReason: string) => {
    setRejectLoading(true)
    try {
      const { data } = await axios.post(`/api/admin/reviews/partner/${id}/reject`, {rejectionReason})
      console.log(data)
      setRejectLoading(false)
      router.push("/")
    } catch (error) {
      console.error(error)
      setRejectLoading(false)
    }
  }
  return (
    <div className='min-h-screen bg-linear-to-br from-gray-100 to-gray-200'>
      <div className='sticky top-0 bg-white/70 border-b z-40 backdrop-blur-xl'>
        <div className='max-w-7xl mx-auto px-4 h-16 flex items-center gap-4'>
          <button className='w-10 h-10 rounded-full border flex items-center justify-center hover:bg-gray-100 transition' onClick={() => router.back()}>
            <ArrowLeft size={18} />
          </button>
          <div className='flex-1'>
            <div className='font-semibold text-lg'>{data?.name}</div>
            <div className='text-sm text-gray-500'>{data?.email}</div>
          </div>

          {
            data?.partnerStatus === 'approved' ? (
              <div className='px-4 py-2 rounded-full text-xs font-semibold inline-flex items-center gap-2 bg-green-100 text-green-700'>
                <CheckCircle size={14} /> Approved
              </div>
            ) : data?.partnerStatus === 'rejected' ? (
              <div className='px-4 py-2 rounded-full text-xs font-semibold inline-flex items-center gap-2 bg-red-100 text-red-700'>
                <XCircle size={14} /> Rejected
              </div>
            ) : (
              <div className='px-4 py-2 rounded-full text-xs font-semibold inline-flex items-center gap-2 bg-yellow-100 text-yellow-700'>
                <Clock size={14} /> Pending
              </div>
            )
          }


        </div>
      </div>
      <main className='max-w-7xl mx-auto px-4 py-12 grid lg:grid-cols-3 gap-10'>
        <div className='lg:col-span-2 space-y-8'>
          <AnimatedCard title='Vehicle Details' icon={<Car size={18} />}>
            <div className='flex justify-between text-sm'>
              <span className='text-gray-500'>Vehicle Type</span>
              <span className='font-semibold'>{vehicle?.type || "-"}</span>
            </div>
            <div className='flex justify-between text-sm'>
              <span className='text-gray-500'>Vehicle Model</span>
              <span className='font-semibold'>{vehicle?.model || "-"}</span>
            </div>
            <div className='flex justify-between text-sm'>
              <span className='text-gray-500'>Vehicle Number</span>
              <span className='font-semibold'>{vehicle?.licensePlate || "-"}</span>
            </div>

          </AnimatedCard>
          <AnimatedCard title='Documents' icon={<FileText size={18} />}>
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-6'>
              <DocPreview label='Aadhaar' url={docs?.aadharCardUrl || ''} />
              <DocPreview label='Registration Certificate' url={docs?.rcUrl || ''} />
              <DocPreview label='Driving License' url={docs?.licenseUrl || ''} />
            </div>
          </AnimatedCard>
        </div>
        <div className='space-y-8'>
          <AnimatedCard title='Bank Details' icon={<Landmark size={18} />}>
            <div className='flex justify-between text-sm'>
              <span className='text-gray-500'>Account Holder Name</span>
              <span className='font-semibold'>{partnerBank?.accountHolderName || "-"}</span>
            </div>
            <div className='flex justify-between text-sm'>
              <span className='text-gray-500'>Account Number</span>
              <span className='font-semibold'>{partnerBank?.accountNumber || "-"}</span>
            </div>
            <div className='flex justify-between text-sm'>
              <span className='text-gray-500'>IFSC Code</span>
              <span className='font-semibold'>{partnerBank?.ifscCode || "-"}</span>
            </div>
            <div className='flex justify-between text-sm'>
              <span className='text-gray-500'>UPI</span>
              <span className='font-semibold'>{partnerBank?.upi || "-"}</span>
            </div>

          </AnimatedCard>
          {data?.partnerStatus === 'pending' && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className='bg-white rounded-2xl p-4 border border-gray-100 shadow-xl px-5 py-4 gap-4 transition-shadow space-y-6'
            >
              <div className='mb-1 flex items-center gap-2 font-semibold'>
                <ShieldCheck size={18} />
                Admin Check
              </div>
              <p className='text-sm text-gray-500'>
                Verify Documents carefully before approving.
              </p>
              <div className='flex flex-col gap-4'>
                <button className='py-3 rounded-2xl bg-linear-to-r from-black to-gray-800 text-white font-semibold hover:opacity-90 trasition' onClick={()=>setShowApprove(true)}>Approve</button>
                <button className='py-3 rounded-2xl border font-semibold hover:bg-gray-100 transition' onClick={()=>setShowReject(true)}>Reject</button>
              </div>
            </motion.div>
          )}
        </div>
      </main>
      
        <AnimatePresence>
          {showApprove && (
            <motion.div
              className='fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center px-4'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className='bg-white rounded-3xl p-6 w-full max-w-sm'
              >
                <h2 className='text-lg font-bold'>Approve Partner?</h2>
                <p className='text-gray-500 mt-2 text-sm'>Are you sure you want to approve this partner?</p>
                <div className='flex gap-3 mt-6'>
                  <button className='flex-1 py-2 rounded-xl border' onClick={()=>setShowApprove(false)}>Cancel</button>
                  <button className='flex-1 flex items-center justify-center py-2 rounded-xl bg-black text-white' onClick={handleApprove} disabled={approveLoading}>
                    {approveLoading ? <CircleDashed className='text-white animate-spin' /> : "Confirm"}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      
      <AnimatePresence>
        {showReject && (
          <motion.div
              className='fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center px-4'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className='bg-white rounded-3xl p-6 w-full max-w-sm'
              >
                <h2 className='text-lg font-bold'>Reject Partner?</h2>
                <p className='text-gray-500 mt-2 text-sm'>
                  <textarea
                  placeholder='Enter rejection reason(required)'
                  className='w-full mt-2 border rounded-xl p-3 resize-none focus:ring-2 focus:ring-gray-300'
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  />
                </p>
                <div className='flex gap-3 mt-6'>
                  <button className='flex-1 py-2 rounded-xl border' onClick={()=>setShowReject(false)}>Cancel</button>
                  <button className='flex-1 flex items-center justify-center py-2 rounded-xl bg-black text-white' onClick={() => handleReject(rejectionReason)} disabled={rejectLoading}>
                    {rejectLoading ? <CircleDashed className='text-white animate-spin' /> : "Confirm"}
                  </button>
                </div>
              </motion.div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default page