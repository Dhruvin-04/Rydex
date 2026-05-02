import { auth } from "@/auth";
import connectDB from "@/lib/db";
import User from "@/models/user.model";
import { NextRequest } from "next/server";

export async function GET(
    req: NextRequest, 
    context: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB()
        const session = await auth()
        if (!session || !session.user?.role || session.user.role !== "admin" || !session.user.email) {
            return Response.json({message: "Unauthorized"}, { status: 401 })
        }

        const partnerId = (await context.params).id
        const partner = await User.findById(partnerId)
        if (!partner || partner.role !== "partner") {
            return Response.json({message: "Partner not found"}, { status: 404 })
        }
        const roomId = `kyc-${partner._id}-${Date.now()}`
        partner.videoKycRoomId = roomId
        partner.videoKycStatus = "in_progress"
        partner.partnerOnBoardingSteps = 4
        await partner.save()
        return Response.json({ roomId })
    } catch (error) {
        return Response.json({message: "Internal server error"}, { status: 500 })
    }
}