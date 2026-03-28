import { auth } from "@/auth";
import connectDB from "@/lib/db";
import User from "@/models/user.model";
import { use } from "react";

export async function GET(req: Request) {
    try {
        await connectDB()
        const userSession = await auth()
        if(!userSession || !userSession.user) {
            return new Response(JSON.stringify({message: 'Unauthorized'}), {status: 401})
        }
        const user = await User.findOne({email: userSession.user.email})
        if(!user){
            return new Response(JSON.stringify({message: 'User not found'}), {status: 404})
        }
        return new Response(user, {status: 200})
    } catch (error) {
        return new Response(JSON.stringify({message: 'Internal server error'}), {status: 500})
    }
}