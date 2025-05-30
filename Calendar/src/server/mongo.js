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
    origin: ["http://localhost:5173", "http://localhost:5174"], // allow both ports
    methods: ["GET", "POST", "PUT", "DELETE"],
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

    app.listen(process.env.PORT, () => {
      console.log(`🚀 Server work with http://localhost:${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Error with connection with MongoDB:", err.message);
  });
