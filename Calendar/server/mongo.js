import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./controllers/auth.controller.js";
import verifyToken from "./verify-token.js";
import User from "./models/user.model.js";
import Event from "./models/event.model.js";
const app = express();

app.use(
  cors({
    origin: [process.env.VITE_FRONT_END_URL, "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE", "UPDATE"],
    credentials: true,
  })
);

app.use(express.json());

app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

app.use("/api/auth", authRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ connect with MongoDB!");

    // POST routes:
    app.post("/api/events", verifyToken, async (req, res) => {
      try {
        const participantUsernames = req.body.participants || [];

        const participantUsers = await User.find({
          username: { $in: participantUsernames },
        });

        if (participantUsers.length !== participantUsernames.length) {
          return res
            .status(400)
            .json({ error: "One or more participants not found" });
        }

        const participantIds = participantUsers.map((user) => user._id);

        if (!participantIds.includes(req.user.id)) {
          participantIds.push(req.user.id);
        }

        const newEvent = new Event({
          title: req.body.title,
          description: req.body.description,
          type: req.body.type,
          startDateTime: req.body.startDateTime,
          endDateTime: req.body.endDateTime,
          isRecurring: req.body.isRecurring,
          isLocation: req.body.isLocation,
          location: req.body.location,
          recurrenceRule: req.body.recurrenceRule,
          userId: req.user.id,
          participants: participantIds,
        });
        const savedEvent = await newEvent.save();
        res.status(201).json(savedEvent);
      } catch (err) {
        res.status(400).json({ error: err.message });
      }
    });

    // GET routes:
    app.get("/api/events", verifyToken, async (req, res) => {
      try {
        const events = await Event.find({ userId: req.user.id });
        res.json(events);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    app.get("/api/events/public", async (req, res) => {
      try {
        const events = await Event.find({ type: "public" });
        res.json(events);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    app.get("/api/events/participating", verifyToken, async (req, res) => {
      try {
        const events = await Event.find({ participants: req.user.id });
        res.json(events);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    app.get("/api/events/admin", verifyToken, async (req, res) => {
      try {
        const user = await User.findById(req.user.id);

        if (user.role !== "admin") {
          return res.status(403).json({ message: "Access denied: not admin" });
        }

        const events = await Event.find();
        res.json(events);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    app.post("/api/events/invite/:id", verifyToken, async (req, res) => {
      console.log("inside the api");
      try {
        const { username } = req.body;

        const eventId = req.params.id;

        if (!username) {
          return res.status(400).json({ message: "Username is required" });
        }

        // Find user by username (case insensitive)
        const userToInvite = await User.findOne({
          username: new RegExp(`^${username}$`, "i"),
        });

        if (!userToInvite) {
          return res.status(404).json({ message: "User not found" });
        }

        // Find event
        const event = await Event.findById(eventId);
        if (!event) {
          return res.status(404).json({ message: "Event not found" });
        }

        // Check if user is already invited
        const alreadyInvited = event.invitedUsers.some(
          (invite) => invite.userId.toString() === userToInvite._id.toString()
        );
        if (alreadyInvited) {
          return res.status(400).json({ message: "User already invited" });
        }

        // Add user to invitedUsers with status 'pending'
        event.invitedUsers.push({
          userId: userToInvite._id,
          status: "pending",
        });

        await event.save();

        res.json({ message: "User invited successfully" });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
      }
    });

    // GET routes with parameter - MUST come AFTER all specific routes(to avoid conflicts):
    app.get("/api/events/:id", verifyToken, async (req, res) => {
      try {
        const event = await Event.findById(req.params.id).populate(
          "participants",
          "username email"
        );
        if (!event) {
          return res.status(404).json({ error: "Event not found" });
        }
        res.json(event);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    // PUT routes with parameter:
    app.put("/api/events/:id", verifyToken, async (req, res) => {
      try {
        const updatedEvent = await Event.findByIdAndUpdate(
          req.params.id,
          { ...req.body },
          { new: true }
        );
        res.json(updatedEvent);
      } catch (err) {
        res.status(400).json({ error: err.message });
      }
    });

    // DELETE routes with parameter:
    app.delete("/api/events/:id", verifyToken, async (req, res) => {
      try {
        const deletedEvent = await Event.findByIdAndDelete(req.params.id);
        if (!deletedEvent) {
          return res.status(404).json({ error: "Event not found" });
        }
        res.json({ message: "Event deleted successfully" });
      } catch (err) {
        res.status(400).json({ error: err.message });
      }
    });

    // 400 handlers
    app.use("/*splat", (req, res) => {
      res.status(404).json({ error: "Route not found" });
    });

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Error with connection with MongoDB:", err.message);
  });
