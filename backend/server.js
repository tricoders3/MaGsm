// backend/server.js
import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "./passport.js";
import cors from "cors";

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
app.use(express.json());
app.use(cookieParser());

// ------------------
// Express Session
// ------------------
app.use(
  session({
    secret: process.env.SESSION_SECRET || "fallbacksecret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
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
    origin: "https://magsm.onrender.com",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
if (process.env.NODE_ENV === "production") {
  const buildPath = path.join(__dirname, "../frontend/build");
  app.use(express.static(buildPath));
  app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(buildPath, "index.html"));
  });


} else {
  app.get("/*", (req, res) => {
    res.send("API is running....");
  });
}
// ------------------
// API Routes
// ------------------
app.get("/", (req, res) => res.send("🚀 Backend running"));

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
app.use ("/api/brands", brandRoutes);
// Facebook data deletion
app.get("/facebook-data-deletion", (req, res) => {
  res.send(`
    <h2>Suppression des données utilisateur</h2>
    <p>Contactez : <b>support@tonsite.com</b></p>
  `);
});

// ------------------
// Serve React Build in Production
// ------------------


// ------------------
// Start Server
// ------------------
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
