'use client'
import React, { useEffect, useRef, useState } from 'react'
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import Image from 'next/image'
import { CheckCircle, Mic, MicOff, PhoneOff, Video, VideoOff, X, XCircle } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { set } from 'mongoose'
import { s } from 'motion/react-client'
import axios from 'axios'
import { AnimatePresence, motion } from 'motion/react'

function page() {
  const { userData } = useSelector((state: RootState) => state.user)
  const containerRef = useRef<HTMLDivElement>(null)
  const [join, setJoin] = useState(false)
  const previewRef = useRef<HTMLVideoElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [isCameraOn, setIsCameraOn] = useState(true)
  const [isMicOn, setIsMicOn] = useState(true)
  const { roomId } = useParams()
  const [loading, setLoading] = useState(false)
  const [aLoading, setALoading] = useState(false)
  const [rLoading, setRLoading] = useState(false)
  const [reason, setReason] = useState("")
  const [showApprovalModal, setShowApprovalModal] = useState(false)
  const [showRejectionModal, setShowRejectionModal] = useState(false)
  const router = useRouter()
  useEffect(() => {
    if (join) return
    let localStream: MediaStream
    const init = async () => {
      try {
        localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        setStream(localStream)
        if (previewRef.current) {
          previewRef.current.srcObject = localStream

        }
      } catch (error) {
        console.error('Error accessing media devices:', error)
      }
    }
    init()
  }, [])
  const toggleCamera = () => {
    if (!stream) return
    stream.getVideoTracks().forEach(track => {
      track.enabled = !isCameraOn
    })
    setIsCameraOn(!isCameraOn)
  }
  const toggleMic = () => {
    if (!stream) return
    stream.getAudioTracks().forEach(track => {
      track.enabled = !isMicOn
    })
    setIsMicOn(!isMicOn)
  }

  const handleApprove = async () => {
    setALoading(true)
    try {
      const { data } = await axios.post("/api/admin/video-kyc/complete", {
        roomId,
        action: "approved",
      })
      console.log(data)
      setALoading(false)
      router.push("/")
    } catch (error) {
      console.error('Error processing request:', error)
      setALoading(false)
    }
  }

  const handleReject = async () => {
    setRLoading(true)
    try {
      const { data } = await axios.post("/api/admin/video-kyc/complete", {
        roomId,
        action: "rejected",
        reason
      })
      console.log(data)
      setRLoading(false)
      router.push("/")
    } catch (error) {
      console.error('Error processing request:', error)
      setRLoading(false)
    }
  }

  const startCall = async () => {
    if (!containerRef) return null;
    setLoading(true)
    const displayName = userData?.role == "admin" ? "Admin" : `${userData?.name} (${userData?.email})`
    try {
      const appId = Number(process.env.NEXT_PUBLIC_ZEGO_APP_ID)
      const serverSecret = process.env.NEXT_PUBLIC_ZEGO_SERVER_SECRET || ""

      if (!appId || !serverSecret) {
        console.error("Missing Zego credentials:", { appId, secretLength: serverSecret.length })
        alert("Server configuration error: Missing Zego credentials.");
        return;
      }

      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appId,
        serverSecret,
        roomId?.toString()!,
        userData?._id.toString()!,
        displayName
      )
      const zp = ZegoUIKitPrebuilt.create(kitToken)
      zp.joinRoom({
        container: containerRef.current,
        scenario: {
          mode: ZegoUIKitPrebuilt.OneONoneCall,
        },

      });
      setJoin(true)
      setLoading(false)
    } catch (error) {
      console.error('Error generating kit token:', error)
    }
  }
  return (
    <div className='min-h-screen bg-black text-white flex flex-col'>
      <div className='px-6 py-4 flex flex-col sm:flex-row justify-between border-b border-white/10 items-start sm:items-center gap-4'>
        <div>
          <Image
            src="/logo.png"
            alt="Rydex Logo"
            width={44}
            height={44}
            style={{ width: "auto" }}
            priority={true}
          />
          <p className='text-xs text-gray-400'>{userData?.role == "admin" ? "Admin Verification" : "Partner Video KYC"}</p>
        </div>
        {join && (
          <div className='flex flex-wrap gap-3'>
            {userData?.role === "admin" && (
              <>
                <button className='bg-green-600 hover:bg-green-700 px-4 py-2 rounded-full text-sm flex items-center gap-2' onClick={() => {
                  setShowApprovalModal(true)
                }}><CheckCircle size={16} /> Approve</button>
                <button className='bg-red-600 hover:bg-red-700 px-4 py-2 rounded-full text-sm flex items-center gap-2' onClick={() => {
                  setShowRejectionModal(true)
                }}><XCircle size={16} /> Reject</button>
              </>
            )}
            <button className='bg-red-700 hover:bg-red-800 px-4 py-2 rounded-full text-sm flex items-center gap-2' onClick={() => router.push("/")}><PhoneOff size={16} /> End Call</button>
          </div>
        )}
      </div>
      <div className='flex-1 relative'>
        <div ref={containerRef} className={`absolute inset-0 ${join ? "block" : "hidden"}`} />
        {!join && (
          <div className='h-full flex items-center justify-center px-4 py-10'>
            <div className='w-full max-w-6xl grid grid-col-1 lg:grid-cols-2 gap-12 items-center'>
              <div className='relative rounded-2xl overflow-hidden border border-white/10 bg-white/5'>
                <video ref={previewRef} autoPlay muted playsInline className='w-full h-75 sm:h-100 object-cover' />
                {!isCameraOn && (
                  <div className='absolute inset-0 flex items-center justify-center bg-black/50'>
                    <VideoOff size={40} className='text-white' />
                  </div>
                )}
              </div>
              <div className='space-y-8 text-center lg:text-left'>
                <h1 className='text-3xl sm:text-4xl font-bold'>Secure Video KYC</h1>
                <div>
                  <button onClick={toggleCamera} className='bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded'>
                    {isCameraOn ? <Video size={20} /> : <VideoOff size={20} />}
                  </button>
                  <button onClick={toggleMic} className='ml-4 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded'>
                    {isMicOn ? <Mic size={20} /> : <MicOff size={20} />}
                  </button>

                </div>
                <button onClick={startCall} className='w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-xl'>
                  {loading ? "Starting..." : "Start Call"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <AnimatePresence>
        {showApprovalModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4'
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className='relative bg-[#111] w-full max-w-md rounded-2xl p-6 shadow-2xl'
            >
              <button className='absolute top-4 right-4 text-gray-400' onClick={() => setShowApprovalModal(false)}><X size={16} /></button>
              <h2 className='text-lg font-semibold mb-4'>Confirm Approval</h2>
              <div className='flex gap-4'>
                <button className='flex-1 border rounded-xl py-2' onClick={() => setShowApprovalModal(false)}>
                  Cancel
                </button>
                <button className='flex-1 bg-green-600 rounded-xl py-2' onClick={handleApprove} disabled={aLoading}>
                  {aLoading ? "Approving..." : "Approve"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showRejectionModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4'
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className='relative bg-[#111] w-full max-w-md rounded-2xl p-6 shadow-2xl'
            >
              <button className='absolute top-4 right-4 text-gray-400' onClick={() => setShowRejectionModal(false)}><X size={16} /></button>
              <h2 className='text-lg font-semibold mb-4'>Confirm Rejection</h2>
              <textarea placeholder='Give rejection reason' value={reason} onChange={(e)=>setReason(e.target.value)} className='w-full bg-white/10 border border-white/20 rounded-xl p-3 mb-4 text-sm'/>
              <div className='flex gap-4'>
                <button className='flex-1 border rounded-xl py-2' onClick={() => setShowRejectionModal(false)}>
                  Cancel
                </button>
                <button className='flex-1 bg-red-600 rounded-xl py-2' onClick={handleReject} disabled={rLoading}>
                  {rLoading ? "Rejecting..." : "Reject"}
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
