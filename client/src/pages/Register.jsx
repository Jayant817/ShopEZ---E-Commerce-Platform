import { useState, useEffect } from "react"
import API from "../services/api"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import toast from "react-hot-toast"

export default function Register() {
  const [form, setForm] = useState({ username: "", email: "", password: "" })
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw] = useState(false)
  const navigate = useNavigate()
  const { user } = useAuth()

  // Redirect if already logged in
  useEffect(() => {
    if (user) navigate("/")
  }, [user])

  const submit = async (e) => {
    e.preventDefault()

    // Client-side password length check
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters")
      return
    }

    setLoading(true)
    try {
      await API.post("/auth/register", form)
      toast.success("Account created! Please log in.")
      navigate("/login")
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed")
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
      <div className="fade-up" style={{ width: "100%", maxWidth: 440 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            width: 52, height: 52, background: "var(--bg-dark)",
            borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 22, margin: "0 auto 16px"
          }}>✨</div>
          <h1 style={{ fontSize: 28, marginBottom: 6 }}>Create your account</h1>
          <p style={{ color: "var(--text-muted)", fontSize: 15 }}>Join ShopEZ and start shopping</p>
        </div>

        <div className="card" style={{ boxShadow: "var(--shadow-lg)" }}>
          <div className="card-body" style={{ padding: 32 }}>
            <form onSubmit={submit}>
              <div className="form-group">
                <label>Username</label>
                <input className="form-control" placeholder="Your name" required
                  value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" className="form-control" placeholder="you@example.com" required
                  value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="form-group" style={{ position: "relative" }}>
                <label>Password</label>
                <input
                  type={showPw ? "text" : "password"}
                  className="form-control"
                  placeholder="Min. 6 characters"
                  required
                  minLength={6}
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  style={{ paddingRight: 44 }}
                />
                <button type="button" onClick={() => setShowPw(!showPw)} style={{
                  position: "absolute", right: 12, top: 34,
                  background: "none", border: "none", cursor: "pointer",
                  color: "var(--text-muted)", fontSize: 16, padding: 4
                }}>{showPw ? "🙈" : "👁️"}</button>
              </div>
              <button className="btn btn-dark btn-w100" style={{ padding: "13px", marginTop: 8 }} disabled={loading}>
                {loading ? <><span className="spinner-sm" style={{ borderColor: "rgba(255,255,255,.3)", borderTopColor: "#fff" }} /> &nbsp;Creating...</> : "Create Account"}
              </button>
            </form>
            <hr className="divider" />
            <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: 14 }}>
              Already have an account? <Link to="/login" style={{ fontWeight: 600, color: "var(--accent)" }}>Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
