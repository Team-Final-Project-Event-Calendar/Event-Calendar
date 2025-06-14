import ContactsList from "../models/contactsList.model.js";

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

// export const getContactsLists = async (req, res) => {
//   try {
//     const { creator } = req.body;
//     const lists = await ContactsList.find({ creator }).populate("contacts");
//     res.status(200).json(lists);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

export const getContactsLists = async (req, res) => {
  try {
    // Get creator ID from the authenticated user token
    // Do NOT destructure from req.body for GET requests!
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
