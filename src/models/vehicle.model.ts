import mongoose from "mongoose";

export type vehicleType = 'bike' | 'car' | 'bus' | 'truck' | 'auto';

export interface IVehicle {
    owner: mongoose.Types.ObjectId;
    type: vehicleType;
    imageUrl?: string;
    model: string;
    baseFare?: number;
    pricePerKm?: number;
    waitingCharge?: number;
    licensePlate: string;
    status: "approved" | "pending" | "rejected";
    rejectionReason?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const vehicleSchema = new mongoose.Schema<IVehicle>({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['bike', 'car', 'bus', 'truck', 'auto'],
        required: true
    },
    imageUrl: String,
    model: {
        type: String,
        required: true
    },
    baseFare: Number,
    pricePerKm: Number,
    waitingCharge: Number,
    licensePlate: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: String,
        enum: ['approved', 'pending', 'rejected'],
        default: 'pending'
    },
    rejectionReason: String,
    isActive: {
        type: Boolean,
        default: true
    }
 
}, {timestamps: true})

const Vehicle = mongoose.models.Vehicle ||  mongoose.model<IVehicle>('Vehicle', vehicleSchema)

export default Vehicle