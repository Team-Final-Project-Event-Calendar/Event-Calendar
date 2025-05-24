import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./auth.js";
import verifyToken from "./verify-token.js";
import User from "./user.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
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

    app.post("/api/movies", verifyToken, async (req, res) => {
      try {
        const newUser = new User(req.body);
        const savedUser = await savedUser.save();
        res.status(201).json(savedUser);
      } catch (err) {
        res.status(400).json({ error: err.message });
      }
    });

    app.get("/api/movies", verifyToken, async (req, res) => {
      try {
        const user = await User.find({});
        res.json(user);
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
