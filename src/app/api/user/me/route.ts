import { auth } from "@/auth";
import connectDB from "@/lib/db";
import User from "@/models/user.model";

export async function GET(req: Request) {
    try {
        await connectDB()
        const userSession = await auth()
        if(!userSession || !userSession.user) {
            return Response.json({message: 'Unauthorized'}, {status: 401})
        }
        const user = await User.findOne({email: userSession.user.email})
        if(!user){
            return Response.json({message: 'User not found'}, {status: 404})
        }
        return Response.json(user, {status: 200})
    } catch (error) {
        return Response.json({message: 'Internal server error'}, {status: 500})
    }
}