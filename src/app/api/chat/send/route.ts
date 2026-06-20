import connectDB from "@/lib/db";
import ChatMessage from "@/models/chatMessage.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try{
        await connectDB()
        const { bookingId, sender, text } = await req.json()
        const msg = await ChatMessage.create({ bookingId, sender, text })
        return NextResponse.json(msg, { status: 200 })
    }catch(err){
        return NextResponse.json({message: 'Failed to send message'}, { status: 500 })
    }
}