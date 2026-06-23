'use client'
import React from 'react'
import { motion } from 'motion/react'
import { CheckCircle2, IndianRupee, User } from 'lucide-react'
import { useRouter } from 'next/navigation'

const PAYMENT_BADGE: Record<any, {label: string; cls: string}> = {
    pending: { label: 'Pending', cls: 'bg-amber-100 text-amber-700' },
    paid: { label: 'Paid', cls: 'bg-emerald-100 text-emerald-700' },
    cash: { label: 'Cash', cls: 'bg-zinc-100 text-zinc-700' },
    failed: { label: 'Failed', cls: 'bg-red-100 text-red-700' },
}

const CompletedScreen = ({ booking, role }: { booking: any, role: string }) => {

    const router = useRouter()

  return (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className='h-screen w-full bg-zinc-950 flex flex-col overflow-y-auto'
    >
        <div className='flex-1 flex flex-col items-center justify-center text-white text-center px-6 py-12'>
            <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className='mb-8'
            >
                <div className='w-32 h-32 rounded-full bg-emerald-400/10 flex items-center justify-center'>
                    <div className='w-24 h-24 rounded-full bg-emerald-400/20 flex items-center justify-center'>
                        <CheckCircle2 size={52} className='text-emerald-400' />
                    </div>
                </div>
            </motion.div>
            <motion.div
                initial={{ y: 24, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className='max-w-sm text-center w-full'
            >
                <p className='text-zinc-400 text-xs uppercase tracking-widest fonse,-semibold mb-2'>
                    Trip Complete
                </p>
                <h1 className='text-white text-3xl font-bold'>Ride Completed</h1>
                <p className='text-zinc-300 text-sm mb-8'>
                    {role === 'user' ? 'Thank you for choosing our service!' : 'Your have successfully dropped the customer off!'}
                </p>
                <div className='bg-zinc-800 rounded-2xl p-4 mb-3'>
                    <p className='text-zinc-300'>Fare Collected</p>
                    <p className='text-2xl font-bold text-emerald-400 flex items-center justify-center mt-1'>
                        <IndianRupee size={20} />{booking?.fare}
                    </p>
                    <div className='flex items-center justify-between text-xs border-t border-zinc-800 pt-3'>
                        <span className='text-zinc-400'>Payment Status</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${PAYMENT_BADGE[booking?.paymentStatus || 'pending'].cls}`}>
                            {PAYMENT_BADGE[booking?.paymentStatus || 'pending'].label}
                        </span>
                    </div>
                </div>

                {booking?.user && (
                    <div className='bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex items-center gap-3 mb-3'>
                        <div className='w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center'>
                            <User size={20} className='text-zinc-400' />
                        </div>
                        <div>
                            <p className='text-zinc-500 text-xs uppercase tracking-wider font-semibold'>Customer</p>
                            <p className='text-white text-sm font-bold'>{booking?.user?.name ?? 'user'}</p>
                        </div>
                    </div>
                )}

                <button 
                    className='bg-emerald-400 text-zinc-950 font-semibold py-3 px-6 rounded-full w-full mt-4 hover:bg-emerald-500 transition-colors'
                    onClick={() => router.push('/')}
                >
                    Back to Home
                </button>

            </motion.div>
        </div>
    </motion.div>
  )
}

export default CompletedScreen