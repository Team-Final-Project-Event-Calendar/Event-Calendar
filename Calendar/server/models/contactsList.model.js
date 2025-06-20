import mongoose from "mongoose";

/**
 * Mongoose schema for a contacts list.
 * 
 * @typedef {Object} ContactsList
 * @property {string} title - Title of the contacts list.
 * @property {mongoose.Types.ObjectId} creator - ID of the user who created the list.
 * @property {mongoose.Types.ObjectId[]} contacts - Array of user IDs in the contact list.
 * @property {Date} createdAt - Timestamp when the list was created.
 * @property {Date} updatedAt - Timestamp when the list was last updated.
 */
const contactsListSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    contacts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const ContactsList = new mongoose.model("ContactsList", contactsListSchema);

export default ContactsList;
