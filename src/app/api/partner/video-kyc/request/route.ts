import { auth } from "@/auth"
import connectDB from "@/lib/db"
import User from "@/models/user.model"

export async function GET() {
    try {
        await connectDB()
        const session = await auth()
        if (!session || !session.user?.role || session.user.role !== "admin" || !session.user.email) {
            return Response.json({ message: "Unauthorized" }, { status: 401 })
        }
        const partner = await User.findOne({ email: session.user.email })
        if (!partner) {
            return Response.json({ message: "Partner not found" }, { status: 404 })
        }
        if(partner.videoKycStatus !== "rejected"){
            return Response.json({ message: "No pending video KYC requests" }, { status: 404 })
        }
        partner.videoKycStatus = "pending"
        partner.videoKycRejectionReason = undefined
        partner.videoKycRoomId = undefined
        await partner.save()
        return Response.json({ message: "Video KYC resubmitted successfully" }, { status: 200 })
    } catch (error) {
        return Response.json({ message: "Internal server error" }, { status: 500 })
    }
}