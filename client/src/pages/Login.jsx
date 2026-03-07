import { useState, useEffect } from "react"
import API from "../services/api"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import toast from "react-hot-toast"

export default function Login() {
  const navigate = useNavigate()
  const { user, login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw] = useState(false)

  // Redirect if already logged in
  useEffect(() => {
    if (user) navigate("/")
  }, [user])

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await API.post("/auth/login", { email, password })
      login(res.data.user, res.data.token)
      toast.success("Welcome back!")
      navigate("/")
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid email or password")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: "calc(100vh - 64px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "40px 16px",
      background: "linear-gradient(135deg, var(--bg) 0%, var(--bg-subtle) 100%)"
    }}>
      <div className="fade-up" style={{ width: "100%", maxWidth: 420 }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            width: 52, height: 52, background: "var(--accent)",
            borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 22, margin: "0 auto 16px", boxShadow: "0 4px 16px rgba(224,45,45,.3)"
          }}>🛒</div>
          <h1 style={{ fontSize: 28, marginBottom: 6 }}>Welcome back</h1>
          <p style={{ color: "var(--text-muted)", fontSize: 15 }}>Sign in to your ShopEZ account</p>
        </div>

        <div className="card" style={{ boxShadow: "var(--shadow-lg)" }}>
          <div className="card-body" style={{ padding: 32 }}>
            <form onSubmit={handleLogin}>

              <div className="form-group">
                <label>Email address</label>
                <input
                  type="email" className="form-control"
                  placeholder="you@example.com"
                  required value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ position: "relative" }}>
                <label>Password</label>
                <input
                  type={showPw ? "text" : "password"}
                  className="form-control"
                  placeholder="Enter your password"
                  required value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={{ paddingRight: 44 }}
                />
                <button type="button" onClick={() => setShowPw(!showPw)} style={{
                  position: "absolute", right: 12, top: 34,
                  background: "none", border: "none", cursor: "pointer",
                  color: "var(--text-muted)", fontSize: 16, padding: 4
                }}>{showPw ? "🙈" : "👁️"}</button>
              </div>

              <button className="btn btn-primary btn-w100" style={{ marginTop: 8, padding: "13px" }} disabled={loading}>
                {loading ? <><span className="spinner-sm" style={{ borderColor: "rgba(255,255,255,.3)", borderTopColor: "#fff" }} /> &nbsp;Signing in...</> : "Sign in"}
              </button>

            </form>

            <hr className="divider" />

            <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: 14 }}>
              Don't have an account? <Link to="/register" style={{ fontWeight: 600, color: "var(--accent)" }}>Create one</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}