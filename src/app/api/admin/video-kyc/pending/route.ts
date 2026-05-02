import { auth } from "@/auth"
import connectDB from "@/lib/db"
import User from "@/models/user.model"

export async function GET() {
    try {
        await connectDB()
        const session = await auth()
        if (!session || !session.user?.role || session.user.role !== "admin" || !session.user.email) {
            return Response.json({message: "Unauthorized"}, { status: 401 })
        }
        const partner = await User.find({
            role: "partner",
            partnerOnBoardingSteps: 4,
            videoKycStatus: {$in: ["pending", "in_progress"]}, 
        })
        return Response.json({partners: partner}, { status: 200 })
    } catch (error) {
        return Response.json({message: "Error occurred while fetching pending video KYC requests"}, { status: 500 })
    }
}