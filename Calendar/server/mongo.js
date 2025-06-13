import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./controllers/auth.controller.js";
import verifyToken from "./verify-token.js";
import User from "./models/user.model.js";
import Event from "./models/event.model.js";
import EventSeries from "./models/eventSeries.model.js";
import contactsRoutes from "./routes/contactsList.routes.js";
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

app.use("/contacts", contactsRoutes);

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

    // POST - Create new EventSeries
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
            return res.status(403).json({
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

          res.status(200).json({
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

    app.delete("/api/events/:id/leave", verifyToken, async (req, res) => {
      try {
        const eventId = req.params.id;
        const userId = req.user.id;

        const event = await Event.findById(eventId);
        if (!event) {
          return res.status(404).json({ error: "Event not found" });
        }

        const initialLength = event.participants.length;
        event.participants = event.participants.filter(
          (participantId) => participantId.toString() !== userId
        );

        if (event.participants.length === initialLength) {
          return res.status(400).json({ error: "You are not a participant" });
        }

        await event.save();
        res.status(200).json({
          message: "Left the event",
          participants: event.participants,
        });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    // GET - Fetch all EventSeries for a user
    app.get("/api/event-series", verifyToken, async (req, res) => {
      try {
        const series = await EventSeries.find({
          creatorId: req.user.id,
        }).populate("startingEventId endingEventId eventsId");
        res.json(series);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    // GET - Fetch specific EventSeries
    app.get("/api/event-series/:id", verifyToken, async (req, res) => {
      try {
        const series = await EventSeries.findById(req.params.id).populate(
          "startingEventId endingEventId eventsId"
        );
        if (!series) {
          return res.status(404).json({ error: "Event series not found" });
        }
        res.json(series);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    // PUT - Update EventSeries
    app.put("/api/event-series/:id", verifyToken, async (req, res) => {
      try {
        const updatedSeries = await EventSeries.findByIdAndUpdate(
          req.params.id,
          { ...req.body },
          { new: true }
        );
        res.json(updatedSeries);
      } catch (err) {
        res.status(400).json({ error: err.message });
      }
    });

    // DELETE - Delete EventSeries
    app.delete("/api/event-series/:id", verifyToken, async (req, res) => {
      try {
        const deletedSeries = await EventSeries.findByIdAndDelete(
          req.params.id
        );
        if (!deletedSeries) {
          return res.status(404).json({ error: "Event series not found" });
        }
        res.json({ message: "Event series deleted successfully" });
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
