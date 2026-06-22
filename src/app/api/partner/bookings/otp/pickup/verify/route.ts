import connectDB from "@/lib/db";
import { sendEmail } from "@/lib/sendEmail";
import Booking from "@/models/booking.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
    try{
        await connectDB()
        const {bookingId, otp} = await req.json()
        const booking = await Booking.findById(bookingId).populate('user')

        if(!booking){
            return NextResponse.json({error: "Booking not found"}, {status: 404})
        }

        if(!booking.pickupOtp || booking.pickupOtp !== otp){
            return NextResponse.json({error: "Invalid OTP"}, {status: 400})
        }

        if(booking.pickupOtpExpires < new Date()){
            return NextResponse.json({error: "OTP expired"}, {status: 400})
        }

        booking.bookingStatus = 'started'
        booking.pickupOtp = ""
        booking.pickupOtpExpires = undefined
        await booking.save()
        
        return NextResponse.json({message: "Ride started successfully"}, {status: 200}) 
    }catch(error){  
        return NextResponse.json({error: "Internal server error"}, {status: 500}) 
    }   
}