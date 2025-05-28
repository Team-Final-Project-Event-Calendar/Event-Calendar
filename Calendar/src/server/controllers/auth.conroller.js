import express from "express";
import User from "../models/user.model.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { username, phoneNumber, email, password, firstName, lastName } =
      req.body;

    if (!/^[0-9]{7,15}$/.test(phoneNumber)) {
      return res.status(400).json({
        message: "Phone number must be a valid number with 7 to 15 digits.",
      });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { username }, { phoneNumber }],
    });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists." });
    }

    const newUser = new User({
      username,
      phoneNumber,
      email,
      password,
      firstName,
      lastName,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
