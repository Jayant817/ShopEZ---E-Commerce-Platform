import axios from "axios"

const API = axios.create({
  // Use environment variable so this works in production too
  // Add VITE_API_URL=https://shopez-backend-wl08.onrender.com to your .env file
  baseURL: import.meta.env.VITE_API_URL || "https://shopez-backend-wl08.onrender.com/api"
})

// Attach JWT token to every request automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token")
  if (token) {
    req.headers.Authorization = `Bearer ${token}`
  }
  return req
})

export default API