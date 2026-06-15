import connectDB from "@/lib/db";
import Booking from "@/models/booking.model";
import { NextRequest, NextResponse } from "next/server";

import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
export async function POST(req: NextRequest) {
    const sig = req.headers.get("stripe-signature")!
    const rawBody = await req.text()
    let event
    try{
        event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET!)
    }catch (error: any) {
        console.error("Error verifying webhook signature:", error.message)
        return NextResponse.json({message: `Webhook Error: ${error.message}`}, {status: 400})
    }
    if(event?.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session
        await connectDB()
        await Booking.findByIdAndUpdate(session?.metadata?.bookingId, {
            bookingStatus: "confirmed",
            paymentStatus: "paid"
        })
    }
    return NextResponse.json({message: "Webhook received"}, {status: 200})
}