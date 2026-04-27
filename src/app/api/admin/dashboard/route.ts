import { auth } from "@/auth";
import connectDB from "@/lib/db";
import User from "@/models/user.model";
import Vehicle from "@/models/vehicle.model";
import { stat } from "fs";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        await connectDB()
        const session = await auth()
        if (!session || !session.user?.role || session.user.role !== "admin" || !session.user.email) {
            return Response.json({message: "Unauthorized"}, { status: 401 })
        }
        const totalPartners = await User.countDocuments({ role: "partner" })
        const totalApprovedPartners = await User.countDocuments({ role: "partner", partnerStatus: "approved" })
        const totalPendingPartners = await User.countDocuments({ role: "partner", partnerStatus: "pending" })
        const totalRejectedPartners = await User.countDocuments({ role: "partner", partnerStatus: "rejected" })

        const pendingPartnerUsers = await User.find({ 
            role: "partner", 
            partnerStatus: "pending", 
            partnerOnBoardingSteps: {$gte: 3} })
        const partnerIds = pendingPartnerUsers.map(user => user._id)
        const partnerVehicles = await Vehicle.find({ owner: { $in: partnerIds } })
        const vehicleTypeMap = new Map(
            partnerVehicles.map((v)=>[String(v.owner), v.type])
        )
        const pendingPartnersReviews = pendingPartnerUsers.map(user => ({
            _id: user._id,
            name: user.name,
            email: user.email,
            vehicleType: vehicleTypeMap.get(String(user._id)) || "N/A"
        }))

        return NextResponse.json({
            stats:{
                totalPartners,
                totalApprovedPartners,
                totalPendingPartners,
                totalRejectedPartners,
            },
            pendingPartnersReviews
        }, { status: 200
        })
    } catch (error) {
        return NextResponse.json({message: "Admin Dashboard Error"}, { status: 500 })
    }
}