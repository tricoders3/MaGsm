// backend/server.js
import express from "express";
import dotenv from "dotenv";
import path from "path";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import passport from "./passport.js";
import cors from "cors";
import session from "express-session";

// ------------------
// Load .env from root (MaGsm/.env)
// ------------------
dotenv.config({ path: path.resolve("../.env") });

// ------------------
// Connect MongoDB
// ------------------
connectDB();

// ------------------
// Initialize Express
// ------------------
const app = express();
app.use(cookieParser());
app.use(express.json());

// ------------------
// Express Session
// ------------------
app.use(
  session({
    secret: process.env.SESSION_SECRET || "fallbacksecret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // true si HTTPS
  })
);

// ------------------
// Passport
// ------------------
app.use(passport.initialize());
app.use(passport.session());

// ------------------
// CORS
// ------------------
app.use(
  cors({
    origin:"http://localhost:3000",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

// ------------------
// Routes
// ------------------
app.get("/", (req, res) => res.send("🚀 Backend running"));
app.use("/api/auth", authRoutes);

// ------------------
// Start Server
// ------------------
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});


