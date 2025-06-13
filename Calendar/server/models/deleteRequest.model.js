import mongoose from "mongoose";

const deleteRequestSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
    },
    username: String,
    requestedAt: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ["pending", "processed", "rejected"],
        default: "pending",
    },
    reason: {
        type: String,
        default: "User requested account deletion",
    },
});

const DeleteRequest = mongoose.model("DeleteRequest", deleteRequestSchema);
export default DeleteRequest;
