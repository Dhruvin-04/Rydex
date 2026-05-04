import { auth } from "@/auth";
import uploadOnCloudinary from "@/lib/cloudinary";
import connectDB from "@/lib/db";
import User from "@/models/user.model";
import Vehicle from "@/models/vehicle.model";
import { a } from "motion/react-client";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await connectDB()
        const session = await auth()
        if (!session || !session.user || !session.user.email) {
            return Response.json({ message: "Unauthorized" }, { status: 401 })
        }
        const partner = await User.findOne({ email: session.user.email })
        if (!partner) {
            return Response.json({ message: "Partner not found" }, { status: 404 })
        }

        const vehicle = await Vehicle.findOne({ owner: partner._id })
        if (!vehicle) {
            return Response.json({ message: "Vehicle not found" }, { status: 404 })
        }

        const formData = await req.formData()
        const image = formData.get("image") as File | null
        const baseFare = formData.get("baseFare")
        const pricePerKm = formData.get("pricePerKm")
        const waitingCharge = formData.get("waitingCharge")

        let updated = false
        if(image && image.size > 0){
            const imageUrl = await uploadOnCloudinary(image)
            vehicle.imageUrl = imageUrl
            updated = true
        }
        if(baseFare !== null && baseFare !== ""){
            vehicle.baseFare = Number(baseFare)
            updated = true
        }
        if(pricePerKm !== null && pricePerKm !== ""){
            vehicle.pricePerKm = Number(pricePerKm)
            updated = true
        }
        if(waitingCharge !== null && waitingCharge !== ""){
            vehicle.waitingCharge = Number(waitingCharge)
            updated = true
        }
        if(!updated){
            return Response.json({ message: "No fields to update" }, { status: 400 })
        }
        vehicle.status = "pending"
        vehicle.rejectionReason = undefined
        await vehicle.save()
        partner.partnerOnBoardingSteps = 6
        await partner.save()
        return Response.json({ message: "Pricing details updated successfully" }, { status: 200 })
    } catch (error) {
        return Response.json({ message: "Internal server error" }, { status: 500 })
    }
}

export async function GET() {
    try {
        await connectDB()
        const session = await auth()
        if (!session || !session.user || !session.user.email) {
            return Response.json({ message: "Unauthorized" }, { status: 401 })
        }
        const partner = await User.findOne({ email: session.user.email })
        if (!partner) {
            return Response.json({ message: "Partner not found" }, { status: 404 })
        }

        const vehicle = await Vehicle.findOne({ owner: partner._id })
        if (!vehicle) {
            return Response.json({ message: "Vehicle not found" }, { status: 404 })
        }
        return Response.json(vehicle, { status: 200 })
    } catch (error) {
        return Response.json({ message: "Internal server error" }, { status: 500 })
    }
}