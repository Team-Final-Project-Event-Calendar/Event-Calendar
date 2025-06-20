import ContactsList from "../models/contactsList.model.js";
import verifyToken from "../verify-token.js";

/**
 * Create a new contacts list.
 *
 * @route POST /contacts-lists
 * @access Private
 * @param {Object} req - Express request object
 * @param {Object} req.body - The body containing title and contacts
 * @param {string} req.body.title - The title of the contacts list
 * @param {Array<string>} req.body.contacts - Array of contact IDs
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with the created contacts list or error message
 */
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

/**
 * Retrieve all contact lists created by the authenticated user.
 *
 * @route GET /contacts-lists
 * @access Private
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with an array of contact lists or error message
 */
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
