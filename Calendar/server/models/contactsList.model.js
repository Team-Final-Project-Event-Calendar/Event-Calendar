import mongoose from "mongoose";

const contactsListSchema = new mongoose.Schema(
  {
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

const ContactsList =
  mongoose.models.ContactsList ||
  mongoose.model("ContactsList", contactsListSchema);

export default ContactsList;
