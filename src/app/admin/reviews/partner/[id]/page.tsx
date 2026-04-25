'use client'
import AnimatedCard from '@/components/AnimatedCard'
import DocPreview from '@/components/DocPreview'
import { IPartnerDocs } from '@/models/partnerDocs.model'
import { IUser } from '@/models/user.model'
import { IVehicle } from '@/models/vehicle.model'
import axios from 'axios'
import { ArrowLeft, Car, CheckCircle, Clock, FileText, XCircle } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const page = () => {
  const {id} = useParams()
  const [data, setData] = useState<IUser | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const [vehicle, setVehicle] = useState<IVehicle | null>(null)
  const [docs, setDocs] = useState<IPartnerDocs | null>(null)
   
  const handleGetPartner = async () => {
    try {
      setLoading(true)
      const {data} = await axios.get(`/api/admin/reviews/partner/${id}`)
      setData(data.partner)
      setVehicle(data.vehicle)
      setDocs(data.documents)
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
  return (
    <div className='min-h-screen bg-linear-to-br from-gray-100 to-gray-200'>
      <div className='sticky top-0 bg-white/70 border-b z-40 backdrop-blur-xl'>
        <div className='max-w-7xl mx-auto px-4 h-16 flex items-center gap-4'>
          <button className='w-10 h-10 rounded-full border flex items-center justify-center hover:bg-gray-100 transition' onClick={()=>router.back()}>
            <ArrowLeft size={18}/>
          </button>
          <div className='flex-1'>
            <div className='font-semibold text-lg'>{data?.name}</div>
            <div className='text-sm text-gray-500'>{data?.email}</div>
          </div>
            
              {
                data?.partnerStatus === 'approved' ? (
                  <div className='px-4 py-2 rounded-full text-xs font-semibold inline-flex items-center gap-2 bg-green-100 text-green-700'>
                      <CheckCircle size={14}/> Approved
                  </div>
                ):data?.partnerStatus === 'rejected' ? (
                  <div className='px-4 py-2 rounded-full text-xs font-semibold inline-flex items-center gap-2 bg-red-100 text-red-700'>
                    <XCircle size={14}/> Rejected
                  </div>
                ):(
                  <div className='px-4 py-2 rounded-full text-xs font-semibold inline-flex items-center gap-2 bg-yellow-100 text-yellow-700'>
                    <Clock size={14}/> Pending
                  </div>
                )
              }
            
          
        </div>
      </div>
      <main className='max-w-7xl mx-auto px-4 py-12 grid lg:grid-cols-3 gap-10'>
              <div className='lg:col-span-2 space-y-8'>
                <AnimatedCard title='Vehicle Details' icon={<Car size={18}/>}>
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
                <AnimatedCard title='Documents' icon={<FileText size={18}/>}>
                  <div className='grid grid-cols-1 sm:grid-cols-3 gap-6'>
                    <DocPreview label='Aadhaar' url={docs?.aadharCardUrl || ''}/>
                    <DocPreview label='Registration Certificate' url={docs?.rcUrl || ''}/>
                    <DocPreview label='Driving License' url={docs?.licenseUrl || ''}/>
                  </div>
                </AnimatedCard>
              </div>
      </main>
    </div>
  )
}

export default page