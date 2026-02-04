const BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8080"
    : "https://magsm.onrender.com";

export default BASE_URL;