'use client'
import React, { useRef } from 'react'
import {ZegoUIKitPrebuilt} from '@zegocloud/zego-uikit-prebuilt'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'

function page() {
    const {userData} = useSelector((state: RootState) => state.user)
    const containerRef = useRef<HTMLDivElement>(null)
    const startCall = async ()=>{
        if(!containerRef) return null;
        try {
            const appId = Number(process.env.NEXT_PUBLIC_ZEGO_APP_ID)
            const serverSecret = process.env.NEXT_PUBLIC_ZEGO_SERVER_SECRET
            const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
                appId, 
                serverSecret!,
                "test-room",
                userData?._id.toString()!,
                "Test User"
            )
            const zp = ZegoUIKitPrebuilt.create(kitToken)
            zp.joinRoom({
        container: containerRef.current,
        scenario: {
          mode: ZegoUIKitPrebuilt.OneONoneCall, 
        },
        
      });
        } catch (error) {
            console.error('Error generating kit token:', error)
        }
    }
  return (
    <div ref={containerRef} className='h-screen'>
      <button onClick={startCall}>Start Call</button>
    </div>
  )
}

export default page
