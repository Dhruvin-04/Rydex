import { auth } from "@/auth"
import connectDB from "@/lib/db"
import Booking from "@/models/booking.model"
import User from "@/models/user.model"
import { NextResponse } from "next/server"

export async function GET() {
    try{
        await connectDB()
        const session = await auth()
        if(!session || !session.user?.email){
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
        const user = await User.findOne({ email: session.user.email })
        const booking = await Booking.findOne({
            driver: user?._id,
            bookingStatus: { $in: ['confirmed', 'started', 'completed'] }
        }).populate('user vehicle driver')
        return NextResponse.json(booking, { status: 200 })
    }catch(error){
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}