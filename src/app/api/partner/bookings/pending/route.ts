import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/db";
import Booking from "@/models/booking.model";
import User from "@/models/user.model";

export async function GET(req: NextRequest) {
     try{
        await connectDB()
        const session = await auth()
        if (!session || !session.user?.role || !session.user.email) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
        }
        const partner = await User.findOne({ email: session.user.email })
        if (!partner) {
            return NextResponse.json({ message: "Partner not found" }, { status: 404 })
        }

        const bookings = await Booking.find({
            "driver": partner._id,
            "bookingStatus": "requested"
        }) 
        return NextResponse.json(bookings, { status: 200 })

    }catch(error){
        return NextResponse.json({ message: "Internal server error" }, { status: 500 })
    }
}