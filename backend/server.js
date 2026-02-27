// server.js
import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "./passport.js";
import cors from "cors";
import MongoStore from 'connect-mongo';
// ------------------
// Routes
// ------------------
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from './routes/categoryRoutes.js';
import userRoutes from './routes/userRoutes.js';
import promotionRoutes from './routes/promotionRoutes.js';
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import favoriteRoutes from './routes/favoriteRoutes.js';
import settingsRoutes from './routes/siteSettingsRoutes.js';
import contactMsgRoutes from "./routes/contactMsgRoutes.js";
import brandRoutes from "./routes/brandRoutes.js";

// ------------------
// Fix __dirname in ES modules
// ------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ------------------
// Load .env
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

// ------------------
// Middlewares
// ------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ------------------
// CORS
// ------------------
app.use(
  cors({
    origin: ["https://magsm.tn", "http://localhost:3000", "http://102.204.206.212"],
    credentials: true, // مهم
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// ------------------
// Session middleware
// ------------------
app.use(
  session({
    secret: process.env.SESSION_SECRET || "fallbacksecret",
    resave: false,
    saveUninitialized: false, // false مهم
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // true فقط في HTTPS
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 1000 * 60 * 60 * 24, // 1 يوم
    },
  })
);

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI })
}));
// ------------------
// Passport
// ------------------
app.use(passport.initialize());
app.use(passport.session()); // مهم جدًا بعد session

// ------------------
// API Routes
// ------------------
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/user", userRoutes);
app.use("/api/promotions", promotionRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/site-settings", settingsRoutes);
app.use("/api/contact", contactMsgRoutes);
app.use("/api/brands", brandRoutes);

// ------------------
// React build in production
// ------------------
if (process.env.NODE_ENV === "production") {
  const buildPath = path.join(__dirname, "../frontend/build");
  app.use(express.static(buildPath));

  app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(buildPath, "index.html"));
  });
} else {
  app.get("/", (req, res) => res.send("🚀 Backend running"));
}

// ------------------
// Start server
// ------------------
const PORT = process.env.PORT || 8080;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend running on http://127.0.0.1:${PORT}`);
});
