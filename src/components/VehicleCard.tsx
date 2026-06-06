'use client'
import { vehicleType } from '@/models/vehicle.model';
import React from 'react'
import { motion } from 'motion/react'
import { ArrowRight, Bike, Car, Clock, Gauge, IndianRupee, Star, Truck } from 'lucide-react';

const VEHICLE_META: any = {
    bike: { label: 'Bike', Icon: Bike },
    auto: { label: 'Auto', Icon: Car },
    car: { label: 'Car', Icon: Car },
    loading: { label: 'Loading', Icon: Truck },
    truck: { label: 'Truck', Icon: Truck },
}

export interface IVehicle {
    owner: string
    type: vehicleType;
    imageUrl?: string;
    model: string;
    baseFare?: number;
    pricePerKm?: number;
    waitingCharge?: number;
    licensePlate: string;
    status: "approved" | "pending" | "rejected";
    rejectionReason?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const VehicleCard = ({ vehicle, distance, onBook }: { vehicle: IVehicle; distance: number | undefined; onBook: () => void }) => {
    const { Icon, label } = VEHICLE_META[vehicle.type] || { label: 'Unknown', Icon: Car }
    let estimated: number = 0
    if (vehicle.baseFare && vehicle.pricePerKm && distance) {
        estimated = Math.round(vehicle.baseFare + vehicle.pricePerKm * distance)
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -6 }}
            transition={{ delay: 0.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className='bg-white rounded-2xl shadow-md flex flex-col gap-2 border border-zinc-200 relative overflow-hidden group cursor-default'
            style={{ boxShadow: '0 2px 16px rgba(0, 0, 0, 0.06)' }}
        >
            <div className='relative h-48 bg-zinc-50 flex items-center justify-center rounded-lg overflow-hidden'>
                <div
                    className='absolute inset-0 opacity-[0.04]'
                    style={{
                        backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
                        backgroundSize: '24px 24px'
                    }}
                />

                <motion.img
                    src={vehicle.imageUrl}
                    alt={vehicle.model}
                    className='relative z-10 h-32 w-full object-contain'
                    style={{ filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))' }}
                    whileHover={{ scale: 1.05, filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))' }}
                    transition={{ duration: 0.3 }}
                />
                <div className='absolute bottom-3 right-3 z-20 bg-zinc-900 backdrop-blur-sm px-2 py-1 rounded-full text-[10px] uppercase tracking-wider font-medium text-white shadow-sm flex items-center gap-1'>
                    <Icon size={10} />
                    {label}
                </div>
                <div className='absolute bottom-3 left-3 z-20 px-2 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold text-black shadow-sm flex items-center gap-1'>
                    <Star size={10} className='fill-zinc-900 text-zinc-900' />
                    4.8
                </div>
            </div>

            <div className='h-px bg-zinc-100' />

            <div className='flex flex-col flex-1 p-4 gap-4'>
                <div className='flex items-start justify-between gap-3'>
                    <div className='min-w-0'>
                        <h3 className='text-base font-black tracking-tight leading-tight truncate text-zinc-900'>{vehicle.model}</h3>
                        <div className='mt-1 inline-flex items-center bg-zinc-100 px-3 py-1 rounded-lg border border-zinc-200'>
                            <span className='text-xs font-black text-zinc-900 tracking-normal font-mono uppercase'>{vehicle.licensePlate}</span>
                        </div>
                    </div>
                    <div className="shrink-0 w-10 h-10 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center">
                        <Icon size={16} className='text-zinc-700 mr-1' />
                    </div>
                </div>
                <div className='grid grid-cols-2 gap-2'>
                    <div className='bg-zinc-50 border border-zinc-100 rounded-2xl px-4 py-3'>
                        <div className='flex items-center gap-2 mb-1'>
                            <Gauge size={14} className='text-zinc-400' />
                            <p className='text-zinc-400 text-[10px] tracking-widest font-bold'>PER KM</p>
                        </div>
                        <p className='text-zinc-900 text-sm flex items-center font-black'>
                            <IndianRupee size={12} />
                            {vehicle.pricePerKm}
                        </p>
                    </div>
                    <div className='bg-zinc-50 border border-zinc-100 rounded-2xl px-4 py-3'>
                        <div className='flex items-center gap-2 mb-1'>
                            <Clock size={14} className='text-zinc-400' />
                            <p className='text-zinc-400 text-[10px] tracking-widest font-bold'>Waiting</p>
                        </div>
                        <p className='text-zinc-900 text-sm flex items-center font-black'>
                            <IndianRupee size={12} />
                            {vehicle.waitingCharge} / min
                        </p>
                    </div>
                    <div className='flex items-end justify-between pt-3 border-t border-zinc-100'>
                        <div>
                            <p className='text-zinc-400 text-[10px] tracking-widest font-bold'>Est. Fare</p>
                            <motion.div
                                key={estimated}
                                initial={{ opacity: 0, y: 4 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className='text-zinc-900 text-sm flex items-baseline font-black'
                            >
                                <IndianRupee size={12} className='text-zinc-900 mb-0.5' strokeWidth={2.5} />
                                <span className='text-zinc-900 text-2xl tracking-tight leading-none font-black'>{estimated}</span>
                            </motion.div>
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className='bg-zinc-900 hover:bg-black text-white font-bold py-2 px-2 rounded-2xl shadow-md transition-colors duration-200 flex items-center justify-center mt-4'
                        onClick={onBook}
                    >
                        Book
                        <motion.div
                            initial={{ x: 0 }}
                            whileHover={{ x: 3 }}
                            transition={{ duration: 0.3 }}
                        >
                            <ArrowRight size={14} className='ml-1' />
                        </motion.div>
                    </motion.button>
                </div>

            </div>
        </motion.div>
    )
}

export default VehicleCard