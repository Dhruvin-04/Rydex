'use client'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { CheckCircle2, Clock, Truck, User, Video, XCircle } from 'lucide-react'
import Kpi from './Kpi'
import TabButton from './TabButton'
import { set } from 'mongoose'
import { AnimatePresence, motion } from 'motion/react'
import ContentList from './ContentList'

type Stats = {
  totalPartners: number,
  totalApprovedPartners: number
  totalPendingPartners: number,
  totalRejectedPartners: number,
}
type Tab = "kyc" | "vehicle" | "partner"

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats | null>(null)
  const [activeTab, setActiveTab] = useState<Tab>("partner")
  const [partnerReviews, setPartnerReviews] = useState<any[]>([])
  const [pendingKYC, setPendingKYC] = useState<any[]>([])
  const [vehicleReviews, setVehicleReviews] = useState<any[]>([])
  const handleGetData = async () => {
    try {
      const { data } = await axios.get("/api/admin/dashboard")
      setStats(data.stats)
      setPartnerReviews(data.pendingPartnersReviews)
      // setPendingKYC(data.pendingKYC)
      // setVehicleReviews(data.vehicleReviews)
    } catch (error) {
      console.error("Error fetching admin dashboard data:", error)
    }
  }
  useEffect(() => {
    handleGetData()
  }, [])
  return (
    <div className='min-h-screen bg-linear-to-br from-gray-100 to-gray-200'>
      <div className='sticky top-0 bg-white/80 backdrop-blur-lg border-b z-40'>
        <div className='max-w-7xl mx-auto h-16 px-6 flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <Image
              src="/logo.png"
              alt="Rydex Logo"
              width={44}
              height={44}
              style={{ width: "auto" }}
              priority={true}
            />
            <span className='text-lg font-bold tracking-wide'>Admin</span>
          </div>
          <div className='flex items-center gap-2 text-xs px-3 py-1.5 rounded-full bg-black text-white'>
            <User size={14}/>
            Admin Dashboard
          </div>
        </div>
      </div>
      <main className='max-w-7xl mx-auto px-6 py-12 space-y-16'>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
          <Kpi label="Total Partners" value={stats?.totalPartners ?? 0} icon={<User />} variant={"totalPartners"}/>
          <Kpi label="Approved Partners" value={stats?.totalApprovedPartners ?? 0} icon={<CheckCircle2 />} variant={"totalApprovedPartners"}/>
          <Kpi label="Pending Partners" value={stats?.totalPendingPartners ?? 0} icon={<Clock />} variant={"totalPendingPartners"}/>
          <Kpi label="Rejected Partners" value={stats?.totalRejectedPartners ?? 0} icon={<XCircle />} variant={"totalRejectedPartners"}/>
        </div>

        <div className='bg-white rounded-2xl p-2 shadow-lg border border-gray-100 flex flex-wrap gap-2'>
          <TabButton active={activeTab == "partner"} count={partnerReviews.length ?? 0} icon={<User size={15} />} onClick={() => setActiveTab("partner")}>
            Pending Partner Reviews
          </TabButton>
          <TabButton active={activeTab == "kyc"} count={pendingKYC.length ?? 0} icon={<Video size={15} />} onClick={() => setActiveTab("kyc")}>
            Pending Video KYC
          </TabButton>
          <TabButton active={activeTab == "vehicle"} count={vehicleReviews.length ?? 0} icon={<Truck size={15} />} onClick={() => setActiveTab("vehicle")}>
            Pending Vehicle Reviews
          </TabButton>
        </div>
        <AnimatePresence mode='wait'>
          <motion.div
          key={activeTab} 
          initial={{opacity: 0, y: 16}}
          animate={{opacity: 1, y: 0}}
          exit={{opacity: 0, y: -8}}
          transition={{duration: 0.2, ease: "easeOut"}}
          className='rounded-2xl p-5 min-h-50'
          >
            {activeTab === "partner" && <ContentList data={partnerReviews || []} type="partner" />}
            {activeTab === "kyc" && <ContentList data={pendingKYC || []} type="kyc" />}
            {activeTab === "vehicle" && <ContentList data={vehicleReviews || []} type="vehicle" />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}

export default AdminDashboard