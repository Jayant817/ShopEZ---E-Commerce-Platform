import axios from "axios"

const API = axios.create({
  // Use environment variable so this works in production too
  // Add VITE_API_URL=http://localhost:8000/api to your .env file
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api"
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