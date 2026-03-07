import { useEffect, useState } from "react"
import API from "../services/api"
import toast from "react-hot-toast"

const STATUS_OPTIONS = ["Order Placed", "Processing", "Shipped", "Delivered"]
const STATUS_CONFIG = {
  "Order Placed": { color: "var(--text-muted)", bg: "var(--bg-subtle)" },
  "Processing":   { color: "var(--warning)",    bg: "var(--warning-soft)" },
  "Shipped":      { color: "var(--blue)",        bg: "var(--blue-soft)" },
  "Delivered":    { color: "var(--success)",     bg: "var(--success-soft)" },
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("")

  useEffect(() => { fetchOrders() }, [])

  const fetchOrders = async () => {
    try {
      const res = await API.get("/orders")
      setOrders(res.data.data || [])
    } catch { toast.error("Failed to load orders") }
    finally { setLoading(false) }
  }

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/orders/${id}`, { status })
      setOrders(o => o.map(x => x._id === id ? { ...x, orderStatus: status } : x))
      toast.success("Status updated")
    } catch { toast.error("Failed to update") }
  }

  const displayed = filter ? orders.filter(o => o.orderStatus === filter) : orders

  if (loading) return <div className="page-loading"><div className="spinner" /></div>

  return (
    <div className="page">
      <div className="container">
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 30, marginBottom: 4 }}>Orders</h1>
          <p style={{ color: "var(--text-muted)" }}>{orders.length} total orders</p>
        </div>

        {/* Filter tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
          {["", ...STATUS_OPTIONS].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className="btn btn-sm"
              style={{
                background: filter === s ? "var(--text)" : "var(--bg-card)",
                color: filter === s ? "#fff" : "var(--text-muted)",
                border: `1.5px solid ${filter === s ? "var(--text)" : "var(--border)"}`,
                borderRadius: "var(--radius-full)"
              }}>
              {s || "All"} {s && <span style={{ marginLeft: 4, opacity: .7 }}>({orders.filter(o => o.orderStatus === s).length})</span>}
            </button>
          ))}
        </div>

        {/* Orders */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {displayed.map(order => {
            const cfg = STATUS_CONFIG[order.orderStatus] || STATUS_CONFIG["Order Placed"]
            const total = order.items.reduce((s, i) => s + i.price * i.quantity, 0)
            return (
              <div key={order._id} className="card">
                <div style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "14px 20px", borderBottom: "1px solid var(--border)", flexWrap: "wrap", gap: 10
                }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>#{order._id.slice(-8).toUpperCase()}</div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                      {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      <span style={{ margin: "0 6px" }}>·</span>{order.paymentMethod}
                      <span style={{ margin: "0 6px" }}>·</span>{order.items.length} item{order.items.length > 1 ? "s" : ""}
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                    <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 17 }}>₹{total}</span>
                    {/* Status select — value= bound so it reflects current status */}
                    <select
                      value={order.orderStatus}
                      onChange={e => updateStatus(order._id, e.target.value)}
                      style={{
                        fontFamily: "'DM Sans',sans-serif",
                        background: cfg.bg, color: cfg.color,
                        border: "none", borderRadius: "var(--radius-full)",
                        padding: "6px 12px", fontWeight: 600, fontSize: 13,
                        cursor: "pointer", outline: "none"
                      }}
                    >
                      {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                <div style={{ padding: "12px 20px" }}>
                  {order.items.map((item, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "var(--text-muted)", padding: "2px 0" }}>
                      <span>{item.title} × {item.quantity} <span style={{ opacity: .6 }}>({item.size})</span></span>
                      <span style={{ fontWeight: 600, color: "var(--text)" }}>₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                  {order.address && <div style={{ marginTop: 8, fontSize: 12, color: "var(--text-light)" }}>📍 {order.address}, {order.pincode}</div>}
                </div>
              </div>
            )
          })}
        </div>

        {displayed.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">📦</div>
            <h4>No orders found</h4>
          </div>
        )}
      </div>
    </div>
  )
}
