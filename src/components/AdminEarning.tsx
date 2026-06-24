'use client'
import axios from 'axios'
import { BarChart2, Star, TrendingDown, TrendingUp, Zap } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import {AnimatePresence, motion} from 'motion/react'
import {Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, XAxis, YAxis} from 'recharts'

type Earning = {
    date: string,
    earnings: number
}

const AdminEarning = () => {

    const [earningData, setEarningData] = useState<Earning[]>([])

    useEffect(() => {
        const fetchEarnings = async () => {
            try {
                const {data} = await axios.get("/api/admin/earning")
                const last7DaysData: Earning[] = data.earnings.slice(-7)
                setEarningData(last7DaysData)
            }catch (error) {
                console.error("Error fetching admin earnings:", error)
            }
        }
        fetchEarnings()
    }, [])

    const total = earningData.reduce((a, d) => a + d.earnings, 0)
    const avg = earningData.length?Math.round(total / earningData.length):0
    const max = earningData.length?Math.max(...earningData.map(d => d.earnings)):0
    const bestDay = earningData.find(d => d.earnings === max)?.date || "-"
    const today = earningData[earningData.length - 1]
    const yesterday = earningData[earningData.length - 2]
    const delta = today && yesterday ? today.earnings - yesterday.earnings : 0
    const deltaPositive = delta >= 0
    const deltaPercentage = yesterday ? Math.round((delta / yesterday.earnings) * 100) : 0

    const fmt = (n: number) => {
        return '₹ ' + n.toLocaleString()
    }

    const matrix = [
        {
            label: 'Best Day',
            value: fmt(max),
            sub: bestDay,
            icon: <Star size={14} />,
            color: 'text-violet-600',
            bg: 'bg-violet-50',
        },
        {
            label: 'Daily Average',
            value: fmt(avg),
            sub: 'per day',
            icon: <BarChart2 size={14} />,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
        },
        {
            label: 'Today',
            value: today ? fmt(today.earnings) : fmt(0),
            sub: today && yesterday
                ? `${deltaPositive ? '+' : ''}${fmt(delta)} vs yesterday`
                : '-',
            icon: <Zap size={14} />,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
        },

    ]

  return (
    <div className='bg-white rounded-3xl border border-gray-100 shadow-sm p-6 w-full'>
        <div className='flex items-center gap-3 mb-6 justify-between flex-wrap'>
            <div>
                <span className='inline-block bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full'>Admin DashBoard</span>
                <h2 className='text-lg font-semibold text-gray-800 mt-2'>
                    Daily Earnings
                </h2>
                <p className='text-sm text-gray-500'>
                    Last 7 days performance
                </p>
            </div>
            <div className='text-right'>
                <p className='text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-1'>Weekly Total</p>
                <motion.div
                    key={total}
                    initial={{opacity: 0, y: 8}}
                    animate={{opacity: 1, y: 0}}
                    exit={{opacity: 0, y: -8}}
                    className='text-3xl font-bold text-gray-800 font-mono tracking-tight'
                >
                    {fmt(total)}
                </motion.div>
                <div className={`flex items-center justify-end gap-1 text-xs font-semibold mt-1 ${deltaPositive ? 'text-emerald-600' : 'text-rose-500'}`}>
                    {deltaPositive ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                    <span>{deltaPercentage}% vs yesterday</span>
                </div>
            </div>
        </div>
        <div className='grid grid-cols-3 gap-4 mb-6'>
            {matrix.map((item, index) => (
                <motion.div
                    key={item.label}
                    initial={{opacity: 0, y: 12}}
                    animate={{opacity: 1, y: 0}}
                    exit={{opacity: 0, y: -12}}
                    transition={{delay: index * 0.05, duration: 0.2, ease: "easeOut"}}
                    className='bg-gray-50 rounded-2xl p-4'
                >
                    <div className={`flex items-center gap-1.5 text-[11px] uppercase tracking-wider mb-2 font-semibold ${item.color}`}>
                        <span className={`${item.bg} p-1 rounded-full`}>{item.icon}</span>
                        {item.label}
                    </div>
                    <p className='text-lg font-bold text-gray-800 font-mono tracking-tight'>{item.value}</p>
                    <p className='text-sm text-gray-500'>{item.sub}</p>
                </motion.div>
            ))}
        </div>
        <AnimatePresence>
            <motion.div
                initial={{opacity: 0, scale: 0.95}}
                animate={{opacity: 1, scale: 1}}
                exit={{opacity: 0, scale: 0.95}}
                transition={{duration: 0.2, ease: "easeOut"}}
                className='h-56'
            >
                <ResponsiveContainer width='100%' height='100%'>
                    <BarChart data={earningData} barCategoryGap={'30%'}>
                        <CartesianGrid strokeDasharray='3 3'stroke='#f0f0f0' vertical={false} />
                        <XAxis dataKey='date' tick={{fontSize: 12, fill: '#9ca3af', fontWeight: 500}} axisLine={false} tickLine={false} />
                        <YAxis tick={{fontSize: 12, fill: '#9ca3af'}} axisLine={false} tickLine={false} tickFormatter={(v)=> '₹' + (v>=1000?(v/1000).toFixed(1) + 'k': v)} />
                        <Bar dataKey='earnings' fill='#3b82f6' radius={[8, 8, 3, 3]} />
                        {earningData.map((entry, index) => {
                            const isToday = index === earningData.length - 1
                            const isBest = entry.earnings === max && !isToday
                            return (
                                <Cell 
                                    key={`cell-${index}`}
                                    fill={isToday ? '#10b981' : isBest ? '#8b5cf6' : '#bfdbfe'}
                                />
                            )
                        })}
                    </BarChart>
                </ResponsiveContainer>
            </motion.div>
        </AnimatePresence>
    </div>
  )
}

export default AdminEarning