import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import API from "../services/api"
import { useAuth } from "../context/AuthContext"
import toast from "react-hot-toast"

export default function Checkout() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(true)
  const [placing, setPlacing] = useState(false)
  const [form, setForm] = useState({ address: "", pincode: "", paymentMethod: "COD" })

  useEffect(() => {
    if (!user) { navigate("/login"); return }
    fetchCart()
  }, [])

  const fetchCart = async () => {
    try {
      const res = await API.get(`/cart/${user._id}`)
      const items = res.data.data || []
      setCart(items)
      // Redirect back to cart if nothing in it
      if (items.length === 0) {
        toast.error("Your cart is empty")
        navigate("/cart")
        return
      }
    } catch { toast.error("Failed to load cart") }
    finally { setLoading(false) }
  }

  const placeOrder = async (e) => {
    e.preventDefault()
    setPlacing(true)
    try {
      const items = cart.map(i => {
        const base = i.productId.price || 0
        const disc = i.productId.discount || 0
        const finalPrice = disc ? Math.round(base * (1 - disc / 100)) : base
        return {
          title: i.productId.title,
          price: finalPrice,
          quantity: i.quantity,
          size: i.size,
          image: i.productId.mainImg
        }
      })
      await API.post("/orders", { userId: user._id, items, ...form })
      await API.delete(`/cart/clear/${user._id}`)
      toast.success("Order placed! 🎉")
      navigate("/orders")
    } catch { toast.error("Failed to place order") }
    finally { setPlacing(false) }
  }

  const total = cart.reduce((s, i) => {
    const base = i.productId?.price || 0
    const disc = i.productId?.discount || 0
    return s + (disc ? Math.round(base * (1 - disc / 100)) : base) * (i.quantity || 1)
  }, 0)

  if (loading) return <div className="page-loading"><div className="spinner" /></div>

  return (
    <div className="page">
      <div className="container">
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h1 style={{ fontSize: 32, marginBottom: 32 }}>Checkout</h1>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 28, alignItems: "start" }}
            className="checkout-grid">

            {/* Form */}
            <form onSubmit={placeOrder}>
              <div className="card" style={{ marginBottom: 16 }}>
                <div className="card-body" style={{ padding: 24 }}>
                  <h5 style={{ marginBottom: 20, fontFamily: "'Syne',sans-serif", fontSize: 18 }}>
                    📍 Delivery Address
                  </h5>
                  <div className="form-group">
                    <label>Full Address</label>
                    <textarea className="form-control" rows={3}
                      placeholder="House no., Street, Area, City, State"
                      required value={form.address}
                      onChange={e => setForm({ ...form, address: e.target.value })} />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label>Pincode</label>
                    <input className="form-control" placeholder="6-digit pincode"
                      required maxLength={6} value={form.pincode}
                      onChange={e => setForm({ ...form, pincode: e.target.value })} />
                  </div>
                </div>
              </div>

              <div className="card" style={{ marginBottom: 24 }}>
                <div className="card-body" style={{ padding: 24 }}>
                  <h5 style={{ marginBottom: 20, fontFamily: "'Syne',sans-serif", fontSize: 18 }}>
                    💳 Payment Method
                  </h5>
                  {[
                    { val: "COD", label: "Cash on Delivery", icon: "💵", desc: "Pay when your order arrives" },
                    { val: "UPI", label: "UPI",              icon: "📱", desc: "PhonePe, GPay, Paytm etc." }
                  ].map(opt => (
                    <label key={opt.val} style={{
                      display: "flex", alignItems: "center", gap: 14,
                      padding: "14px 16px", borderRadius: "var(--radius)",
                      border: `2px solid ${form.paymentMethod === opt.val ? "var(--text)" : "var(--border)"}`,
                      cursor: "pointer", marginBottom: 10,
                      background: form.paymentMethod === opt.val ? "var(--bg-subtle)" : "transparent",
                      transition: "var(--transition)"
                    }}>
                      <input type="radio" name="payment" value={opt.val}
                        checked={form.paymentMethod === opt.val}
                        onChange={e => setForm({ ...form, paymentMethod: e.target.value })}
                        style={{ accentColor: "var(--accent)", width: 18, height: 18 }} />
                      <span style={{ fontSize: 22 }}>{opt.icon}</span>
                      <div>
                        <div style={{ fontWeight: 600 }}>{opt.label}</div>
                        <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{opt.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <button className="btn btn-primary btn-w100" disabled={placing} style={{ padding: "15px", fontSize: 16 }}>
                {placing
                  ? <><span className="spinner-sm" style={{ borderColor: "rgba(255,255,255,.3)", borderTopColor: "#fff" }} /> &nbsp;Placing order...</>
                  : `Place Order · ₹${total}`}
              </button>
            </form>

            {/* Summary */}
            <div style={{ position: "sticky", top: 80 }}>
              <div className="card">
                <div className="card-body" style={{ padding: 20 }}>
                  <h5 style={{ marginBottom: 16, fontFamily: "'Syne',sans-serif" }}>Order Items</h5>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {cart.map(item => {
                      const base = item.productId?.price || 0
                      const disc = item.productId?.discount || 0
                      const price = (disc ? Math.round(base * (1 - disc / 100)) : base) * item.quantity
                      return (
                        <div key={item._id} style={{ display: "flex", gap: 10, alignItems: "center" }}>
                          <img src={item.productId?.mainImg} alt=""
                            style={{ width: 50, height: 60, objectFit: "cover", borderRadius: "var(--radius-sm)", flexShrink: 0 }} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {item.productId?.title}
                            </div>
                            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Qty {item.quantity} · {item.size}</div>
                          </div>
                          <span style={{ fontSize: 14, fontWeight: 700, flexShrink: 0 }}>₹{price}</span>
                        </div>
                      )
                    })}
                  </div>
                  <hr className="divider" />
                  <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 18 }}>
                    <span>Total</span><span>₹{total}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .checkout-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}