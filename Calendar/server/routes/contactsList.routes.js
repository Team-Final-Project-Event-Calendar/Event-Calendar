import express from "express";
import {
  createContactsList,
  getContactsLists,
  deleteContactsList,
} from "../controllers/contactsList.controller.js";
import verifyToken from "../verify-token.js";

const router = express.Router();

router.post("/", verifyToken, createContactsList);
router.get("/", verifyToken, getContactsLists);
router.delete("/:id", verifyToken, deleteContactsList);

export default router;
