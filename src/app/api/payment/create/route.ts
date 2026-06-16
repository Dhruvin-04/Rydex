import connectDB from "@/lib/db";
import { stripe } from "@/lib/stripe";
import Booking from "@/models/booking.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try{
        await connectDB()
        const {bookingId, paymentMode} = await req.json()
        const booking = await Booking.findById(bookingId)
        if(!booking) {
            return NextResponse.json({message: "Booking not found"}, {status: 404})
        }
        
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || req.nextUrl.origin || 'http://localhost:3000';

        if (paymentMode === 'CASH') {
            booking.paymentStatus = 'cash'
            booking.bookingStatus = 'confirmed'
            const adminCommission = booking.fare * 0.1; 
            booking.adminCommission = adminCommission;
            booking.partnerEarnings = booking.fare - adminCommission;
            await booking.save()
            return NextResponse.json({
                message: "Payment selected as cash", 
                url: `${baseUrl}/ride/${booking._id}`
            }, {status: 200})
        } else {
            const order = await stripe.checkout.sessions.create({
                mode: 'payment',
                line_items: [
                    {
                        price_data: {
                            currency: 'inr',
                            unit_amount: Math.round(booking.fare * 100), // Stripe expects amount in paise for INR
                            product_data: {
                                name: "Rydex Ride Fare",
                                description: `Ride from pickup to destination`
                            }
                        },
                        quantity: 1
                    }
                ],
                metadata: {
                    bookingId: booking._id.toString()
                },
                success_url: `${baseUrl}/api/payment/verify?session_id={CHECKOUT_SESSION_ID}&bookingId=${booking._id}`
            })
            return NextResponse.json({message: "Payment created successfully", url: order.url}, {status: 200})
        }
    }catch (error) {
        console.error(error)
        return NextResponse.json({message: "Error creating payment"}, {status: 500})
    }
}