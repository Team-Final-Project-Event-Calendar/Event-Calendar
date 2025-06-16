import express from "express";
import {
  createContactsList,
  getContactsLists,
} from "../controllers/contactsList.controller.js";
import verifyToken from "../verify-token.js";
import ContactsList from "../models/contactsList.model.js";

const router = express.Router();

router.post("/", verifyToken, createContactsList);
router.get("/", verifyToken, getContactsLists);

router.delete("/delete/:id", verifyToken, async (req, res) => {
  try {
    const deleteContactsList = await ContactsList.findByIdAndDelete(
      req.params.id
    );
    if (!deleteContactsList) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "Contacts list deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete Contacts list" });
  }
});

router.delete("/:listId/contacts/:userId", verifyToken, async (req, res) => {
  const { listId, userId } = req.params;
  try {
    const list = await ContactsList.findById(listId);
    if (!list) return res.status(404).json({ message: "List not found" });

    list.contacts = list.contacts.filter(
      (contact) => contact.toString() !== userId
    );

    const updatedList = await ContactsList.findById(listId).populate(
      "contacts",
      "username email phone"
    );

    await list.save();
    res.json({ message: "Contact removed", contacts: updatedList.contacts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
