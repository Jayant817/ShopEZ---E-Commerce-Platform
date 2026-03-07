import { useEffect, useState } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import API from "../services/api"
import { useAuth } from "../context/AuthContext"
import toast from "react-hot-toast"

export default function ProductDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedSize, setSelectedSize] = useState("")
  const [qty, setQty] = useState(1)
  const [adding, setAdding] = useState(false)
  const [imgIdx, setImgIdx] = useState(0)

  useEffect(() => {
    fetchProduct()
    window.scrollTo(0, 0)
  }, [id])

  const fetchProduct = async () => {
    setLoading(true)
    try {
      const res = await API.get(`/products/${id}`)
      const p = res.data.data
      setProduct(p)
      // Set default size if sizes exist
      if (p.sizes?.length) setSelectedSize(p.sizes[0])
    } catch {
      toast.error("Product not found")
      navigate("/products")
    } finally { setLoading(false) }
  }

  const addToCart = async () => {
    if (!user) { toast.error("Please login first"); navigate("/login"); return }
    if (product.sizes?.length && !selectedSize) { toast.error("Please select a size"); return }
    setAdding(true)
    try {
      await API.post("/cart", {
        userId: user._id, productId: product._id,
        quantity: qty, size: selectedSize || "Free Size"
      })
      toast.success(`${product.title} added to cart!`)
    } catch { toast.error("Failed to add to cart") }
    finally { setAdding(false) }
  }

  const discountedPrice = product?.discount
    ? Math.round(product.price * (1 - product.discount / 100))
    : null

  const allImages = product ? [product.mainImg, ...(product.carousel || [])].filter(Boolean) : []

  if (loading) return (
    <div className="page-loading">
      <div className="spinner" />
      <span>Loading product...</span>
    </div>
  )

  if (!product) return null

  return (
    <div className="page">
      <div className="container">

        {/* Breadcrumb */}
        <nav style={{ marginBottom: 28, fontSize: 13, color: "var(--text-muted)", display: "flex", gap: 8, alignItems: "center" }}>
          <Link to="/products" style={{ color: "var(--text-muted)" }}>Products</Link>
          <span>/</span>
          {product.category && <><Link to={`/products?category=${product.category}`} style={{ color: "var(--text-muted)", textTransform: "capitalize" }}>{product.category}</Link><span>/</span></>}
          <span style={{ color: "var(--text)" }}>{product.title}</span>
        </nav>

        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 52,
          alignItems: "start"
        }}
          className="product-detail-grid"
        >

          {/* ── LEFT: Images ── */}
          <div>
            {/* Main image */}
            <div style={{
              borderRadius: "var(--radius-lg)", overflow: "hidden",
              background: "var(--bg-subtle)", marginBottom: 12,
              border: "1px solid var(--border)"
            }}>
              <img
                src={allImages[imgIdx] || "https://via.placeholder.com/600?text=No+Image"}
                alt={product.title}
                style={{ width: "100%", aspectRatio: "3/4", objectFit: "cover", display: "block" }}
              />
            </div>

            {/* Thumbnail strip */}
            {allImages.length > 1 && (
              <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
                {allImages.map((img, i) => (
                  <div key={i} onClick={() => setImgIdx(i)} style={{
                    width: 72, height: 88, borderRadius: "var(--radius-sm)",
                    overflow: "hidden", flexShrink: 0, cursor: "pointer",
                    border: `2px solid ${i === imgIdx ? "var(--accent)" : "var(--border)"}`,
                    transition: "var(--transition)"
                  }}>
                    <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── RIGHT: Info ── */}
          <div className="fade-up">
            {product.category && (
              <span style={{
                fontSize: 12, fontWeight: 700, color: "var(--text-muted)",
                textTransform: "uppercase", letterSpacing: ".08em"
              }}>{product.category}</span>
            )}

            <h1 style={{ fontSize: 28, marginTop: 6, marginBottom: 16, lineHeight: 1.3 }}>
              {product.title}
            </h1>

            {/* Price block */}
            <div style={{
              display: "flex", alignItems: "baseline", gap: 12,
              marginBottom: 20, flexWrap: "wrap"
            }}>
              <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 34 }}>
                ₹{discountedPrice ?? product.price}
              </span>
              {discountedPrice && (
                <>
                  <span style={{ fontSize: 18, color: "var(--text-light)", textDecoration: "line-through" }}>
                    ₹{product.price}
                  </span>
                  <span style={{
                    background: "var(--accent-soft)", color: "var(--accent)",
                    padding: "3px 10px", borderRadius: "var(--radius-full)",
                    fontSize: 13, fontWeight: 700
                  }}>{product.discount}% OFF</span>
                </>
              )}
            </div>

            <hr className="divider" />

            {/* Sizes */}
            {product.sizes?.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10, textTransform: "uppercase", letterSpacing: ".06em" }}>
                  Select Size
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {product.sizes.map(size => (
                    <button key={size} onClick={() => setSelectedSize(size)} style={{
                      width: 48, height: 48, borderRadius: "var(--radius-sm)",
                      border: `2px solid ${selectedSize === size ? "var(--text)" : "var(--border)"}`,
                      background: selectedSize === size ? "var(--text)" : "transparent",
                      color: selectedSize === size ? "#fff" : "var(--text)",
                      fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: 14,
                      cursor: "pointer", transition: "var(--transition)"
                    }}>{size}</button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10, textTransform: "uppercase", letterSpacing: ".06em" }}>
                Quantity
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 0, border: "1.5px solid var(--border)", borderRadius: "var(--radius-sm)", width: "fit-content" }}>
                <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{
                  width: 40, height: 40, background: "none", border: "none",
                  cursor: "pointer", fontSize: 18, color: "var(--text)"
                }}>−</button>
                <span style={{ width: 40, textAlign: "center", fontWeight: 700, fontSize: 16 }}>{qty}</span>
                <button onClick={() => setQty(q => q + 1)} style={{
                  width: 40, height: 40, background: "none", border: "none",
                  cursor: "pointer", fontSize: 18, color: "var(--text)"
                }}>+</button>
              </div>
            </div>

            {/* CTA Buttons */}
            <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
              <button
                className="btn btn-primary"
                onClick={addToCart}
                disabled={adding}
                style={{ flex: 1, padding: "14px", fontSize: 15 }}
              >
                {adding ? "Adding..." : "🛒 Add to Cart"}
              </button>
              <button
                className="btn btn-dark"
                onClick={async () => {
  if (!user) { toast.error("Please login first"); navigate("/login"); return }
  setAdding(true)
  try {
    await API.post("/cart", {
      userId: user._id, productId: product._id,
      quantity: qty, size: selectedSize || "Free Size"
    })
    navigate("/checkout")
  } catch { toast.error("Failed to add to cart") }
  finally { setAdding(false) }
}}
                style={{ flex: 1, padding: "14px", fontSize: 15 }}
              >Buy Now</button>
            </div>

            {/* Trust badges */}
            <div style={{
              display: "flex", gap: 16, background: "var(--bg-subtle)",
              borderRadius: "var(--radius)", padding: "14px 16px",
              flexWrap: "wrap"
            }}>
              {["🚚 Free Delivery", "↩️ Easy Returns", "🔒 Secure"].map(badge => (
                <span key={badge} style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 500 }}>{badge}</span>
              ))}
            </div>

            {/* Description */}
            {product.description && (
              <div style={{ marginTop: 28 }}>
                <h5 style={{ fontSize: 15, marginBottom: 10 }}>About this product</h5>
                <p style={{ color: "var(--text-muted)", fontSize: 15, lineHeight: 1.7 }}>
                  {product.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .product-detail-grid { grid-template-columns: 1fr !important; gap: 28px !important; }
        }
      `}</style>
    </div>
  )
}
