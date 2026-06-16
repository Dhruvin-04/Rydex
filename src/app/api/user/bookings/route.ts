import { auth } from "@/auth";
import connectDB from "@/lib/db";
import Booking from "@/models/booking.model";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try{
        await connectDB()
        const session = await auth()
        if(!session || !session.user?.email) {
            return NextResponse.json({message: "Unauthorized"}, {status: 401})
        }
        const user = await User.findOne({email: session.user.email})
        const bookings = await Booking.find({user}).populate('user driver vehicle').sort({createdAt: -1})
        return NextResponse.json({bookings}, {status: 200})
    }catch(error){
        return NextResponse.json({message: "Error fetching bookings"}, {status: 400})
    }
}
