/**
 * @file mongo.js
 * @description This file initializes the Express application, sets up middleware, connects to MongoDB, and configures the Socket.IO server.
 * It also defines routes for authentication, contacts, and event management.
 */

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

/**
 * @constant {Object} app - The Express application instance.
 */
const app = express();

/**
 * @constant {Object} server - The HTTP server instance created using the Express application.
 */
const server = http.createServer(app);

/**
 * @constant {Object} io - The Socket.IO server instance configured with CORS options.
 */
const io = new Server(server, {
  cors: {
    origin: [process.env.VITE_FRONT_END_URL, "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE", "UPDATE"],
    credentials: true,
  },
});

/**
 * Middleware to enable CORS with specific options.
 */
app.use(
  cors({
    origin: [process.env.VITE_FRONT_END_URL, "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE", "UPDATE"],
    credentials: true,
  })
);

/**
 * Sets the Socket.IO instance to the Express application for global access.
 */
app.set("io", io);

/**
 * Middleware to parse incoming JSON requests.
 */
app.use(express.json());

/**
 * Middleware to log all incoming requests.
 * @function
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next middleware function.
 */
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

/**
 * Route for authentication-related operations.
 * @route /api/auth
 */
app.use("/api/auth", authRoutes);

/**
 * Route for managing contacts.
 * @route /api/contacts
 */
app.use("/api/contacts", contactsRoutes);

