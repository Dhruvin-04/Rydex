import connectDB from "@/lib/db";
import Booking from "@/models/booking.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try{
        const id = (await context.params).id;
        await connectDB()
        const booking = await Booking.findById(id)
        if(!booking || booking.bookingStatus !== 'requested'){
            return NextResponse.json({ message: 'Booking not found or not in requested status' }, { status: 404 })
        }
        booking.bookingStatus = 'rejected'
        await booking.save()
        return NextResponse.json({ message: 'Booking rejected' }, { status: 200 })

    }catch(error){
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
    }
}