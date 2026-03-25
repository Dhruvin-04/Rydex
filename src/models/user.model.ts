import mongoose, { Document } from "mongoose";

interface IUser extends Document{
    name: string,
    role: "user" | "partner" | "admin",
    email: string,
    password?: string,
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
    }
}, {timestamps: true})

const User = mongoose.models.User || mongoose.model('User', userSchema)
export default User