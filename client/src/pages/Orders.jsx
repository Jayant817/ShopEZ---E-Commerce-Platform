import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import API from "../services/api"
import { useAuth } from "../context/AuthContext"

const STATUS_CONFIG = {
  "Order Placed": { color: "var(--text-muted)", bg: "var(--bg-subtle)", icon: "📋" },
  "Processing":   { color: "var(--warning)",    bg: "var(--warning-soft)", icon: "⚙️" },
  "Shipped":      { color: "var(--blue)",        bg: "var(--blue-soft)", icon: "🚚" },
  "Delivered":    { color: "var(--success)",     bg: "var(--success-soft)", icon: "✅" },
}

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => { if (user) fetchOrders() }, [])

  const fetchOrders = async () => {
    try {
      const res = await API.get(`/orders/${user._id}`)
      setOrders(res.data.data || [])
    } catch { /* silent */ }
    finally { setLoading(false) }
  }

  if (loading) return <div className="page-loading"><div className="spinner" /></div>

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 800 }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 32 }}>My Orders</h1>
          <p style={{ color: "var(--text-muted)" }}>{orders.length} order{orders.length !== 1 ? "s" : ""} placed</p>
        </div>

        {orders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📦</div>
            <h4>No orders yet</h4>
            <p>Place your first order and it will appear here.</p>
            <Link to="/products" className="btn btn-primary" style={{ marginTop: 8 }}>Start Shopping</Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {orders.map((order, idx) => {
              const cfg = STATUS_CONFIG[order.orderStatus] || STATUS_CONFIG["Order Placed"]
              const orderTotal = order.items.reduce((s, i) => s + i.price * i.quantity, 0)
              return (
                <div key={order._id} className="card fade-up" style={{ animationDelay: `${idx * .05}s` }}>

                  {/* Header */}
                  <div style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "14px 20px", borderBottom: "1px solid var(--border)",
                    flexWrap: "wrap", gap: 8
                  }}>
                    <div>
                      <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 2 }}>
                        {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                        <span style={{ margin: "0 8px" }}>·</span>
                        {order.paymentMethod}
                      </div>
                      <div style={{ fontSize: 12, color: "var(--text-light)" }}>
                        Order #{order._id.slice(-8).toUpperCase()}
                      </div>
                    </div>
                    <div style={{
                      display: "flex", alignItems: "center", gap: 6,
                      background: cfg.bg, color: cfg.color,
                      padding: "6px 14px", borderRadius: "var(--radius-full)",
                      fontSize: 13, fontWeight: 600
                    }}>
                      {cfg.icon} {order.orderStatus}
                    </div>
                  </div>

                  {/* Items */}
                  <div style={{ padding: "16px 20px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      {order.items.map((item, i) => (
                        <div key={i} style={{ display: "flex", gap: 12, alignItems: "center" }}>
                          <img src={item.image} alt={item.title} style={{
                            width: 56, height: 68, objectFit: "cover",
                            borderRadius: "var(--radius-sm)", flexShrink: 0,
                            border: "1px solid var(--border)"
                          }} />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 600, fontSize: 14 }}>{item.title}</div>
                            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                              Size: {item.size} · Qty: {item.quantity}
                            </div>
                          </div>
                          <span style={{ fontWeight: 700, fontSize: 15 }}>₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>

                    <div style={{
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      marginTop: 16, paddingTop: 14, borderTop: "1px solid var(--border)", flexWrap: "wrap", gap: 8
                    }}>
                      <span style={{ fontSize: 13, color: "var(--text-muted)" }}>📍 {order.address}</span>
                      <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 17 }}>
                        Total: ₹{orderTotal}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
