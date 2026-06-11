import { auth } from "@/auth";
import connectDB from "@/lib/db";
import Booking from "@/models/booking.model";
import User from "@/models/user.model";

export async function GET(request: Request) {
    try{
        await connectDB()
        const session = await auth()
        if(!session?.user?.id){
            return new Response(JSON.stringify({ booking: null }))
        }
        const user = await User.findOne({email: session.user.email})
        
        const booking = await Booking.findOne({
            user: user._id,
            bookingStatus: { $in: ['requested', 'awaiting_payment', 'confirmed', 'started'] }
        })

        if(!booking){
            return new Response(JSON.stringify({ booking: 'idle' }))
        }
        
        return new Response(JSON.stringify({ booking }))

    }catch(error){
        return new Response(JSON.stringify({ message: 'Internal server error' }), { status: 500 })
    }
}