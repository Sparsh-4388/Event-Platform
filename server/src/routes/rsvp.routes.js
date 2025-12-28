import express from "express";
import Event from "../models/Event.js";
import Rsvp from "../models/Rsvp.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/:id/join", authMiddleware, async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.user.id;

    const event = await Event.findById(eventId);
    if (!event)
      return res.status(404).json({ message: "Event not found" });

    const count = await Rsvp.countDocuments({ event: eventId });
    if (count >= event.capacity)
      return res.status(400).json({ message: "Event is full" });

    const existing = await Rsvp.findOne({ event: eventId, user: userId });
    if (existing)
      return res.status(400).json({ message: "Already joined" });

    await Rsvp.create({ event: eventId, user: userId });

    res.json({ message: "Joined event" });
  } catch (err) {
    if (err.code === 11000)
      return res.status(400).json({ message: "Already joined" });

    console.error("JOIN ERROR:", err);
    res.status(500).json({ message: "Failed to join event" });
  }
});


router.post("/:id/leave", authMiddleware, async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.user.id;

    const rsvp = await Rsvp.findOneAndDelete({
      event: eventId,
      user: userId,
    });

    if (!rsvp)
      return res.status(400).json({ message: "You have not joined this event" });

    res.json({ message: "Left event" });
  } catch (err) {
    console.error("LEAVE ERROR:", err);
    res.status(500).json({ message: "Failed to leave event" });
  }
});

export default router;
