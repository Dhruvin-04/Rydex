'use client'
import { getSocket } from '@/lib/socket'
import React, { useEffect, useRef } from 'react'

const GeoUpdater = ({userId}: {userId: string}) => {
  
  const socketRef = useRef<any>(null)
  useEffect(() => {
    if(!userId) return
    if(!navigator.geolocation) {
      console.error('Geolocation is not supported')
      return
    }
    socketRef.current = getSocket()
    socketRef.current.emit('identity', userId) 

    const watcher = navigator.geolocation.watchPosition(({coords}) => {
      socketRef.current.emit('geoUpdateLoc', {
        userId,
        latitude: coords.latitude,
        longitude: coords.longitude
      })
    },
    (err) => {
      console.error('Error watching position:', err)
    },
    {
      enableHighAccuracy: true,
      maximumAge: 5000,
    }
  )
  return () => {
    navigator.geolocation.clearWatch(watcher)
  }
  }, [])
  
    return null
}

export default GeoUpdater