import express from "express";
import cors from "cors";
const app = express();
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import connectDB from "./config/mongoDB";
import authRouter from "./routes/auth";
import bookingRouter from "./routes/booking";
import cabinRouter from "./routes/cabin";
import settingRouter from "./routes/settings";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.__dirname(__filename);

// Cors configuration
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://hotel-booking-management-system-fro.vercel.app",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
};

// Middleware to parse JSON requests
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Backend is running");
});

// API Routes
app.use("/api/auth", authRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/cabins", cabinRouter);
app.use("/api/settings", settingRouter);

connectDB(process.env.MONGO_URL);

const handler = app;
export default handler;
