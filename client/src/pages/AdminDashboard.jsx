import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import API from "../services/api"

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, products: 0, orders: 0, revenue: 0 })
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchStats() }, [])

  const fetchStats = async () => {
    try {
      const [uR, pR, oR] = await Promise.all([API.get("/users"), API.get("/products"), API.get("/orders")])
      const orders = oR.data.data || []
      const revenue = orders.reduce((s, o) => s + o.items.reduce((ss, i) => ss + i.price * i.quantity, 0), 0)
      setStats({ users: uR.data.data.length, products: pR.data.data.length, orders: orders.length, revenue })
      setRecentOrders(orders.slice(0, 5))
    } catch { /* silent */ }
    finally { setLoading(false) }
  }

  if (loading) return <div className="page-loading"><div className="spinner" /></div>

  const STATS = [
    { label: "Total Revenue", value: "₹" + stats.revenue.toLocaleString("en-IN"), icon: "💰", change: stats.orders > 0 ? `from ${stats.orders} orders` : "No orders yet", color: "#fef9c3", accent: "#ca8a04" },
    { label: "Total Orders",  value: stats.orders, icon: "📦", change: stats.orders + " orders placed", color: "#ede9fe", accent: "#7c3aed" },
    { label: "Products",      value: stats.products, icon: "🏷️", change: "In catalogue", color: "#dcfce7", accent: "#16a34a" },
    { label: "Customers",     value: stats.users, icon: "👥", change: "Registered users", color: "#fce7f3", accent: "#db2777" },
  ]

  const STATUS_COLOR = { "Order Placed": "#94a3b8", "Processing": "var(--warning)", "Shipped": "var(--blue)", "Delivered": "var(--success)" }

  return (
    <div className="page">
      <div className="container">

        <div style={{ marginBottom: 36 }}>
          <h1 style={{ fontSize: 32, marginBottom: 4 }}>Dashboard</h1>
          <p style={{ color: "var(--text-muted)" }}>{new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}</p>
        </div>

        {/* Stat cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 36 }}>
          {STATS.map((s, i) => (
            <div key={i} className="card fade-up" style={{ animationDelay: `${i * .06}s` }}>
              <div style={{ padding: "22px 22px 18px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                  <div style={{ background: s.color, borderRadius: "var(--radius-sm)", width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{s.icon}</div>
                  <span style={{ fontSize: 12, color: s.accent, fontWeight: 600 }}>{s.change}</span>
                </div>
                <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 30, lineHeight: 1, marginBottom: 4 }}>{s.value}</div>
                <div style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 500 }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent orders + Quick actions */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 20, alignItems: "start" }}>

          <div className="card">
            <div style={{ padding: "20px 22px 14px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h5 style={{ fontFamily: "'Syne',sans-serif", margin: 0 }}>Recent Orders</h5>
              <Link to="/admin/orders" style={{ fontSize: 13, color: "var(--accent)", fontWeight: 600 }}>View all →</Link>
            </div>
            <div>
              {recentOrders.map((o, i) => (
                <div key={o._id} style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "14px 22px",
                  borderBottom: i < recentOrders.length - 1 ? "1px solid var(--border)" : "none"
                }}>
                  <div style={{ width: 36, height: 36, borderRadius: "var(--radius-sm)", background: "var(--bg-subtle)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>📦</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {o.items[0]?.title}{o.items.length > 1 ? ` +${o.items.length - 1}` : ""}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                      {new Date(o.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    </div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>₹{o.items.reduce((s, i) => s + i.price * i.quantity, 0)}</div>
                    <div style={{ fontSize: 12, color: STATUS_COLOR[o.orderStatus] || "#888", fontWeight: 600 }}>{o.orderStatus}</div>
                  </div>
                </div>
              ))}
              {recentOrders.length === 0 && <div style={{ padding: "24px 22px", color: "var(--text-muted)", fontSize: 14 }}>No orders yet.</div>}
            </div>
          </div>

          {/* Quick actions */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <h5 style={{ fontFamily: "'Syne',sans-serif", margin: 0, marginBottom: 4 }}>Quick Actions</h5>
            {[
              { to: "/admin/add-product", icon: "➕", label: "Add New Product", desc: "Add to catalogue" },
              { to: "/admin/products", icon: "🏷️", label: "Manage Products", desc: `${stats.products} products` },
              { to: "/admin/orders", icon: "📦", label: "View Orders", desc: `${stats.orders} total orders` },
            ].map(a => (
              <Link key={a.to} to={a.to} style={{ textDecoration: "none" }}>
                <div className="card" style={{ transition: "var(--transition)" }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = "var(--shadow)"; e.currentTarget.style.transform = "translateY(-2px)" }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = ""; e.currentTarget.style.transform = "" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px" }}>
                    <div style={{ fontSize: 22, width: 36, textAlign: "center" }}>{a.icon}</div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14, color: "var(--text)" }}>{a.label}</div>
                      <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{a.desc}</div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </div>
    </div>
  )
}
