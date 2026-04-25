import { auth } from "@/auth";
import connectDB from "@/lib/db";
import PartnerBank from "@/models/partnerBank.model";
import PartnerDocs from "@/models/partnerDocs.model";
import User from "@/models/user.model";
import Vehicle from "@/models/vehicle.model";
import { NextRequest } from "next/server";

export async function GET(
    req: NextRequest,
    context: {params:Promise<{id:string}>}
){
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
        const vehicle = await Vehicle.findOne({owner: partner._id})
        const documents = await PartnerDocs.findOne({owner: partner._id})
        const bank = await PartnerBank.findOne({owner: partner._id})
        return Response.json({
            partner,
            vehicle: vehicle || null,       
            documents: documents || null,
            bank: bank || null
        }, { status: 200 })
    } catch (error) {
        return Response.json({message: "Internal server error"}, { status: 500 })
    }
}