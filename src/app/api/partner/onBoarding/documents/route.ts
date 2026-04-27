import { auth } from "@/auth"
import uploadOnCloudinary from "@/lib/cloudinary"
import connectDB from "@/lib/db"
import PartnerDocs from "@/models/partnerDocs.model"
import User from "@/models/user.model"
import Vehicle from "@/models/vehicle.model"

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

        const formdata = await req.formData()
        const aadhaar = formdata.get("aadhaar") as Blob | null
        const license = formdata.get("license") as Blob | null
        const rc = formdata.get("rc") as Blob | null
        if(!aadhaar || !license || !rc) {
            return Response.json({message: "Missing required documents"}, { status: 400 })
        }

        const updatePayload: any = {
            status: "pending",
        }

        if(aadhaar) {
            const url = await uploadOnCloudinary(aadhaar)
            if(!url) {
                return Response.json({message: "Error uploading Aadhaar"}, { status: 500 })
            }
            updatePayload.aadharCardUrl = url
        }

        if(license) {
            const url = await uploadOnCloudinary(license)
            if(!url) {
                return Response.json({message: "Error uploading License"}, { status: 500 })
            }
            updatePayload.licenseUrl = url
        }

        if(rc) {
            const url = await uploadOnCloudinary(rc)
            if(!url) {
                return Response.json({message: "Error uploading RC"}, { status: 500 })
            }
            updatePayload.rcUrl = url
        }

        const partnerDoc = await PartnerDocs.findOneAndUpdate(
            { owner: user._id },
            {$set: updatePayload},
            { upsert: true, returnDocument: 'after' }
        )

        if(user.partnerOnBoardingSteps < 2){
            user.partnerOnBoardingSteps = 2
        }else{
            user.partnerOnBoardingSteps = 3
        }
        user.partnerStatus = "pending"
        await user.save()
        return Response.json(partnerDoc, { status: 200 })

    } catch (error) {
        return Response.json({message: "Error processing request"}, { status: 500 })
    } 
}