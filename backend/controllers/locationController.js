import Location from "../models/LocationModel.js";

// ➜ Créer une localisation
export const createLocation = async (req, res) => {
  try {
    const { name, latitude, longitude } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({ message: "Latitude et longitude requises" });
    }

    const location = await Location.create({
      name,
      location: {
        type: "Point",
        coordinates: [longitude, latitude],
      },
    });

    res.status(201).json(location);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ➜ Trouver les lieux proches
export const getNearbyLocations = async (req, res) => {
  try {
    const { lat, lng, distance = 5000 } = req.query;

    const locations = await Location.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [Number(lng), Number(lat)],
          },
          $maxDistance: Number(distance), // en mètres
        },
      },
    });

    res.json(locations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
