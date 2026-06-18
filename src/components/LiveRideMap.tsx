'use client'
import React, { useEffect, useState } from 'react'
import { MapContainer, Marker, Polyline, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';

type LiveRideMapProps = {
    driverLocation: [number, number] | null;
    pickUpLocation: [number, number] | null;
    dropLocation: [number, number] | null;
    mapStatus?: 'arriving' | 'ongoing' | 'completed';
}

const pickUpIcon = new L.DivIcon({
    html: `<div style='display: flex; flex-direction: column; align-items: center; filter: drop-shadow(0px 4px 12px rgba(0, 0, 0, 0.3));'>
    <div style='background: #0a0a0a; color: #fff; padding: 4px 12px; border-radius: 10px; font-size: 10px; font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase; white-space: nowrap; font-family: -apple-system, system-ui'>
      PICKUP
    </div>
    <div style='width: 2px; height:10px; background: #0a0a0a'></div>
    <div style='width: 10px; height: 10px; background: #0a0a0a; border-radius: 50%; border: 2px solid #fff; box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);'></div>
  </div>`,
    iconSize: [80, 50],
    iconAnchor: [40, 50],
    className: "",
})
const dropIcon = new L.DivIcon({
    html: `<div style='display: flex; flex-direction: column; align-items: center; filter: drop-shadow(0px 4px 12px rgba(0, 0, 0, 0.3));'>
    <div style='background: #0a0a0a; color: #fff; padding: 4px 12px; border-radius: 10px; font-size: 10px; font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase; white-space: nowrap; font-family: -apple-system, system-ui'>
      DROP
    </div>
    <div style='width: 2px; height:10px; background: #0a0a0a'></div>
    <div style='width: 10px; height: 10px; background: #0a0a0a; border-radius: 50%; border: 2px solid #fff; box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);'></div>
  </div>`,
    iconSize: [70, 50],
    iconAnchor: [35, 50],
    className: "",
})
const driverIcon = new L.DivIcon({
    html: `<div id='car-marker' style=
    'width: 52px; height: 52px; 
    display: flex; align-items: center; justify-content: center; transform-origin: center; 
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); 
    filter: drop-shadow(0px 6px 18px rgba(0, 0, 0, 0.5));
    '>
        <div style='background: #0a0a0a; width: 46px; height: 46px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 0 3px #fff, 0 0 0 5px #0a0a0a, 0 8px 28px rgba(0,0,0,0.5)'>
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' width='22' height='22'>
                <path d='M5 11L6.5 6.5H17.5L19 11' stroke='white' stroke-width='1.6' stroke-linecap='round'/>
                <rect x='3' y='11' width='18' height='7' rx='2' stroke='white' stroke-width='1.6'/>
                <circle cx='7.5' cy='18.5' r='1.5' fill='#fff'/>
                <circle cx='16.5' cy='18.5' r='1.5' fill='#fff'/>
                <path d='M3 14H21' stroke='#fff' stroke-width='1' opacity='0.35'/>
            </svg>
        </div>
    </div>`,
    iconSize: [52, 52],
    iconAnchor: [26, 26],
    className: "",
})




const LiveRideMap = ({ driverLocation, pickUpLocation, dropLocation, mapStatus }: LiveRideMapProps) => {

    const [routeToPickup, setRouteToPickup] = useState<[number, number] | []>([])
    const [routeToDrop, setRouteToDrop] = useState<[number, number] | []>([])

    useEffect(() => {
        if (!driverLocation) return
        const [pLat, pLong] = pickUpLocation ?? [0, 0]
        const [dLat, dLong] = dropLocation ?? [0, 0]
        const [drLat, drLong] = driverLocation
        const getRoute = async (startLat: number, startLng: number, endLat: number, endLng: number) => {
            const res = await axios.get(`https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson`)
            return res.data.routes?.[0]
        }
        const fetchRoute = async () => {
            try {
                if (mapStatus === 'arriving') {
                    const pickupRoute = await getRoute(drLat, drLong, pLat, pLong)
                    const dropRoute = await getRoute(drLat, drLong, dLat, dLong)

                    if (pickupRoute) setRouteToPickup(pickupRoute.geometry.coordinates.map(([lon, lat]: number[]) => [lat, lon]))

                    if (dropRoute) setRouteToDrop(dropRoute.geometry.coordinates.map(([lon, lat]: number[]) => [lat, lon]))
                } else {
                    setRouteToPickup([])
                    const dropRoute = await getRoute(drLat, drLong, dLat, dLong)
                    if (dropRoute) setRouteToDrop(dropRoute.geometry.coordinates.map(([lon, lat]: number[]) => [lat, lon]))
                }
            } catch (error) {
                console.error('Error fetching route:', error)
            }
        }
        fetchRoute()
    }, [driverLocation, mapStatus])

    const showPickUpMarker = mapStatus === 'arriving'
    const showPickUpRoute = mapStatus === 'arriving' && routeToPickup.length > 0
    const showDropRoute = mapStatus !== 'completed' && routeToDrop.length > 0

    return (
        <div className='relative h-full w-full bg-zinc-100'>
            <MapContainer
                style={{ width: "100%", height: "100%" }}
                center={pickUpLocation ?? [0, 0]}
                zoom={13}
                zoomControl={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://carto.com/">"CARTO"</a> contributors'
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
                />

                {showPickUpMarker && <Marker
                    position={pickUpLocation ?? [0, 0]}
                    icon={pickUpIcon}
                    draggable

                />}
                {dropLocation && <Marker
                    position={dropLocation ?? [0, 0]}
                    icon={dropIcon}
                    draggable

                />}
                {driverLocation && <Marker
                    position={driverLocation ?? [0, 0]}
                    icon={driverIcon}
                    draggable

                />}

                {showPickUpRoute && (<Polyline
                    positions={routeToPickup as any}
                    pathOptions={{ color: '#888', weight: 4, dashArray: "2 10", lineJoin: 'round' }}
                />)}
                {showDropRoute && (<Polyline
                    positions={routeToDrop as any}
                    pathOptions={{ color: '#0a0a0a', weight: 3, lineCap: 'round', lineJoin: 'round' }}
                />)}

            </MapContainer>

        </div>
    )
}

export default LiveRideMap