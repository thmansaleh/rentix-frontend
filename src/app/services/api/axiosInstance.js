import axios from "axios";

const api = axios.create({
  // baseURL: "https://backend-458651131509.europe-west1.run.app/api",
  baseURL: "http://localhost:8080/api",
  // baseURL: "https://law-backend-woad.vercel.app/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
