import { createContext, useContext, useState } from "react"

// Create the context
const AuthContext = createContext(null)

// Provider wraps the whole app (added in main.jsx)
export function AuthProvider({ children }) {

  // Initialize from localStorage so state survives a page refresh
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null
    } catch {
      return null
    }
  })

  const login = (userData, token) => {
    localStorage.setItem("user", JSON.stringify(userData))
    localStorage.setItem("token", token)
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook — any component can do: const { user, login, logout } = useAuth()
export function useAuth() {
  return useContext(AuthContext)
}
