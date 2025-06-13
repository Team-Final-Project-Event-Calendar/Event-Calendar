import express from "express";
import {
  createContactsList,
  getContactsLists,
} from "../controllers/contactsList.controller.js";

const router = express.Router();

router.post("/", createContactsList);
router.get("/", getContactsLists);

export default router;