/**
 * Connects to MongoDB using the connection string from environment variables.
 * Sets up the Socket.IO server and event-related routes upon successful connection.
 */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ connect with MongoDB!");

    /**
     * Handles Socket.IO connections.
     * @event connection
     * @param {Object} socket - The connected socket instance.
     */
    io.on("connection", (socket) => {
      console.log("🟢 New client connected", socket.id);

      /**
       * Handles a user joining a room.
       * @event join-room
       * @param {string} userId - The ID of the user joining the room.
       */
      socket.on("join-room", (userId) => {
        console.log(`User ${userId} joined their room`);
        socket.join(userId);
      });

      /**
       * Handles client disconnection.
       * @event disconnect
       */
      socket.on("disconnect", () => {
        console.log("🔴 Client disconnected", socket.id);
      });
    });

    /**
     * @route POST /api/events
     * @description Creates a new event with the provided details and participants.
     * @access Protected
     * @middleware verifyToken
     * @param {Object} req - The HTTP request object.
     * @param {Object} req.body - The request body containing event details.
     * @param {string} req.body.title - The title of the event.
     * @param {string} req.body.description - The description of the event.
     * @param {string} req.body.type - The type of the event.
     * @param {string} req.body.startDateTime - The start date and time of the event.
     * @param {string} req.body.endDateTime - The end date and time of the event.
     * @param {boolean} req.body.isRecurring - Whether the event is recurring.
     * @param {boolean} req.body.isLocation - Whether the event has a location.
     * @param {string} req.body.location - The location of the event.
     * @param {string} req.body.recurrenceRule - The recurrence rule for the event.
     * @param {Array<string>} req.body.participants - The usernames of participants.
     * @param {Object} res - The HTTP response object.
     * @returns {Object} The created event.
     */
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
  /**
 * @route POST /api/events/:id/participants
 * @description Invites a user to an event by their username.
 * @access Protected
 * @middleware verifyToken
 * @param {Object} req - The HTTP request object.
 * @param {string} req.params.id - The ID of the event.
 * @param {string} req.body.username - The username of the user to invite.
 * @param {Object} res - The HTTP response object.
 * @returns {Object} A success message or an error message.
 */
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
      return res.status(400).json({ message: "User already a participant" });
    }

    event.participants.push(userToInvite._id);

    await event.save();

    res.json({ message: "User invited successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @route POST /api/events/:id/join
 * @description Allows a user to join an event.
 * @access Protected
 * @middleware verifyToken
 * @param {Object} req - The HTTP request object.
 * @param {string} req.params.id - The ID of the event.
 * @param {Object} res - The HTTP response object.
 * @returns {Object} A success message or an error message.
 */
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
      return res.status(400).json({ error: "You are already a participant" });
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

/**
 * @route POST /api/event-series
 * @description Creates a new event series.
 * @access Protected
 * @middleware verifyToken
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.body - The request body containing event series details.
 * @param {Object} res - The HTTP response object.
 * @returns {Object} The created event series or an error message.
 */
app.post("/api/event-series", verifyToken, async (req, res) => {
  try {
    const newSeries = new EventSeries({
      name: req.body.name,
      creatorId: req.user.id,
      seriesType: req.body.seriesType,
      isIndefinite: req.body.isIndefinite,
      startingEvent: req.body.startingEvent,
      endingEvent: req.body.isIndefinite ? undefined : req.body.endingEvent,
      recurrenceRule:
        req.body.seriesType === "recurring" ? req.body.recurrenceRule : undefined,
      eventsId: req.body.seriesType === "manual" ? req.body.eventsId : [],
    });

    const savedSeries = await newSeries.save();
    res.status(201).json(savedSeries);
  } catch (err) {
    console.error("Error creating event series:", err);
    res.status(400).json({ error: err.message });
  }
});

/**
 * @route DELETE /api/events/:id/participants/:participantId
 * @description Removes a participant from an event.
 * @access Protected
 * @middleware verifyToken
 * @param {Object} req - The HTTP request object.
 * @param {string} req.params.id - The ID of the event.
 * @param {string} req.params.participantId - The ID of the participant to remove.
 * @param {Object} res - The HTTP response object.
 * @returns {Object} A success message or an error message.
 */
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

/**
 * @route GET /api/events
 * @description Retrieves all events accessible to the user.
 * @access Protected
 * @middleware verifyToken
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Array<Object>} A list of events or an error message.
 */
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
/**
 * @route GET /api/events/mine
 * @description Retrieves all events created by the authenticated user.
 * @access Protected
 * @middleware verifyToken
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Array<Object>} A list of events created by the user.
 */
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

/**
 * @route GET /api/events/public
 * @description Retrieves all public events.
 * @access Public
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Array<Object>} A list of public events.
 */
app.get("/api/events/public", async (req, res) => {
  try {
    const events = await Event.find({ type: "public" });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @route GET /api/events/participating
 * @description Retrieves all events the authenticated user is participating in.
 * @access Protected
 * @middleware verifyToken
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Array<Object>} A list of events the user is participating in.
 */
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

/**
 * @route GET /api/events/admin
 * @description Retrieves all events with pagination and search functionality for admin users.
 * @access Protected
 * @middleware verifyToken
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.query.page - The page number for pagination.
 * @param {Object} req.query.limit - The number of events per page.
 * @param {Object} req.query.search - The search query for event names.
 * @param {Object} res - The HTTP response object.
 * @returns {Object} An object containing events, total pages, total events, and the current page.
 */
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

/**
 * @route PUT /api/events/admin/:id
 * @description Updates an event by its ID. Only the owner or an admin can update the event.
 * @access Protected
 * @middleware verifyToken
 * @param {Object} req - The HTTP request object.
 * @param {string} req.params.id - The ID of the event to update.
 * @param {Object} req.body - The updated event data.
 * @param {Object} res - The HTTP response object.
 * @returns {Object} The updated event.
 */
app.put("/api/events/admin/:id", verifyToken, async (req, res) => {
  try {
    const eventId = req.params.id;
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const isOwner = event.userId.toString() === req.user.id;
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
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

/**
 * @route DELETE /api/events/admin/:id
 * @description Deletes an event by its ID. Only the owner or an admin can delete the event.
 * @access Protected
 * @middleware verifyToken
 * @param {Object} req - The HTTP request object.
 * @param {string} req.params.id - The ID of the event to delete.
 * @param {Object} res - The HTTP response object.
 * @returns {Object} A success message.
 */
app.delete("/api/events/admin/:id", verifyToken, async (req, res) => {
  try {
    const eventId = req.params.id;
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const isOwner = event.userId.toString() === req.user.id;
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        message: "You do not have permission to delete this event",
      });
    }

    await Event.findByIdAndDelete(eventId);

    res.status(200).json({ message: "Event deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @route DELETE /api/events/:id/leave
 * @description Allows a user to leave an event they are participating in.
 * @access Protected
 * @middleware verifyToken
 * @param {Object} req - The HTTP request object.
 * @param {string} req.params.id - The ID of the event to leave.
 * @param {Object} res - The HTTP response object.
 * @returns {Object} A success message.
 */
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

/**
 * @route POST /api/events/invite/:id
 * @description Invites a user to an event by their username.
 * @access Protected
 * @middleware verifyToken
 * @param {Object} req - The HTTP request object.
 * @param {string} req.params.id - The ID of the event.
 * @param {string} req.body.username - The username of the user to invite.
 * @param {Object} res - The HTTP response object.
 * @returns {Object} A success message or an error message.
 */
app.post("/api/events/invite/:id", verifyToken, async (req, res) => {
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
      return res.status(400).json({ message: "User already a participant" });
    }

    event.participants.push(userToInvite._id);

    await event.save();

    res.json({ message: "User invited successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @route DELETE /api/events/:id
 * @description Deletes an event by its ID. Only the owner can delete the event.
 * @access Protected
 * @middleware verifyToken
 * @param {Object} req - The HTTP request object.
 * @param {string} req.params.id - The ID of the event to delete.
 * @param {Object} res - The HTTP response object.
 * @returns {Object} A success message.
 */
app.delete("/api/events/:id", verifyToken, async (req, res) => {
  try {
    const eventId = req.params.id;
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.userId.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You do not have permission to delete this event",
      });
    }

    await Event.findByIdAndDelete(eventId);

    res.status(200).json({ message: "Event deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @route DELETE /api/event-series/:id
 * @description Deletes an event series by its ID. Only the creator can delete the series.
 * @access Protected
 * @middleware verifyToken
 * @param {Object} req - The HTTP request object.
 * @param {string} req.params.id - The ID of the event series to delete.
 * @param {Object} res - The HTTP response object.
 * @returns {Object} A success message.
 */
app.delete("/api/event-series/:id", verifyToken, async (req, res) => {
  try {
    const seriesId = req.params.id;
    const series = await EventSeries.findById(seriesId);

    if (!series) {
      return res.status(404).json({ message: "Event series not found" });
    }

    if (series.creatorId.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You do not have permission to delete this event series",
      });
    }

    await EventSeries.findByIdAndDelete(seriesId);

    res.status(200).json({ message: "Event series deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
/**
 * @route DELETE /api/delete-requests/:id
 * @description Deletes a delete request by its ID. Only the owner of the request can delete it.
 * @access Protected
 * @middleware verifyToken
 * @param {Object} req - The HTTP request object.
 * @param {string} req.params.id - The ID of the delete request to delete.
 * @param {Object} res - The HTTP response object.
 * @returns {Object} A success message or an error message.
 */
app.delete("/api/delete-requests/:id", verifyToken, async (req, res) => {
  try {
    const deleteRequestId = req.params.id;
    const deleteRequest = await DeleteRequest.findById(deleteRequestId);

    if (!deleteRequest) {
      return res.status(404).json({ message: "Delete request not found" });
    }

    if (deleteRequest.userId.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You do not have permission to delete this request",
      });
    }

    await DeleteRequest.findByIdAndDelete(deleteRequestId);

    res.status(200).json({ message: "Delete request deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @route PUT /api/events/:id
 * @description Updates an event by its ID. Only the owner of the event can update it.
 * @access Protected
 * @middleware verifyToken
 * @param {Object} req - The HTTP request object.
 * @param {string} req.params.id - The ID of the event to update.
 * @param {Object} req.body - The updated event data.
 * @param {Object} res - The HTTP response object.
 * @returns {Object} The updated event or an error message.
 */
app.put("/api/events/:id", verifyToken, async (req, res) => {
  try {
    const eventId = req.params.id;
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.userId.toString() !== req.user.id) {
      return res.status(403).json({
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

/**
 * @route PUT /api/event-series/:id
 * @description Updates an event series by its ID. Only the creator of the series can update it.
 * @access Protected
 * @middleware verifyToken
 * @param {Object} req - The HTTP request object.
 * @param {string} req.params.id - The ID of the event series to update.
 * @param {Object} req.body - The updated event series data.
 * @param {Object} res - The HTTP response object.
 * @returns {Object} The updated event series or an error message.
 */
app.put("/api/event-series/:id", verifyToken, async (req, res) => {
  try {
    const seriesId = req.params.id;
    const series = await EventSeries.findById(seriesId);

    if (!series) {
      return res.status(404).json({ message: "Event series not found" });
    }

    if (series.creatorId.toString() !== req.user.id) {
      return res.status(403).json({
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

/**
 * @route GET /api/event-series
 * @description Retrieves all event series created by the authenticated user.
 * @access Protected
 * @middleware verifyToken
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Array<Object>} A list of event series created by the user.
 */
app.get("/api/event-series", verifyToken, async (req, res) => {
  try {
    const series = await EventSeries.find({ creatorId: req.user.id });
    res.json(series);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @route GET /api/delete-requests
 * @description Retrieves all delete requests created by the authenticated user.
 * @access Protected
 * @middleware verifyToken
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Array<Object>} A list of delete requests created by the user.
 */
app.get("/api/delete-requests", verifyToken, async (req, res) => {
  try {
    const requests = await DeleteRequest.find({ userId: req.user.id });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @route GET /api/users/me
 * @description Retrieves the authenticated user's details.
 * @access Protected
 * @middleware verifyToken
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Object} The user's details or an error message.
 */
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

/**
 * @description Starts the server and listens on the specified port.
 * @param {number} [process.env.PORT=8000] - The port on which the server listens.
 */
server.listen(process.env.PORT || 8000, () => {
  console.log(`🚀 Server running on port ${process.env.PORT || 8000}`);
});

/**
 * @description Handles MongoDB connection errors.
 * @param {Error} err - The error object.
 */
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
