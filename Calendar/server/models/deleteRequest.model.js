import mongoose from "mongoose";

/**
 * Mongoose schema for user account deletion requests.
 * 
 * @typedef {Object} DeleteRequest
 * @property {mongoose.Types.ObjectId} userId - The ID of the user requesting account deletion.
 * @property {string} username - The username of the user.
 * @property {Date} requestedAt - The date and time when the deletion request was made.
 * @property {"pending" | "processed" | "rejected"} status - Status of the deletion request.
 * @property {string} reason - Reason for the deletion request.
 */
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
