import mongoose from "mongoose";

interface IPartnerBank {
    owner: mongoose.Types.ObjectId;
    status: "not_added" | "added" | "verified";
    accountHolderName: string;
    accountNumber: string;
    ifscCode: string;
    upi?: string;
    createdAt: Date;
    updatedAt: Date;
}

const partnerBankSchema = new mongoose.Schema<IPartnerBank>({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['not_added', 'added', 'verified'],
        default: 'not_added'
    },
    accountNumber: {
        type: String,
        required: true
    },
    ifscCode: {
        type: String,
        required: true
    },
    accountHolderName: {
        type: String,
        required: true
    },
    upi: String

}, {timestamps: true})

const PartnerBank = mongoose.models.PartnerBank ||  mongoose.model<IPartnerBank>('PartnerBank', partnerBankSchema)

export default PartnerBank