import mongoose from "mongoose";

/**
 * Schema for recurrence rules of an event.
 * 
 * @typedef {Object} RecurrenceRule
 * @property {"daily" | "weekly" | "monthly"} frequency - The frequency of the recurrence.
 * @property {number} interval - The interval between recurrences (e.g., every 1 week).
 * @property {Date} endDate - The date when the recurrence ends.
 */
const recurrenceSchema = new mongoose.Schema(
  {
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
  },
  { _id: false }
);

/**
 * Schema for an Event.
 * 
 * @typedef {Object} Event
 * @property {string} title - Title of the event.
 * @property {string} description - Description of the event.
 * @property {string} type - Type/category of the event.
 * @property {Date} startDateTime - Start date and time of the event.
 * @property {Date} endDateTime - End date and time of the event.
 * @property {mongoose.Types.ObjectId} userId - ID of the user who created the event.
 * @property {string} [coverPhoto] - Optional cover photo URL.
 * @property {Object} location - Location details of the event.
 * @property {string} location.address - Address.
 * @property {string} location.city - City.
 * @property {string} location.country - Country.
 * @property {mongoose.Types.ObjectId[]} participants - List of participating users.
 * @property {boolean} isRecurring - Whether the event is recurring.
 * @property {RecurrenceRule|null} recurrenceRule - The recurrence rule, if applicable.
 * @property {string} [seriesId] - Identifier for a series of recurring events.
 */
const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, required: true },
    startDateTime: { type: Date, required: true },
    endDateTime: { type: Date, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    coverPhoto: { type: String },
    location: {
      address: String,
      city: String,
      country: String,
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
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
  },
  { timestamps: true }
);

export default mongoose.model("Event", eventSchema);
