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

app.use("/api/auth", authRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ connect with MongoDB!");

    app.post("/api/events", verifyToken, async (req, res) => {
      try {
        const newEvent = new Event({ ...req.body, userId: req.user.id });
        const savedEvent = await newEvent.save();
        res.status(201).json(savedEvent);
      } catch (err) {
        res.status(400).json({ error: err.message });
      }
    });

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

    app.get("/api/events/:id", verifyToken, async (req, res) => {
      try {
        const event = await Event.findById(req.params.id);
        if (!event) {
          return res.status(404).json({ error: "Event not found" });
        }
        res.json(event);
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

    app.use("/*splat", (req, res) => {
      res.status(404).json({ error: "Route not found" });
    });

    app.use((req, res, next) => {
      console.log(`${req.method} ${req.originalUrl}`);
      next();
    });

    app.use((req, res, next) => {
      console.log(`[${req.method}] ${req.url}`);
      next();
    });

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Error with connection with MongoDB:", err.message);
  });
