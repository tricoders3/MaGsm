import express from "express";
import {
  createLocation,
  getNearbyLocations,
} from "../controllers/locationController.js";

const router = express.Router();

router.post("/", createLocation);
router.get("/nearby", getNearbyLocations);

export default router;
