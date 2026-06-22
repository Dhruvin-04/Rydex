import connectDB from "@/lib/db";
import { sendEmail } from "@/lib/sendEmail";
import Booking from "@/models/booking.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
    try{
        await connectDB()
        const {bookingId} = await req.json()
        const booking = await Booking.findById(bookingId).populate('user')

        if(!booking){
            return NextResponse.json({error: "Booking not found"}, {status: 404})
        }

        const otp = Math.floor(1000 + Math.random() * 9000).toString()

        booking.pickupOtp = otp
        booking.pickupOtpExpires = new Date(Date.now() + 5 * 60 * 1000)
        await booking.save()
        
        if(booking.user.email){
            await sendEmail(
                booking.user.email,
                "Your Pickup OTP - RYDEX",
                `
                    <div style='font-family:sans-serif; padding: 20px>
                    <h2>Ride OTP</h2>
                    <p>Your pickup OTP is:</p>
                    <h1 style='letter-spacing:6px'>${otp}</h1>
                    <p>This OTP is valid for 5 minutes</p>
                    <p>Share this OTP with your driver to start the ride</p>
                    <br/>
                    <b>Rydex</b>
                    </div>
                `
            )
        } 
        
        return NextResponse.json({message: "OTP sent successfully"}, {status: 200}) 
    }catch(error){  
        return NextResponse.json({error: "Internal server error"}, {status: 500}) 
    }   
}