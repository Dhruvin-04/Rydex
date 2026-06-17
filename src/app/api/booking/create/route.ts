import { auth } from "@/auth";
import connectDB from "@/lib/db";
import Booking from "@/models/booking.model";
import User from "@/models/user.model";
import axios from "axios";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try{
        await connectDB()
        const session = await auth()
        if(!session?.user?.id){
            return NextResponse.json({error: "Unauthorized"}, {status: 401})
        }

        const { driverId, vehicleId, pickupAddress, dropAddress, pickupLocation, dropLocation, fare, mobileNumber } = await request.json()
        if(!driverId || !vehicleId || !pickupLocation || !dropLocation){
            return NextResponse.json({error: "Missing required fields"}, {status: 400})
        }
        const userId = new mongoose.Types.ObjectId(session.user.id)
        const driver = await User.findById(driverId)
        if(!driver){
            return NextResponse.json({error: "Driver not found"}, {status: 404})
        }
        const existingBooking = await Booking.findOne({ user: userId, bookingStatus: { $in: ["requested", "awaiting_payment", "confirmed", "started"] } })
        if(existingBooking){
            return NextResponse.json(existingBooking)
        }

        const booking = await Booking.create({
            user: userId,
            driver,
            vehicle: vehicleId,
            pickupAddress,
            dropAddress,
            pickupLocation,
            dropLocation,
            fare,
            userMobile: mobileNumber,
            driverMobile: driver.mobileNumber,
            bookingStatus: "requested",
        })
        await axios.post(`${process.env.NEXT_PUBLIC_SOCKET_SERVER_URL}/emit`, {
            event: 'newBooking',
            userId: driverId,
            data: booking
        })
        return NextResponse.json(booking, {status: 200})
    }catch(error){
        console.error(error)
        return NextResponse.json({error: "Internal Server Error"}, {status: 500})
    }
}
