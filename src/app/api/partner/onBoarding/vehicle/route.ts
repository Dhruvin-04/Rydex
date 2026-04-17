import { auth } from "@/auth";
import connectDB from "@/lib/db";
import User from "@/models/user.model";
import Vehicle from "@/models/vehicle.model";

const VehicleRegularExpression = /^[A-Z]{2}[0-9]{1,2}[A-Z]{0,2}[0-9]{4}$/

export async function POST(req: Request) {
    try {
        await connectDB()
        const session = await auth()
        if (!session || !session.user || !session.user.email) {
            return Response.json({message: "Unauthorized"}, { status: 401 })
        }

        const user = await User.findOne({ email: session.user.email })
        if (!user) {
            return Response.json({message: "User not found"}, { status: 404 })
        }

        const {type, licensePlate, model} = await req.json()
        if(!type || !licensePlate || !model) {
            return Response.json({message: "Missing required fields"}, { status: 400 })
        }

        if(!VehicleRegularExpression.test(licensePlate)) {
            return Response.json({message: "Invalid license plate format"}, { status: 400 })
        }

        const vehicleNumber = licensePlate.toUpperCase()

        let vehicle = await Vehicle.findOne({ owner: user._id })
        if(vehicle){
            vehicle.type = type
            vehicle.licensePlate = vehicleNumber
            vehicle.model = model
            vehicle.status = "pending"
            await vehicle.save()
            return Response.json({message: "Vehicle updated successfully"}, { status: 200 })
        }

        const duplicateVehicle = await Vehicle.findOne({ licensePlate: vehicleNumber })
        if(duplicateVehicle && duplicateVehicle.owner.toString() !== user._id.toString()) {
            return Response.json({message: "License plate already in use"}, { status: 400 })
        }

        vehicle = await Vehicle.create({
            type,
            licensePlate: vehicleNumber,
            model,
            owner: user._id
        })
            

        if(user.partnerOnBoardingSteps < 1){
            user.partnerOnBoardingSteps = 1
            console.log("step=1")
        }
        user.role = "partner"
        await user.save()

        return Response.json(vehicle, { status: 201 })
        

    } catch (error) {
        return Response.json({message: "Error processing request"}, { status: 500 })
    }
}

export async function GET(req: Request) {
    try {
        await connectDB()
        const session = await auth()
        if (!session || !session.user || !session.user.email) {
            return Response.json({message: "Unauthorized"}, { status: 401 })
        }

        const user = await User.findOne({ email: session.user.email })
        if (!user) {
            return Response.json({message: "User not found"}, { status: 404 })
        }

        let vehicle = await Vehicle.findOne({ owner: user._id })

        if(vehicle){
            return Response.json(vehicle, { status: 200 })
        }else{
            return null
        }
    } catch (error) {
        return Response.json({message: "Error processing request"}, { status: 500 })
    }
}