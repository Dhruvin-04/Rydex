import mongoose, { Document } from "mongoose";

type VideoKYCStatus = "not_required" | "pending" | "approved" | "rejected" | "in_progress"

export interface IUser extends Document{
    name: string,
    role: "user" | "partner" | "admin",
    email: string,
    password?: string,
    isEmailVerified?: boolean,
    otp?: string,
    otpExpiresAt?: Date,
    partnerOnBoardingSteps?: number,
    mobileNumber?: string,
    partnerStatus?: "pending" | "approved" | "rejected",
    rejectionReason?: string,
    videoKycStatus: VideoKYCStatus,
    videoKycRoomId?: string,
    videoKycRejectionReason?: string,
    isOnline?: boolean,
    socketId?: string,
    location?: {
        type: "Point",
        coordinates: [number, number]
    },
    createdAt: Date,
    updatedAt: Date
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
    },
    partnerOnBoardingSteps: {
        type: Number,
        min: 0,
        max: 8,
        default: 0
    },
    mobileNumber: {
        type: String
    },
    partnerStatus: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
    },
    rejectionReason: {
        type: String
    },
    videoKycStatus: {
        type: String,
        enum: ["not_required", "pending", "approved", "rejected", "in_progress"],
        default: "not_required"
    },
    videoKycRoomId: {
        type: String
    },
    videoKycRejectionReason: {
        type: String
    },
    isOnline: {
        type: Boolean,
        default: false,
        index: true
    },
    socketId: {
        type: String,
    },
    location: {
        type: {
            type: String,
            enum: ["Point"],
        },
        coordinates: [Number]
    }
}, {timestamps: true})

userSchema.index({ location: "2dsphere" })

const User = mongoose.models.User || mongoose.model('User', userSchema)
export default User