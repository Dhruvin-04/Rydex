import { auth } from "@/auth";
import connectDB from "@/lib/db";
import PartnerBank from "@/models/partnerBank.model";
import PartnerDocs from "@/models/partnerDocs.model";
import User from "@/models/user.model";
import { NextRequest } from "next/server";

export async function GET(
    req: NextRequest, 
    context: { params: Promise<{ id: string }> }) {
    try {
        await connectDB()
        const session = await auth()
        if (!session || !session.user?.role || session.user.role !== "admin" || !session.user.email) {
            return Response.json({message: "Unauthorized"}, { status: 401 })
        }

        const partnerId = (await context.params).id
        const partner = await User.findById(partnerId)
        if (!partner) {
            return Response.json({message: "Partner not found"}, { status: 404 })
        }

        const partnerDocs = await PartnerDocs.findOne({owner: partner._id})
        const partnerBank = await PartnerBank.findOne({owner: partner._id})

        if(!partnerDocs || !partnerBank) {
            return Response.json({message: "Partner documents or bank details not found"}, { status: 404 })
        }

        if(partner.partnerStatus === "approved") {
            return Response.json({message: "Partner is already approved"}, { status: 400 })
        }

        partner.partnerStatus = "approved"
        partner.videoKycStatus = "pending"
        partner.partnerOnBoardingSteps = 4
        await partner.save()
        partnerDocs.status = "approved"
        await partnerDocs.save()
        partnerBank.status = "verified"
        await partnerBank.save()

        return Response.json({message: "Partner approved successfully"}, { status: 200 })
    } catch (error) {
        return Response.json({message: "Error occurred while approving partner"}, { status: 500 })
    }
}