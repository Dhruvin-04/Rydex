import mongoose from "mongoose";

type BookingStatus = "requested" | "awaiting_payment" | "confirmed" | "started" | "completed" | "cancelled" | "rejected" | "expired" | "idle";

type PaymentStatus = "pending" | "paid" | "cash" | "failed";

export interface IBooking{
    user: mongoose.Types.ObjectId;
    driver: mongoose.Types.ObjectId;
    vehicle: mongoose.Types.ObjectId;
    pickupAddress: string;
    dropAddress: string;
    pickupLocation: {
        type: "Point",
        coordinates: [number, number]
    },
    dropLocation: {
        type: "Point",
        coordinates: [number, number]
    },
    fare: number;
    userMobile: string;
    driverMobile: string;
    bookingStatus: BookingStatus;
    paymentStatus: PaymentStatus;
    adminCommission: number;
    partnerEarnings: number;
    pickupOtp: string;
    pickupOtpExpires: Date;
    dropOtp: string;
    dropOtpExpires: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

const bookingSchema = new mongoose.Schema<IBooking>({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    driver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    vehicle: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vehicle",
        required: true
    },
    pickupAddress: {
        type: String,
        required: true
    },
    dropAddress: {
        type: String,
        required: true
    },
    pickupLocation: {
        type: {
            type: String,
            enum: ["Point"],
            required: true
        },
        coordinates: [Number], 
    },
    dropLocation: {
        type: {
            type: String,
            enum: ["Point"],
            required: true
        },
        coordinates: [Number],
    },
    fare: {
        type: Number,
        required: true
    },
    userMobile: {
        type: String,
        required: true
    },
    driverMobile: {
        type: String,
        required: true
    },
    bookingStatus: {
        type: String,
        enum: ["requested", "awaiting_payment", "confirmed", "started", "completed", "cancelled", "rejected", "expired", "idle"],
        default: "idle"
    },
    paymentStatus: {
        type: String,
        enum: ["pending", "paid", "cash", "failed"],
        default: "pending"
    },
    adminCommission: {
        type: Number,
        default: 0
    },
    partnerEarnings: {
        type: Number,
        default: 0
    },
    pickupOtp: {
        type: String,
    },
    pickupOtpExpires: {
        type: Date,
    },
    dropOtp: {
        type: String,
    },
    dropOtpExpires: {
        type: Date,
    }
},{
    timestamps: true
})

const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema)
export default Booking