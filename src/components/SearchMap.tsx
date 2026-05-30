'use client'
import React, { useEffect, useState } from 'react'
import { MapContainer, Marker, Polyline, TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet'
import axios from 'axios'
import { p } from 'motion/react-client'
import { set } from 'mongoose'
import { AnimatePresence, motion } from 'motion/react'
import { read } from 'fs'
import { Navigation2 } from 'lucide-react'

function FitBounds({ p1, p2 }: { p1: [number, number], p2: [number, number] }) {
  const map = useMap()
  useEffect(() => {
    map.invalidateSize()
    map.fitBounds([p1, p2], { padding: [70, 70], maxZoom: 15, animate: true, duration: 0.7 })
  }, [p1, p2, map])
  return null
}

const pickUpIcon = new L.DivIcon({
  html: `<div style='display: flex; flex-direction: column; align-items: center; filter: drop-shadow(0px 1px 1px rgba(0, 0, 0, 0.3));'>
    <div style='background: #0a0a0a; color: #fff; padding: 4px 12px; border-radius: 10px; font-size: 8px; font-weight: bold; letter-spacing: 0.14em; text-transform: uppercase; white-space: nowrap; font-family: -apple-system, system-ui, sans-serif; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);'>
      Pickup
    </div>
    <div style='width: 2px; height:10px; background: #0a0a0a; opacity: 0.4;'></div>
    <div style='width: 13px; height: 13px; background: #0a0a0a; border-radius: 50%; border: 2px solid #fff; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);'></div>
  </div>`
})

const dropIcon = new L.DivIcon({
  html: `<div style='display: flex; flex-direction: column; align-items: center; filter: drop-shadow(0px 1px 1px rgba(0, 0, 0, 0.3));'>
    <div style='background: #0a0a0a; color: #fff; padding: 4px 12px; border-radius: 10px; font-size: 8px; font-weight: bold; letter-spacing: 0.14em; text-transform: uppercase; white-space: nowrap; font-family: -apple-system, system-ui, sans-serif; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);'>
      Drop
    </div>
    <div style='width: 2px; height:10px; background: #0a0a0a; opacity: 0.4;'></div>
    <div style='width: 13px; height: 13px; background: #0a0a0a; border-radius: 50%; border: 2px solid #fff; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);'></div>
  </div>`,
  className: "",
  iconSize: [90, 58],
  iconAnchor: [45, 58],
})
const SearchMap = ({ pickup, drop, onChange, onDistance }: { pickup: string; drop: string; onChange: (pickup: string, drop: string) => void; onDistance: (km: number) => void }) => {
  const [p1, setP1] = useState<[number, number]>()
  const [p2, setP2] = useState<[number, number]>()
  const [route, setRoute] = useState<[number, number][]>([])
  const [km, setKm] = useState<number>(0)
  const [ready, setReady] = useState(false)

  const geoCoding = async (q: string): Promise<[number, number] | null> => {
    try {
      const { data } = await axios.get(`https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&limit=1`)
      if (!data.features || data.features.length === 0) {
        console.warn(`No geocoding results for query: ${q}`)
        return null
      }
      const [lon, lat] = data.features[0].geometry.coordinates
      return [lat, lon]
    } catch (error) {
      console.error("Error fetching geocoding data:", error)
      return null
    }
  }

  const reverseGeocoding = async (lat: number, lng: number) => {
    
      const { data } = await axios.get(`https://photon.komoot.io/reverse?lon=${lng}&lat=${lat}`)
      if (data.features.length) {
        const p = data.features[0].properties
        const address = [p.name, p.street, p.city, p.state, p.country].filter(Boolean).join(', ')
        return address
      }else return
  }

  const loadRoute = async (p: [number, number], d: [number, number]) => {
      try {
        const { data } = await axios.get(`https://router.project-osrm.org/route/v1/driving/${p[1]},${p[0]};${d[1]},${d[0]}?overview=full&geometries=geojson`)
        if (!data.routes.length) return;
        setRoute(data.routes[0].geometry.coordinates.map((c: number[]) => [c[1], c[0]]))
        const distanceInKm = (data.routes[0].distance / 1000).toFixed(2)
        setKm(parseFloat(distanceInKm))
        onDistance(parseFloat(distanceInKm))
      } catch (error) {
        console.log(error)
      }
    }

    const dragPickUp = async (lat: number, lng: number) => {
      const address = await reverseGeocoding(lat, lng)
      setP1([lat, lng])
      loadRoute([lat, lng], p2!)
      onChange?.(address!, drop)
    }
    const dragDrop = async (lat: number, lng: number) => {
      const address = await reverseGeocoding(lat, lng)
      setP2([lat, lng])
      loadRoute(p1!, [lat, lng])
      onChange?.(pickup, address!)
    }

    useEffect(() => {
      setReady(false)
      if (pickup && drop) {
        (async () => {
          const a = await geoCoding(pickup)
          const b = await geoCoding(drop)
          if (!a || !b) {
            console.warn("Geocoding failed for one or both locations.")
            return
          }
          await loadRoute(a, b)
          setP1(a)
          setP2(b)
          setReady(true)
        })()
      }
    }, [pickup, drop])

    return (
      <div className='relative h-full w-full bg-zinc-100'>
        <MapContainer
          style={{ width: "100%", height: "100%" }}
          center={p1 ?? [0, 0]}
          zoom={13}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">"CARTO"</a> contributors'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
          />

          {p1 && p2 && <FitBounds p1={p1} p2={p2} />}
          {p1 && <Marker
            position={p1 ?? [0, 0]}
            icon={pickUpIcon}
            draggable
            eventHandlers={{
              dragend: e => {
                const m = e.target.getLatLng()
                dragPickUp(m.lat, m.lng)
              }
            }}
          />}
          {p2 && <Marker
            position={p2 ?? [0, 0]}
            icon={dropIcon}
            draggable
            eventHandlers={{
              dragend: e => {
                const m = e.target.getLatLng()
                dragDrop(m.lat, m.lng)
              }
            }}
          />}
          {route.length > 0 && (
            <Polyline positions={route} pathOptions={{ color: '#0a0a0a', weight: 3, lineCap: 'round', lineJoin: 'round' }} />
          )}
        </MapContainer>
        <AnimatePresence>
          {!ready && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className='absolute top-0 left-0 w-full h-full bg-zinc-100/80 backdrop-blur-sm flex items-center justify-center z-500'
            >
              <div className='text-zinc-900 text-lg font-medium'>Loading map...</div>

            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {ready && km !== null && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              className='absolute bottom-20 left-4 px-4 py-2 rounded-full text-sm font-medium shadow-lg z-500 flex items-center gap-2 bg-white border border-zinc-200'
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <Navigation2 size={13} className='text-zinc-900' />
              <span className='font-bold text-zinc-900 text-xs'>{km} km</span>
              <span className='w-px h-3 bg-zinc-200' />
              <span className='font-bold text-zinc-900 text-xs'>~{Math.max(3, Math.round((km / 25) * 60))} min</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  export default SearchMap