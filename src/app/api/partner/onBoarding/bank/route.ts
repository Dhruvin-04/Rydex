import { auth } from "@/auth"
import connectDB from "@/lib/db"
import PartnerBank from "@/models/partnerBank.model"
import User from "@/models/user.model"

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

        const {accountHolderName, accountNumber, ifscCode, mobileNumber, upi} = await req.json()

        if(!accountNumber || !ifscCode || !accountHolderName || !mobileNumber) {
            return Response.json({message: "Missing required fields"}, { status: 400 })
        }

        const bankDetails = await PartnerBank.findOneAndUpdate(
            { owner: user._id },
            { accountHolderName, accountNumber, ifscCode, upi, status: "added"},
            { upsert: true, new: true }
        )

        user.mobileNumber = mobileNumber
        if(user.partneronBoardingSteps < 3) {
            user.partneronBoardingSteps = 3
        }
        await user.save()
        return Response.json(bankDetails, { status: 201 })

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

        const bankDetails = await PartnerBank.findOne({ owner: user._id })
        if (bankDetails) {
            return Response.json(bankDetails, { status: 200 })
        }
        return Response.json({message: "Bank details not found"}, { status: 404 })

    } catch (error) {
        return Response.json({message: "Error processing request"}, { status: 500 })
    }
}