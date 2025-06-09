import mongoose from "mongoose";


const recurrenceSchema = new mongoose.Schema({
    frequency: {
        type: String,
        enum: ["daily", "weekly", "monthly"],
    },
    interval: {
        type: Number,
        default: 1,
    },
    endDate: {
        type: Date,
    },
}, { _id: false });


const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, required: true },
    startDateTime: { type: Date, required: true },
    endDateTime: { type: Date, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    coverPhoto: { type: String },
    location: {
        address: String,
        city: String,
        country: String,
    },
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }],
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }],
    isRecurring: {
        type: Boolean,
        default: false,
    },
    recurrenceRule: {
        type: recurrenceSchema,
        default: null,
    },
    seriesId: {
        type: String,
    },
}, { timestamps: true });


eventSchema.pre("validate", function (next) {
    if (!this.participants.includes(this.userId)) {
        this.participants.push(this.userId);
    }

    if (this.type === "private") {
        this.participants = [this.userId];
    }

    next();
});

export default mongoose.model("Event", eventSchema);
