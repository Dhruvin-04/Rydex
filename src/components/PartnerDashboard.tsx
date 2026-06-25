'use client'
import { RootState } from '@/redux/store'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import {motion} from 'motion/react'
import { ArrowRight, Check, Clock, Lock } from 'lucide-react'
import { useRouter } from 'next/navigation'
import RejectionCard from './RejectionCard'
import StatusCard from './StatusCard'
import ActionCard from './ActionCard'
import { a } from 'motion/react-client'
import axios from 'axios'
import PricingModal from './PricingModal'
import { IVehicle } from '@/models/vehicle.model'
import PartnerEarnings from './PartnerEarnings'

type Step = {
  id: number,
  title: string,
  route?: string
}

const steps: Step[] = [
  {id: 1, title: "Vehicle", route: "/partner/onBoarding/vehicle"},
  {id: 2, title: "Documents", route: "/partner/onBoarding/documents"},
  {id: 3, title: "Bank Details", route: "/partner/onBoarding/bank"},
  {id: 4, title: "Review"},
  {id: 5, title: "Video KYC"},
  {id: 6, title: "Princing"},
  {id: 7, title: "Final Review"},
  {id: 8, title: "Live"},
]
const totalSteps = steps.length

const PartnerDashboard = () => {
  const [activeStep, setActiveStep] = useState(0)
  const {userData} = useSelector((state: RootState) => state.user)
  const router = useRouter()
  const [requestLoading, setRequestLoading] = useState(false)
  const [showPricing, setShowPricing] = useState(false)
  const [vehicleData, setVehicleData] = useState<IVehicle | null>(null)
  useEffect(()=>{
    if(userData?.partnerOnBoardingSteps !== undefined){
      setActiveStep(userData.partnerOnBoardingSteps+1)
    }
  }, [userData])

  const handleGetPrincing = async () => {
    try {
      const {data} = await axios.get("/api/partner/onBoarding/pricing")
      setVehicleData(data)
    } catch (error) {
      console.error(error)
    }
  }
  useEffect(() => {
    handleGetPrincing()
  }, [])

  const goToStep = (step: Step) => {
    if(step.id == 6 && userData?.partnerStatus == "approved" && userData.videoKycStatus=="approved"){
      setShowPricing(true)
      return
    }
    if(step.route && step.id <= activeStep){
      router.push(step.route)
    }
  }

  const progressPercentage = ((activeStep-1)/(totalSteps-1))*100
  return (
    <div className='min-h-screen bg-linear-to-br from-gray-100 to-gray-200 px-4 pt-28 pb-20'>
      <div className='max-w-7xl mx-auto space-y-16'>
        <div>
          <h1 className='text-4xl font-bold mt-5'>Partner Onboarding</h1>
          <p className='text-gray-600 mt-3'>Complete all steps to activate your account</p>
        </div>

        <div className='bg-white rounded-3xl p-10 shadow-xl border overflow-x-auto'>
          <div className='relative min-w-200'>
            <div className=' absolute top-7 left-0 w-full h-0.75 bg-gray-200 rounded-full'/>
            <motion.div
              animate={{width: `${progressPercentage}%`}}
              transition={{duration: 0.6}}
              className='absolute top-7 left-0 h-0.75 bg-black rounded-full'
              />
              <div className='relative flex justify-between'>
                {steps.map((step, index) => {
                  const completed = step.id < activeStep
                  const isActive = step.id === activeStep
                  const locked = step.id > activeStep
                  return(
                    <motion.div
                    key={step.id}
                    whileHover={!locked?{scale: 1.1}: {}}
                    className='flex flex-col items-center z-10 cursor-pointer'
                    onClick={() => goToStep(step)}
                    >
                      <div className={`w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all ${completed? 'bg-black border-black text-white': isActive? 'border-black bg-white': 'border-gray-400 bg-white text-gray-400'}`}>

                      {
                        completed? (
                          <Check size={20}/>
                        ): locked? (
                          <Lock size={20}/>
                        ): (
                          step.id
                        )
                      }
                      </div>
                      <p className='mt-3 text-sm font-medium'>{step.title}</p>
                    </motion.div>
                  )
                })}
              </div>
          </div>

        </div>

        {
          userData?.partnerOnBoardingSteps == 4 && userData?.partnerStatus == "rejected" && (
            <RejectionCard 
              title="Partner Rejected"
              reason={userData.rejectionReason}
              actionLabel={'Review and Update'}
              onAction={() => router.push("/partner/onBoarding/vehicle")}
            />
          )
        }

        {
          activeStep == 4 && userData?.partnerStatus == "pending" && (
            <StatusCard 
              icon={<Clock size={18}/>}
              title={"Under Review"}
              desc={"Your application is currently under review. We will notify you once the review process is complete."}
            />
          )
        }
        {
          activeStep == 5 && userData?.videoKycStatus == "approved" ? (
            <StatusCard
              icon={<Check size={18}/>}
              title={"Video KYC Approved"}
              desc={"Your video KYC has been approved. Please proceed to the next steps to complete your onboarding."}
            />
          ): activeStep == 5 && userData?.videoKycStatus == "rejected" ? (
            <RejectionCard 
              title="Video KYC Rejected"
              reason={userData?.videoKycRejectionReason}
              actionLabel={requestLoading? "Requesting...": "Request Video KYC"}
              onAction={async () => {
                setRequestLoading(true)
                try {
                  await axios.get("/api/partner/video-kyc/request")
                } finally {
                  setRequestLoading(false)
                }
              }}
            />
          ): activeStep == 5 && userData?.videoKycStatus == "in_progress" && userData?.videoKycRoomId ?(
            <ActionCard
              icon={<Clock size={18}/>}
              title={"Admin started the Video KYC Call"}
              button={"Join Call"}
              onClick={() => router.push(`/video-kyc/${userData.videoKycRoomId}`)}
            />
          ): activeStep == 5 && (
            <StatusCard
              icon={<Clock size={18}/>}
              title={"Waiting for Admin"}
              desc={"Your video KYC is pending. An admin will start the video KYC call once they review your application."}
            />
          )
        }

        {
          activeStep == 7 && vehicleData?.status == 'pending' && (
            <StatusCard
              icon={<Clock size={18}/>}
              title={"Pricing Details Under Review"}
              desc={"Your pricing details are under review. An admin will review the details and approve them shortly."}
            />
          )
        }
        {
          activeStep == 7 && vehicleData?.status == 'rejected' && (
            <RejectionCard
              title={"Pricing Details Rejected"}
              reason={vehicleData.rejectionReason}
              actionLabel={'Review and Update'}
              onAction={() => setShowPricing(true)}
            />
          )
        }

        {
          activeStep == 8 && vehicleData?.status == 'approved' && (
            <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className='bg-black text-white rounded-3xl p-10 shadow-2xl'
            >
              <h2 className='text-2xl font-bold'>
                🚀 You are Live!
              </h2>
              <button className='bg-white text-black px-6 py-2 rounded-xl font-semibold hover:bg-gray-200 transition flex gap-1 items-center mt-2 ml-4' onClick={() => router.push("/partner/bookings")}>
                Go to Bookings <ArrowRight size={18} />
              </button>
            </motion.div>
          )
        }

        <PartnerEarnings/>

      </div>
      <PricingModal
      open = {showPricing}
      onClose={() => setShowPricing(false)}
      data={vehicleData}
      />
    </div>
  )
}

export default PartnerDashboard