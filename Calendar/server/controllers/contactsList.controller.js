import ContactsList from "../models/contactsList.model.js";
import verifyToken from "../verify-token.js";

export const createContactsList = async (req, res) => {
  try {
    const { title, contacts } = req.body;
    const creator = req.user.id;

    const newList = await new ContactsList({ title, creator, contacts });
    newList.save();

    res.status(200).json(newList);
  } catch (error) {
    console.error("Error creating contacts list:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getContactsLists = async (req, res) => {
  try {
    const creator = req.user.id;

    console.log("Looking up contact lists for creator:", creator);

    const lists = await ContactsList.find({ creator }).populate("contacts");

    console.log(`Found ${lists.length} contact lists for creator ${creator}`);

    res.status(200).json(lists);
  } catch (error) {
    console.error("Error in getContactsLists:", error);
    res.status(500).json({ message: error.message });
  }
};

// const deleteContactsList = async (req, res) => {
//   try {
//     const deletedUser = await User.findByIdAndDelete(req.params.id);
//     if (!deletedUser) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     res.json({ message: "User deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ message: "Failed to delete user" });
//   }
// };

// export const deleteContactsList = async (req, res) => {
//   try {
//     const deleteContactsList = await ContactsList.findByIdAndDelete(
//       req.params.id
//     );
//     if (!deleteContactsList) {
//       return res.status(404).json({ message: "Contact list not found" });
//     }
//     res.json({ message: "Contact list deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ message: "Failed to delete contact list" });
//   }
// };
