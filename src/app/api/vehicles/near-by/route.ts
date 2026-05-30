import connectDB from "@/lib/db";
import User from "@/models/user.model";
import Vehicle from "@/models/vehicle.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try{
        await connectDB()
        const {latitude, longitude, vehicleType} = await request.json()
        if(!latitude || !longitude || !vehicleType) {
            return NextResponse.json({error: 'Missing required fields'}, {status: 400})
        }
        const parters = await User.find({
            role: 'partner',
            isOnline: true,
            partnerStatus: 'approved',
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [longitude, latitude]
                    },
                    $maxDistance: 10000
                }
            }
        })

        const partnersIds = parters.map(p => p._id)
        console.log("Nearby Partner IDs:", partnersIds)
        if(partnersIds.length === 0) {
            return NextResponse.json({message: 'No nearby vehicles found'}, {status: 200})
        }

        const vehicles = await Vehicle.find({
            owner: { $in: partnersIds },
            type: vehicleType,
            status: 'approved',
            isActive: true
        }).lean()

        return NextResponse.json(vehicles, {status: 200})
    }catch(err){
        console.error("Error fetching nearby vehicles:", err)
        return NextResponse.json({error: 'Server error'}, {status: 500})
    }
}