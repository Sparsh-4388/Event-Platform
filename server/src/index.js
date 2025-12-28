import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import eventRoutes from "./routes/event.routes.js";
import rsvpRoutes from "./routes/rsvp.routes.js";
import connectDB from "./config/db.js";

dotenv.config();

const app = express();

app.use(cors({
  origin: [
    "event-platform-kappa-tan.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/rsvp", rsvpRoutes);

app.get("/", (req, res) => {
  res.send("API running");
});

connectDB(process.env.MONGO_URI)
  .then(() => app.listen(process.env.PORT || 5000, () => console.log("Server started")))
  .catch(err => console.error(err));
