import connectDB from "@/lib/db";
import { sendEmail } from "@/lib/sendEmail";
import User from "@/models/user.model";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { name, email, password } = await req.json()
        await connectDB()

        let user = await User.findOne({ email })
        if (user && user.isEmailVerified) {
            return NextResponse.json(
                { message: 'User already exists' },
                { status: 400 }
            )
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString()
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000) // OTP expires in 10 minutes
        if (password.length < 6) {
            return NextResponse.json(
                { message: 'Password length must be atleast 6 characters' },
                { status: 400 }
            )
        }
        const hashedPass = await bcrypt.hash(password, 10)
        if(user && !user.isEmailVerified){
            user.name = name,
            user.password = hashedPass,
            user.email = email,
            user.otp = otp,
            user.otpExpiresAt = otpExpiry
            await user.save()
        }else{
            user = await User.create({
            name,
            email,
            password: hashedPass,
            otp,
            otpExpiresAt: otpExpiry
            })
        }

        await sendEmail(
            email,
            'Email Verification for Rydex',
            `<p>Your OTP for email verification is <strong>${otp}</strong>. It will expire in 10 minutes.</p>`
        )
        
        return NextResponse.json(
            user,
            { status: 201 }
        )
    } catch (error) {
        return NextResponse.json(
            { message: 'Server side error' },
            { status: 500 }
        )
    }
}