import { auth } from "@/auth";
import connectDB from "@/lib/db";
import User from "@/models/user.model";
import Vehicle from "@/models/vehicle.model";
import { NextRequest } from "next/server";

export async function GET(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }) {
    try {
        await connectDB()
        const session = await auth()
        if (!session || !session.user?.role || session.user.role !== "admin" || !session.user.email) {
            return Response.json({ message: "Unauthorized" }, { status: 401 })
        }

        const vehicleId = (await context.params).id
        const vehicle = await Vehicle.findById(vehicleId).populate("owner")
        if (!vehicle) {
            return Response.json({ message: "Vehicle not found" }, { status: 404 })
        }
        vehicle.status = "approved"
        vehicle.rejectionReason = undefined
        await vehicle.save()
        const partner = await User.findById(vehicle.owner._id)
        if(!partner){
            return Response.json({ message: "Owner not found" }, { status: 404 })
        }
        partner.partnerOnBoardingSteps = 7
        await partner.save()
        return Response.json(vehicle, { status: 200 })
    } catch (error) {
        return Response.json({ message: "Internal server error" }, { status: 500 })
    }
}