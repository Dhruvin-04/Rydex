import mongoose, { Document } from "mongoose";

export interface IUser extends Document{
    name: string,
    role: "user" | "partner" | "admin",
    email: string,
    password?: string,
    isEmailVerified?: boolean,
    otp?: string,
    otpExpiresAt?: Date
}

const userSchema = new mongoose.Schema<IUser>({
    name: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "user",
        enum: ["user", "partner", "admin"]
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    otp: {
        type: String
    },
    otpExpiresAt: {
        type: Date
    }
}, {timestamps: true})

const User = mongoose.models.User || mongoose.model('User', userSchema)
export default User