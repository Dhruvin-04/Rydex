import { auth } from "@/auth"
import connectDB from "@/lib/db"
import Booking from "@/models/booking.model"
import User from "@/models/user.model"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
    try{
        await connectDB()
        const session = await auth()
        if(!session || !session.user?.email){
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
        const {bookingId} = await req.json()
        const booking = await Booking.findById(bookingId).populate('user vehicle driver')
        return NextResponse.json(booking, { status: 200 })
    }catch(error){
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}