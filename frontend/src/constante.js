const BASE_URL =
  process.env.NODE_ENV === "development"
    ? ""
    : "https://magsm.onrender.com";

export default BASE_URL;