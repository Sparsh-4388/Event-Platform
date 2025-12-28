import express from "express";
import Event from "../models/Event.js";
import Rsvp from "../models/Rsvp.js";
import authMiddleware from "../middleware/auth.middleware.js";
import { adminMiddleware } from "../middleware/admin.middleware.js";


const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const events = await Event.find()
      .populate("createdBy", "_id name email")
      .lean();

    const eventIds = events.map(e => e._id);

    const rsvps = await Rsvp.find({
      event: { $in: eventIds }
    }).lean();

    const attendeeCountMap = {};
    const joinedEventSet = new Set();

    for (const rsvp of rsvps) {
      const eventId = rsvp.event.toString();

      attendeeCountMap[eventId] =
        (attendeeCountMap[eventId] || 0) + 1;

      if (rsvp.user.toString() === userId) {
        joinedEventSet.add(eventId);
      }
    }

    const formattedEvents = events.map(ev => {
      const count = attendeeCountMap[ev._id.toString()] || 0;

      return {
        ...ev,
        attendeesCount: count,
        joined: joinedEventSet.has(ev._id.toString()),
        available: count < ev.capacity,
      };
    });

    res.json(formattedEvents);
  } catch (err) {
    console.error("EVENT FETCH ERROR:", err);
    res.status(500).json({ message: "Failed to fetch events" });
  }
});


router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("createdBy", "_id name email");

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json(event);
  } catch (err) {
    console.error("GET EVENT ERROR:", err);
    res.status(500).json({ message: "Failed to fetch event" });
  }
});


router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { title, description, datetime, location, capacity } = req.body;

    if (!title || !description || !datetime || !location || !capacity) {
      return res.status(400).json({ message: "All fields required" });
    }

    const event = await Event.create({
      title,
      description,
      datetime,
      location,
      capacity,
      createdBy: req.user.id,
    });

    res.status(201).json(event);
  } catch (err) {
    console.error("CREATE EVENT ERROR:", err);
    res.status(500).json({ message: "Failed to create event" });
  }
});


router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event)
      return res.status(404).json({ message: "Event not found" });

    if (event.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await event.deleteOne();
    await Rsvp.deleteMany({ event: event._id });

    res.json({ message: "Event deleted" });
  } catch (err) {
    console.error("DELETE EVENT ERROR:", err);
    res.status(500).json({ message: "Failed to delete event" });
  }
});


router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const event = await Event.findById(req.params.id);

      if (!event)
        return res.status(404).json({ message: "Event not found" });

      if (event.createdBy.toString() !== req.user.id) {
        return res.status(403).json({ message: "Not allowed" });
      }

      const {
        title,
        description,
        datetime,
        location,
        capacity
      } = req.body;

      event.title = title;
      event.description = description;
      event.datetime = datetime;
      event.location = location;
      event.capacity = capacity;

      await event.save();

      res.json(event);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

export default router;