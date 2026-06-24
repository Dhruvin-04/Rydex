import connectDB from "@/lib/db";
import Booking from "@/models/booking.model";
import { NextResponse } from "next/server";

export async function GET(){
    try{
        await connectDB()
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const bookings = await Booking.find({ 
            paymentStatus: 'paid',
            createdAt: { $gte: sevenDaysAgo } 
        }).select('adminCommission createdAt');

        let earningMap: Record<string, number> = {};
        bookings.forEach(booking => {
            const date = new Date(booking.createdAt).toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
            })
            if(!earningMap[date]){
                earningMap[date] = 0;
            }
            earningMap[date] += booking.adminCommission || 0;
        })

        const earnings = Object.entries(earningMap).map(([date, earnings]) => ({ date, earnings }));
        return NextResponse.json({ earnings }, { status: 200 });
    }catch(error){
        console.error(error);
        return NextResponse.json({ error: "Failed to fetch earnings" }, { status: 500 });
    }
}