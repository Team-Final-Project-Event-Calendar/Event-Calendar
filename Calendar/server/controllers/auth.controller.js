import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import verifyAdmin from "../verify-token.js";
import verifyToken from "../verify-token.js";
import DeleteRequest from "../models/deleteRequest.model.js";
import mongoose from "mongoose";

const router = express.Router();

router.get("/admin", verifyAdmin, async (req, res) => {
  res.json({ message: "Welcome to the admin page" });
});

router.get("/users/search/:query", verifyToken, async (req, res) => {
  try {
    const { query } = req.params;

    const users = await User.find({
      $or: [
        { username: { $regex: query, $options: "i" } },
        { phoneNumber: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ],
    }).select("-password");

    if (!users || users.length === 0) {
      return res.status(404).json({ error: "No users found" });
    }

    res.status(200).json({ data: users });
  } catch (error) {
    console.error("Error searching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
router.get("/users", verifyToken, async (req, res) => {
  try {
    const users = await User.find({}, "-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/users/admin", verifyToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const users = await User.find().skip(skip).limit(limit);
    const total = await User.countDocuments();

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/users/:id", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.put("/users/:id", verifyToken, async (req, res) => {
  const { id } = req.params;

  const user = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid id" });
  }

  try {
    const updateFields = { ...user };

    console.log("Updating user with id:", id);
    console.log("Update data:", updateFields);

    if (user.adress) {
      updateFields.adress = user.adress;
    }
    if (user.avatar) {
      updateFields.avatar = user.avatar;
    }

    const updatedUser = await User.findByIdAndUpdate(
      { _id: id },
      updateFields,
      {
        new: true,
        runValidators: true,
      }
    );

    const io = req.app.get("io");
    io.to(id).emit("user-updated", updatedUser);
    return res
      .status(200)
      .json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});
router.post("/register", async (req, res) => {
  try {
    const { username, phoneNumber, email, password, firstName, lastName } =
      req.body;
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
    if (!/^0[0-9]{9}$/.test(phoneNumber)) {
      return res.status(400).json({
        message:
          "Phone number must start with 0, contain only digits 0-9, and be exactly 10 digits long.",
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
      phoneNumber,
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
    return res.status(403).json({
      msg: "Your account has been blocked. Please contact the administrator.",
    });
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ msg: "Invalid password!" });

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );

  res.json({
    token,
    user: { id: user._id, email: user.email, role: user.role },
  });
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

router.get("/users/exists/:username", verifyToken, async (req, res) => {
  try {
    const userExists = await User.findOne({ username: req.params.username });
    if (userExists) {
      return res.status(200).json({ exists: true });
    } else {
      return res.status(404).json({ exists: false });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
router.post("/delete-request", verifyToken, async (req, res) => {
  try {
    const existingRequest = await DeleteRequest.findOne({
      userId: req.user.id,
    });

    if (existingRequest) {
      return res.status(400).json({ message: "Delete request already exists" });
    }

    const newRequest = new DeleteRequest({
      userId: req.user.id,
      username: req.user.username,
      reason: req.body.reason || "User requested account deletion",
    });

    await newRequest.save();
    res.status(201).json({ message: "Delete request submitted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/delete-requests", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const requests = await DeleteRequest.find().populate(
      "userId",
      "username email"
    );
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/delete-requests/:id", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const request = await DeleteRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    request.status = req.body.status || request.status;
    await request.save();

    res.json({ message: "Request updated", request });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
