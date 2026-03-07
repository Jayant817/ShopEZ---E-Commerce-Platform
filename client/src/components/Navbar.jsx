import { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import API from "../services/api"
const ACCENT = "#e02d2d"
const DARK   = "#111111"
const BORDER = "#e7e5e0"
const MUTED  = "#78716c"
const SUBTLE = "#f4f3f0"
const TEXT   = "#1c1917"
function Navbar() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [cartCount, setCartCount] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    if (user) fetchCartCount()
else setCartCount(0)
  }, [user, location.pathname])

  useEffect(() => { setMenuOpen(false) }, [location.pathname])

  const fetchCartCount = async () => {
    try {
      const res = await API.get(`/cart/${user._id}`)
      setCartCount(res.data.data?.length || 0)
    } catch { /* silent */ }
  }

  const handleLogout = () => { logout(); navigate("/") }

  const isAdmin = user?.usertype === "Admin"
  const inAdmin = location.pathname.startsWith("/admin")

  return (
    <>
      <nav style={{
        position: "sticky", top: 0, zIndex: 1000,
        background: scrolled ? "rgba(255,255,255,0.96)" : "#fff",
        borderBottom: "1px solid var(--border)",
        backdropFilter: "blur(12px)",
        transition: "box-shadow .2s",
        boxShadow: scrolled ? "var(--shadow-sm)" : "none"
      }}>
        <div className="container" style={{ display: "flex", alignItems: "center", height: 64, gap: 8 }}>

          {/* Logo */}
          <Link to="/" style={{
            fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 22,
            color: "var(--text)", letterSpacing: "-.02em", marginRight: 8,
            display: "flex", alignItems: "center", gap: 6, flexShrink: 0
          }}>
            <span style={{
              background: ACCENT, color: "#fff",
              borderRadius: 6, padding: "2px 8px 3px", fontSize: 18
            }}>S</span>
            hopEZ
          </Link>

          {/* Center nav — customer */}
          {!inAdmin && (
            <div style={{ display: "flex", alignItems: "center", gap: 2, flex: 1 }}>
              <NavLink to="/products" active={location.pathname === "/products"}>Products</NavLink>
              {user && <NavLink to="/orders" active={location.pathname === "/orders"}>Orders</NavLink>}
            </div>
          )}

          {/* Center nav — admin */}
          {inAdmin && isAdmin && (
            <div style={{ display: "flex", alignItems: "center", gap: 2, flex: 1 }}>
              <NavLink to="/admin" active={location.pathname === "/admin"}>Dashboard</NavLink>
              <NavLink to="/admin/products" active={location.pathname.startsWith("/admin/products") || location.pathname === "/admin/add-product"}>Products</NavLink>
              <NavLink to="/admin/orders" active={location.pathname === "/admin/orders"}>Orders</NavLink>
            </div>
          )}

          {/* Right side */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: "auto" }}>
            {/* Admin pill */}
            {isAdmin && !inAdmin && (
              <Link to="/admin" style={{
                background: DARK , color: "#fff",
                padding: "6px 14px", borderRadius: "var(--radius-full)",
                fontSize: 13, fontWeight: 600, letterSpacing: ".01em"
              }}>Admin Panel</Link>
            )}
            {inAdmin && (
              <Link to="/" style={{
                background: "var(--bg-subtle)", color: "var(--text)",
                padding: "6px 14px", borderRadius: "var(--radius-full)",
                fontSize: 13, fontWeight: 600, border: "1px solid var(--border)"
              }}>← Store</Link>
            )}

            {/* Cart */}
            {user && (
              <Link to="/cart" style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <span style={{
                  background: "var(--bg-subtle)", border: "1px solid var(--border)",
                  borderRadius: "var(--radius-sm)", padding: "8px 12px",
                  fontSize: 18, transition: "var(--transition)"
                }}
                  onMouseEnter={e => e.currentTarget.style.background = "var(--border)"}
                  onMouseLeave={e => e.currentTarget.style.background = "var(--bg-subtle)"}
                >🛒</span>
                {cartCount > 0 && (
                  <span style={{
                    position: "absolute", top: -5, right: -5,
                    background: ACCENT, color: "#fff",
                    borderRadius: "var(--radius-full)", fontSize: 11,
                    fontWeight: 700, minWidth: 18, height: 18,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    padding: "0 4px", border: "2px solid #fff"
                  }}>{cartCount}</span>
                )}
              </Link>
            )}

            {!user ? (
              <>
                <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
                <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
              </>
            ) : (
              <button className="btn btn-ghost btn-sm" onClick={handleLogout}
                style={{ color: "var(--text-muted)" }}>
                Sign out
              </button>
            )}
          </div>
        </div>
      </nav>
    </>
  )
}

function NavLink({ to, active, children }) {
  return (
    <Link to={to} style={{
      padding: "6px 14px", borderRadius: "var(--radius-full)",
      fontSize: 14, fontWeight: active ? 600 : 400,
      color: active ? "var(--text)" : "var(--text-muted)",
      background: active ? "var(--bg-subtle)" : "transparent",
      transition: "var(--transition)", textDecoration: "none"
    }}
      onMouseEnter={e => { if (!active) e.currentTarget.style.background = "var(--bg-subtle)"; e.currentTarget.style.color = "var(--text)" }}
      onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = active ? "var(--text)" : "var(--text-muted)" }}
    >{children}</Link>
  )
}

export default Navbar
