import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import verifyAdmin from '../verify-token.js';
import verifyToken from '../verify-token.js';
const router = express.Router();


router.get('/admin', verifyAdmin, async (req, res) => {
  res.json({ message: 'Welcome to the admin page' });
});

// users will be user later for events
router.get('/users', verifyToken, async (req, res) => {
  try {
      const users = await User.find({}, '-password');
      res.json(users);
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
})

router.post("/register", async (req, res) => {
  try {
    const { username, email, password, firstName, lastName } = req.body;
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

    const newUser = new User({
      username,
      email,
      password,
      firstName,
      lastName,
      role: "user", 
      isBlocked: false,
    });
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

  if (user.isBlocked) {
    return res.status(403).json({ msg: "Your account has been blocked. Please contact the administrator." });
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ msg: "Invalid password!" });

  const token = jwt.sign({ id: user._id,  role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.json({ token, user: { id: user._id, email: user.email,  role: user.role  } });
});


router.post("/logout", (req, res) => {
  res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
  });
  res.status(200).json({ message: "Logged out successfully" });
});

router.post("/block/:id", verifyAdmin, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { isBlocked: true });
    res.json({ message: "User blocked" });
  } catch (err) {
    res.status(500).json({ message: "Failed to block user" });
  }
});

router.post("/unblock/:id", verifyAdmin, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { isBlocked: false });
    res.json({ message: "User unblocked" });
  } catch (err) {
    res.status(500).json({ message: "Failed to unblock user" });
  }
});


router.delete("/delete/:id", verifyAdmin, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete user" });
  }
});


export default router;