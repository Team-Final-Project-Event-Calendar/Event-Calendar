import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

import authRoutes from "./controllers/auth.controller.js";
import verifyToken from "./verify-token.js";
import User from "./models/user.model.js";
import Event from "./models/event.model.js";
import EventSeries from "./models/eventSeries.model.js";
import DeleteRequest from "./models/deleteRequest.model.js";
import contactsRoutes from "./routes/contactsList.routes.js";
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [process.env.VITE_FRONT_END_URL, "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE", "UPDATE"],
    credentials: true,
  },
});

app.use(
  cors({
    origin: [process.env.VITE_FRONT_END_URL, "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE", "UPDATE"],
    credentials: true,
  })
);

app.set("io", io);

app.use(express.json());

app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactsRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ connect with MongoDB!");

    io.on("connection", (socket) => {
      console.log("🟢 New client connected", socket.id);

      socket.on("join-room", (userId) => {
        console.log(`User ${userId} joined their room`);
        socket.join(userId);
      });

      socket.on("disconnect", () => {
        console.log("🔴 Client disconnected", socket.id);
      });
    });

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

    app.post("/api/events/:id/participants", verifyToken, async (req, res) => {
      try {
        const { username } = req.body;
        const eventId = req.params.id;

        if (!username) {
          return res.status(400).json({ message: "Username is required" });
        }

        const userToInvite = await User.findOne({
          username: new RegExp(`^${username}$`, "i"),
        });

        if (!userToInvite) {
          return res.status(404).json({ message: "User not found" });
        }

        const event = await Event.findById(eventId);
        if (!event) {
          return res.status(404).json({ message: "Event not found" });
        }

        if (
          event.participants.some(
            (id) => id.toString() === userToInvite._id.toString()
          )
        ) {
          return res
            .status(400)
            .json({ message: "User already a participant" });
        }

        event.participants.push(userToInvite._id);

        await event.save();

        res.json({ message: "User invited successfully" });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
      }
    });

    app.post("/api/events/:id/join", verifyToken, async (req, res) => {
      try {
        const eventId = req.params.id;
        const userId = req.user.id;

        const event = await Event.findById(eventId);
        if (!event) {
          return res.status(404).json({ error: "Event not found" });
        }

        const ownerId = event.userId.toString();
        const isAlreadyParticipant = event.participants.some(
          (p) => p.toString() === userId
        );

        if (ownerId === userId) {
          return res
            .status(400)
            .json({ error: "Owner cannot join their own event" });
        }

        if (isAlreadyParticipant) {
          return res
            .status(400)
            .json({ error: "You are already a participant" });
        }

        if (event.type === "private") {
          return res.status(403).json({ error: "Cannot join private event" });
        }

        event.participants.push(userId);
        await event.save();

        return res.status(200).json({
          message: "Successfully joined the event",
          participants: event.participants,
        });
      } catch (err) {
        console.error("Join event error:", err);
        res.status(500).json({ error: "Server error" });
      }
    });

    app.post("/api/event-series", verifyToken, async (req, res) => {
      try {
        const newSeries = new EventSeries({
          name: req.body.name,
          creatorId: req.user.id,
          startingEventId: req.body.startingEventId,
          endingEventId: req.body.endingEventId,
          seriesType: req.body.seriesType,
          recurrenceRule: req.body.recurrenceRule,
          eventsId: req.body.eventsId,
          isIndefinite: req.body.isIndefinite,
        });

        const savedSeries = await newSeries.save();
        res.status(201).json(savedSeries);
      } catch (err) {
        res.status(400).json({ error: err.message });
      }
    });

    app.delete(
      "/api/events/:id/participants/:participantId",
      verifyToken,
      async (req, res) => {
        try {
          const eventId = req.params.id;
          const participantId = req.params.participantId;

          const event = await Event.findById(eventId);

          if (!event) {
            return res.status(404).json({ error: "Event not found" });
          }

          if (event.userId.toString() !== req.user.id) {
            return res
              .status(403)
              .json({
                error: "You do not have permission to modify this event",
              });
          }

          const participantExists = event.participants.includes(participantId);
          if (!participantExists) {
            return res
              .status(400)
              .json({ error: "Participant not found in this event" });
          }

          if (participantId === req.user.id) {
            return res
              .status(400)
              .json({ error: "Event owner cannot remove themselves" });
          }

          event.participants = event.participants.filter(
            (id) => id.toString() !== participantId
          );

          await event.save();

          res
            .status(200)
            .json({
              message: "Participant removed",
              participants: event.participants,
            });
        } catch (err) {
          res.status(500).json({ error: err.message });
        }
      }
    );

    app.get("/api/events", verifyToken, async (req, res) => {
      try {
        const events = await Event.find({
          $or: [{ userId: req.user.id }, { type: "public" }],
        }).populate("participants", "username");

        res.json(events);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    app.get("/api/events/mine", verifyToken, async (req, res) => {
      try {
        const events = await Event.find({
          userId: req.user.id,
        }).populate("participants", "username");

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
        const events = await Event.find({ participants: req.user.id }).populate(
          "participants",
          "username"
        );
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

        const { page = 1, limit = 5, search = "" } = req.query;

        const query = {
          name: { $regex: search, $options: "i" },
        };

        const totalEvents = await Event.countDocuments(query);
        const totalPages = Math.ceil(totalEvents / limit);

        const events = await Event.find(query)
          .skip((page - 1) * limit)
          .limit(Number(limit))
          .sort({ createdAt: -1 });

        res.json({
          events,
          totalPages,
          totalEvents,
          currentPage: Number(page),
        });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    app.delete("/api/events/:id/leave", verifyToken, async (req, res) => {
      try {
        const eventId = req.params.id;
        const userId = req.user.id;

        const event = await Event.findById(eventId);
        if (!event) {
          return res.status(404).json({ message: "Event not found" });
        }

        if (!event.participants.some((p) => p.toString() === userId)) {
          return res
            .status(400)
            .json({ message: "You are not a participant of this event" });
        }

        event.participants = event.participants.filter(
          (p) => p.toString() !== userId
        );

        await event.save();

        res.json({ message: "Left the event successfully" });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
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

        const userToInvite = await User.findOne({
          username: new RegExp(`^${username}$`, "i"),
        });

        if (!userToInvite) {
          return res.status(404).json({ message: "User not found" });
        }

        const event = await Event.findById(eventId);
        if (!event) {
          return res.status(404).json({ message: "Event not found" });
        }

        if (
          event.participants.some(
            (id) => id.toString() === userToInvite._id.toString()
          )
        ) {
          return res
            .status(400)
            .json({ message: "User already a participant" });
        }

        event.participants.push(userToInvite._id);

        await event.save();

        res.json({ message: "User invited successfully" });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
      }
    });

    app.delete("/api/events/:id", verifyToken, async (req, res) => {
      try {
        const eventId = req.params.id;
        const event = await Event.findById(eventId);

        if (!event) {
          return res.status(404).json({ message: "Event not found" });
        }

        if (event.userId.toString() !== req.user.id) {
          return res
            .status(403)
            .json({
              message: "You do not have permission to delete this event",
            });
        }

        await Event.findByIdAndDelete(eventId);

        res.status(200).json({ message: "Event deleted" });
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    });

    app.delete("/api/event-series/:id", verifyToken, async (req, res) => {
      try {
        const seriesId = req.params.id;
        const series = await EventSeries.findById(seriesId);

        if (!series) {
          return res.status(404).json({ message: "Event series not found" });
        }

        if (series.creatorId.toString() !== req.user.id) {
          return res
            .status(403)
            .json({
              message: "You do not have permission to delete this event series",
            });
        }

        await EventSeries.findByIdAndDelete(seriesId);

        res.status(200).json({ message: "Event series deleted" });
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    });

    app.delete("/api/delete-requests/:id", verifyToken, async (req, res) => {
      try {
        const deleteRequestId = req.params.id;
        const deleteRequest = await DeleteRequest.findById(deleteRequestId);

        if (!deleteRequest) {
          return res.status(404).json({ message: "Delete request not found" });
        }

        if (deleteRequest.userId.toString() !== req.user.id) {
          return res
            .status(403)
            .json({
              message: "You do not have permission to delete this request",
            });
        }

        await DeleteRequest.findByIdAndDelete(deleteRequestId);

        res.status(200).json({ message: "Delete request deleted" });
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    });

    app.put("/api/events/:id", verifyToken, async (req, res) => {
      try {
        const eventId = req.params.id;
        const event = await Event.findById(eventId);

        if (!event) {
          return res.status(404).json({ message: "Event not found" });
        }

        if (event.userId.toString() !== req.user.id) {
          return res
            .status(403)
            .json({
              message: "You do not have permission to update this event",
            });
        }

        Object.assign(event, req.body);

        await event.save();

        res.status(200).json(event);
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    });

    app.put("/api/event-series/:id", verifyToken, async (req, res) => {
      try {
        const seriesId = req.params.id;
        const series = await EventSeries.findById(seriesId);

        if (!series) {
          return res.status(404).json({ message: "Event series not found" });
        }

        if (series.creatorId.toString() !== req.user.id) {
          return res
            .status(403)
            .json({
              message: "You do not have permission to update this event series",
            });
        }

        Object.assign(series, req.body);

        await series.save();

        res.status(200).json(series);
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    });

    app.get("/api/event-series", verifyToken, async (req, res) => {
      try {
        const series = await EventSeries.find({ creatorId: req.user.id });
        res.json(series);
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    });

    app.get("/api/delete-requests", verifyToken, async (req, res) => {
      try {
        const requests = await DeleteRequest.find({ userId: req.user.id });
        res.json(requests);
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    });

    app.get("/api/users/me", verifyToken, async (req, res) => {
      try {
        const user = await User.findById(req.user.id);
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    });

    server.listen(process.env.PORT || 8000, () => {
      console.log(`🚀 Server running on port ${process.env.PORT || 8000}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
