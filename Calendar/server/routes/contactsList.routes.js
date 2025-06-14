import express from "express";
import {
  createContactsList,
  getContactsLists,
} from "../controllers/contactsList.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", verifyToken, createContactsList); 
router.get("/", verifyToken, getContactsLists);

export default router;
