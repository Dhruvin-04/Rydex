import { auth } from "@/auth";
import connectDB from "@/lib/db";
import PartnerBank from "@/models/partnerBank.model";
import PartnerDocs from "@/models/partnerDocs.model";
import User from "@/models/user.model";
import { NextRequest } from "next/server";

export async function POST(
    req: NextRequest, 
    context: { params: Promise<{ id: string }> }) {
    try {
        await connectDB()
        const session = await auth()
        if (!session || !session.user?.role || session.user.role !== "admin" || !session.user.email) {
            return Response.json({message: "Unauthorized"}, { status: 401 })
        }
        const {rejectionReason} = await req.json()
        const partnerId = (await context.params).id
        const partner = await User.findById(partnerId)
        if (!partner) {
            return Response.json({message: "Partner not found"}, { status: 404 })
        }


        partner.partnerStatus = "rejected"
        partner.rejectionReason = rejectionReason
        partner.partnerOnBoardingSteps = 4
        await partner.save()

        return Response.json({message: "Partner rejected successfully"}, { status: 200 })
    } catch (error) {
        return Response.json({message: "Error occurred while rejecting partner"}, { status: 500 })
    }
}