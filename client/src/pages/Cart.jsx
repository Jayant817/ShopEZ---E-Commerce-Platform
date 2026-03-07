import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import API from "../services/api"
import { useAuth } from "../context/AuthContext"
import toast from "react-hot-toast"

export default function Cart() {
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => { if (user) fetchCart() }, [])

  const fetchCart = async () => {
    try {
      const res = await API.get(`/cart/${user._id}`)
      setCart(res.data.data || [])
    } catch { toast.error("Failed to load cart") }
    finally { setLoading(false) }
  }

  const removeItem = async (id) => {
    try {
      await API.delete(`/cart/${id}`)
      setCart(c => c.filter(i => i._id !== id))
      toast.success("Removed from cart")
    } catch { toast.error("Failed to remove item") }
  }

  const updateQty = async (item, newQty) => {
    if (newQty < 1) return
    try {
      await API.put(`/cart/${item._id}`, { quantity: newQty })
      setCart(c => c.map(i => i._id === item._id ? { ...i, quantity: newQty } : i))
    } catch { toast.error("Failed to update quantity") }
  }

  const getPrice = (item) => {
    const base = item.productId?.price || 0
    const disc = item.productId?.discount || 0
    return disc ? Math.round(base * (1 - disc / 100)) : base
  }

  const total = cart.reduce((s, i) => {
  const base = i.productId?.price || 0
  const disc = i.productId?.discount || 0
  return s + (disc ? Math.round(base * (1 - disc / 100)) : base) * (i.quantity || 1)
}, 0)
  const savings = cart.reduce((s, i) => {
    const base = i.productId?.price || 0
    const disc = i.productId?.discount || 0
    if (!disc) return s
    return s + (base - Math.round(base * (1 - disc / 100))) * i.quantity
  }, 0)

  if (loading) return <div className="page-loading"><div className="spinner" /><span>Loading cart...</span></div>

  return (
    <div className="page">
      <div className="container">
        <div className="section-header">
          <h1 style={{ fontSize: 32 }}>Your Cart <span style={{ color: "var(--text-muted)", fontWeight: 400, fontSize: 22 }}>({cart.length})</span></h1>
        </div>

        {cart.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🛒</div>
            <h4>Your cart is empty</h4>
            <p>Looks like you haven't added anything yet.</p>
            <Link to="/products" className="btn btn-primary" style={{ marginTop: 8 }}>Browse Products</Link>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 28, alignItems: "start" }}
            className="cart-layout">

            {/* Items */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {cart.map(item => {
                const finalPrice = getPrice(item)
                const hasDiscount = item.productId?.discount > 0
                return (
                  <div key={item._id} className="card">
                    <div style={{ display: "flex", gap: 16, padding: 16 }}>
                      <Link to={`/products/${item.productId?._id}`}>
                        <img
                          src={item.productId?.mainImg}
                          alt={item.productId?.title}
                          style={{ width: 100, height: 120, objectFit: "cover", borderRadius: "var(--radius-sm)", flexShrink: 0 }}
                        />
                      </Link>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <Link to={`/products/${item.productId?._id}`} style={{ color: "var(--text)" }}>
                          <h6 style={{ fontSize: 15, marginBottom: 4, fontFamily: "'DM Sans',sans-serif", fontWeight: 600 }}>{item.productId?.title}</h6>
                        </Link>
                        <span style={{ fontSize: 13, color: "var(--text-muted)" }}>Size: {item.size}</span>

                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12, flexWrap: "wrap", gap: 8 }}>
                          {/* Price */}
                          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                            <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 19 }}>
                              ₹{finalPrice * item.quantity}
                            </span>
                            {hasDiscount && (
                              <span style={{ fontSize: 13, color: "var(--text-light)", textDecoration: "line-through" }}>
                                ₹{item.productId.price * item.quantity}
                              </span>
                            )}
                          </div>

                          {/* Qty + Remove */}
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            {/* Quantity adjuster */}
                            <div style={{
                              display: "flex", alignItems: "center",
                              border: "1.5px solid var(--border)", borderRadius: "var(--radius-sm)",
                              overflow: "hidden"
                            }}>
                              <button
                                onClick={() => updateQty(item, item.quantity - 1)}
                                style={{ width: 32, height: 32, background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "var(--text)", display: "flex", alignItems: "center", justifyContent: "center" }}
                              >−</button>
                              <span style={{ width: 32, textAlign: "center", fontWeight: 700, fontSize: 14, borderLeft: "1px solid var(--border)", borderRight: "1px solid var(--border)", height: 32, lineHeight: "32px" }}>{item.quantity}</span>
                              <button
                                onClick={() => updateQty(item, item.quantity + 1)}
                                style={{ width: 32, height: 32, background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "var(--text)", display: "flex", alignItems: "center", justifyContent: "center" }}
                              >+</button>
                            </div>
                            <button className="btn btn-danger btn-sm" onClick={() => removeItem(item._id)}>Remove</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Summary */}
            <div style={{ position: "sticky", top: 80 }}>
              <div className="card" style={{ boxShadow: "var(--shadow)" }}>
                <div className="card-body" style={{ padding: 24 }}>
                  <h5 style={{ marginBottom: 20, fontFamily: "'Syne',sans-serif" }}>Order Summary</h5>

                  <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 }}>
                    {[
                      ["Items (" + cart.length + ")", "₹" + total],
                      ...(savings > 0 ? [["You save", "−₹" + savings]] : []),
                      ["Delivery", "Free"],
                    ].map(([k, v]) => (
                      <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "var(--text-muted)" }}>
                        <span>{k}</span>
                        <span style={{ color: k === "You save" ? "var(--success)" : "inherit", fontWeight: k === "You save" ? 600 : 400 }}>{v}</span>
                      </div>
                    ))}
                  </div>

                  <hr className="divider" />

                  <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 20, marginBottom: 20 }}>
                    <span>Total</span>
                    <span>₹{total}</span>
                  </div>

                  <button className="btn btn-primary btn-w100" style={{ padding: "14px", fontSize: 15 }}
                    onClick={() => navigate("/checkout")}>
                    Proceed to Checkout
                  </button>

                  <Link to="/products" style={{ display: "block", textAlign: "center", marginTop: 14, fontSize: 13, color: "var(--text-muted)" }}>
                    ← Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .cart-layout { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}