import connectDB from "@/lib/db";
import { stripe } from "@/lib/stripe";
import Booking from "@/models/booking.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const sessionId = searchParams.get('session_id');
        const bookingId = searchParams.get('bookingId');

        if (!sessionId || !bookingId) {
            return NextResponse.json({ message: "Invalid request, missing parameters" }, { status: 400 });
        }

        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_status === 'paid') {
            await connectDB();
            
            // Check current status before updating to avoid unnecessary database calls
            const booking = await Booking.findById(bookingId);
            
            if (booking && booking.paymentStatus !== 'paid') {
                booking.paymentStatus = 'paid';
                booking.bookingStatus = 'confirmed';
                await booking.save();
            }

            // Redirect back to the ride page
            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || req.nextUrl.origin;
            return NextResponse.redirect(`${baseUrl}/ride/${bookingId}`);
        } else {
            return NextResponse.json({ message: "Payment not completed" }, { status: 400 });
        }
    } catch (error) {
        console.error("Error verifying payment manually:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
