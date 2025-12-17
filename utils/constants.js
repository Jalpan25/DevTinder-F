// utils/constants.js

export const BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:3000"
    : "/api";
