import { useState } from "react"
import { Link } from "react-router-dom"
import API from "../services/api"
import { useAuth } from "../context/AuthContext"
import toast from "react-hot-toast"

export default function ProductCard({ product }) {
  const { user } = useAuth()
  const [adding, setAdding] = useState(false)
  const [hovered, setHovered] = useState(false)

  const discountedPrice = product.discount
    ? Math.round(product.price * (1 - product.discount / 100))
    : null

  const addToCart = async (e) => {
    e.preventDefault() // don't navigate
    if (!user) { toast.error("Please login to add items to cart"); return }
    setAdding(true)
    try {
      const defaultSize = product.sizes?.length ? product.sizes[0] : "Free Size"
await API.post("/cart", { userId: user._id, productId: product._id, quantity: 1, size: defaultSize })
      toast.success("Added to cart!")
    } catch { toast.error("Failed to add to cart") }
    finally { setAdding(false) }
  }

  return (
    <Link to={`/products/${product._id}`} style={{ textDecoration: "none", display: "block" }}>
      <div
        className="card card-hover"
        style={{ height: "100%", cursor: "pointer" }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Image */}
        <div style={{ position: "relative", overflow: "hidden", background: "var(--bg-subtle)" }}>
          <img
            src={product.mainImg || "https://via.placeholder.com/400x500?text=No+Image"}
            alt={product.title}
            style={{ width: "100%", height: 260, objectFit: "cover", transition: "transform .4s ease",
              transform: hovered ? "scale(1.04)" : "scale(1)" }}
          />
          {/* Discount badge */}
          {product.discount > 0 && (
            <div style={{
              position: "absolute", top: 10, left: 10,
              background: "var(--accent)", color: "#fff",
              borderRadius: "var(--radius-full)", padding: "3px 10px",
              fontSize: 12, fontWeight: 700
            }}>{product.discount}% OFF</div>
          )}
          {/* Quick add — fades in on hover */}
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            background: "linear-gradient(transparent, rgba(0,0,0,.7))",
            padding: "32px 14px 14px",
            opacity: hovered ? 1 : 0,
            transform: hovered ? "translateY(0)" : "translateY(8px)",
            transition: "var(--transition-slow)"
          }}>
            <button
              className="btn btn-w100"
              onClick={addToCart}
              disabled={adding}
              style={{ background: "#fff", color: "var(--text)", fontSize: 13, fontWeight: 600, padding: "9px" }}
            >
              {adding ? "Adding..." : "🛒 Quick Add"}
            </button>
          </div>
        </div>

        {/* Info */}
        <div style={{ padding: "14px 16px 18px" }}>
          {product.category && (
            <span style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)",
              textTransform: "uppercase", letterSpacing: ".06em" }}>
              {product.category}
            </span>
          )}
          <h6 style={{
            fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: 15,
            margin: "4px 0 10px", color: "var(--text)",
            display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden"
          }}>{product.title}</h6>

          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 18, color: "var(--text)" }}>
              ₹{discountedPrice ?? product.price}
            </span>
            {discountedPrice && (
              <span style={{ fontSize: 13, color: "var(--text-light)", textDecoration: "line-through" }}>
                ₹{product.price}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
