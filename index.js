import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/mongoDB";
import authRouter from "./routes/auth";
const app = express();

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

connectDB(process.env.MONGO_URL);

const handler = app;
export default handler;
