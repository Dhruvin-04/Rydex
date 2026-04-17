'use client'
import { RootState } from '@/redux/store'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import {motion} from 'motion/react'
import { Check, Lock } from 'lucide-react'
import { useRouter } from 'next/navigation'

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
  useEffect(()=>{
    if(userData?.partnerOnBoardingSteps !== undefined){
      setActiveStep(userData.partnerOnBoardingSteps+1)
    }
  }, [userData])

  const goToStep = (step: Step) => {
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

      </div>
    </div>
  )
}

export default PartnerDashboard