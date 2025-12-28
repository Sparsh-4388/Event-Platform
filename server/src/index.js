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
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or Postman)
    if (!origin) return callback(null, true);
    
    // List of allowed origins
    const allowedOrigins = [
      "https://event-platform-kappa-tan.vercel.app",
      // Add more production URLs here if needed
    ];
    
    // Check if origin is in allowed list or is a Vercel preview deployment
    if (
      allowedOrigins.includes(origin) ||
      origin.includes("vercel.app")
    ) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
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