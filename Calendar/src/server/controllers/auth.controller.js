import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/user.model.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    const existingUser = await User.findOne({ email });
    if (
      password.length < 8 ||
      password.length > 30 ||
      !/[A-Za-z]/.test(password)
    ) {
      return res.status(400).send({
        message:
          "Password must be 8-30 characters long and include at least one letter (A-Z).",
      });
    }
    if (
      !firstName ||
      !lastName ||
      firstName.length < 1 ||
      firstName.length > 30 ||
      lastName.length < 1 ||
      lastName.length > 30 ||
      !/^[A-Za-z]+$/.test(firstName) ||
      !/^[A-Za-z]+$/.test(lastName)
    ) {
      return res.status(400).send({
        message:
          "First and last names must be 1-30 characters long and contain only letters (A-Z or a-z).",
      });
    }
    if (existingUser)
      return res.status(409).json({ msg: "User already exists" });

    const newUser = new User({ email, password, firstName, lastName });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({ user: newUser, token });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ msg: "Invalid email!" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ msg: "Invalid password!" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.json({ token, user: { id: user._id, email: user.email } });
});

export default router;
