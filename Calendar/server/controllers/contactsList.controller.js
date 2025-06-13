import ContactsList from "../models/contactsList.model.js";

export const createContactsList = async (req, res) => {
  try {
    const { title, creator, contacts } = req.body;
    const newList = await ContactsList.create({ title, creator, contacts });

    newList.save();

    res.status(201).json(newList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getContactsLists = async (req, res) => {
  try {
    const { creator } = req.query;
    const lists = await ContactsList.find({ creator }).populate("contacts");
    res.status(200).json(lists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
