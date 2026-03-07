import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import API from "../services/api"
import toast from "react-hot-toast"

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => { fetchProducts() }, [])

  const fetchProducts = async () => {
    try {
      const res = await API.get("/products")
      setProducts(res.data.data || [])
    } catch { toast.error("Failed to load products") }
    finally { setLoading(false) }
  }

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return
    try {
      await API.delete(`/products/${id}`)
      setProducts(p => p.filter(x => x._id !== id))
      toast.success("Product deleted")
    } catch { toast.error("Failed to delete") }
  }

  const updateProduct = async () => {
    try {
      await API.put(`/products/${selected._id}`, selected)
      toast.success("Product updated!")
      setSelected(null)
      fetchProducts()
    } catch { toast.error("Failed to update") }
  }

  const filtered = products.filter(p => !search || p.title?.toLowerCase().includes(search.toLowerCase()))

  if (loading) return <div className="page-loading"><div className="spinner" /></div>

  return (
    <div className="page">
      <div className="container">

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 30, marginBottom: 2 }}>Products</h1>
            <p style={{ color: "var(--text-muted)", fontSize: 14 }}>{products.length} products in catalogue</p>
          </div>
          <Link to="/admin/add-product" className="btn btn-primary">+ Add Product</Link>
        </div>

        {/* Search */}
        <div style={{ position: "relative", maxWidth: 340, marginBottom: 24 }}>
          <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}>🔍</span>
          <input className="form-control" placeholder="Search products..." value={search}
            onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 38 }} />
        </div>

        {/* Grid */}
        <div className="product-grid">
          {filtered.map(product => (
            <div key={product._id} className="card card-hover">
              <div style={{ position: "relative" }}>
                <img src={product.mainImg} alt={product.title}
                  style={{ width: "100%", height: 200, objectFit: "cover" }} />
                {product.discount > 0 && (
                  <span style={{
                    position: "absolute", top: 8, left: 8,
                    background: "var(--accent)", color: "#fff",
                    borderRadius: "var(--radius-full)", padding: "3px 10px",
                    fontSize: 12, fontWeight: 700
                  }}>{product.discount}% OFF</span>
                )}
              </div>
              <div style={{ padding: "14px 16px 16px" }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: ".06em" }}>
                  {product.category}
                </span>
                <h6 style={{ fontSize: 14, fontWeight: 600, margin: "4px 0 10px",
                  display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                  {product.title}
                </h6>
                <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 18, marginBottom: 12 }}>
                  {product.discount > 0
  ? <><span>₹{Math.round(product.price * (1 - product.discount / 100))}</span>{" "}
      <span style={{ fontSize: 13, textDecoration: "line-through", color: "var(--text-muted)" }}>₹{product.price}</span></>
  : <span>₹{product.price}</span>
}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="btn btn-warning-soft btn-sm" style={{ flex: 1 }} onClick={() => setSelected(product)}>
                    Edit
                  </button>
                  <button className="btn btn-danger btn-sm" style={{ flex: 1 }} onClick={() => deleteProduct(product._id)}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && !loading && (
          <div className="empty-state">
            <div className="empty-state-icon">🏷️</div>
            <h4>No products found</h4>
          </div>
        )}

        {/* Edit Modal */}
        {selected && (
          <div style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,.55)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 9999, padding: 16
          }} onClick={e => e.target === e.currentTarget && setSelected(null)}>
            <div className="card fade-up" style={{ width: "100%", maxWidth: 480, maxHeight: "90vh", overflowY: "auto", boxShadow: "var(--shadow-lg)" }}>
              <div style={{ padding: "20px 24px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h4 style={{ fontFamily: "'Syne',sans-serif" }}>Edit Product</h4>
                <button className="btn btn-ghost btn-sm" onClick={() => setSelected(null)} style={{ fontSize: 18 }}>✕</button>
              </div>
              <div style={{ padding: "20px 24px 24px" }}>
                {[
                  { label: "Title", field: "title", type: "text" },
                  { label: "Price (₹)", field: "price", type: "number" },
                  { label: "Discount (%)", field: "discount", type: "number" },
                  { label: "Image URL", field: "mainImg", type: "text" },
                ].map(f => (
                  <div className="form-group" key={f.field}>
                    <label>{f.label}</label>
                    <input type={f.type} className="form-control" value={selected[f.field] || ""}
                      onChange={e => setSelected({ ...selected, [f.field]: e.target.value })} />
                  </div>
                ))}
                <div className="form-group" style={{ marginBottom: 24 }}>
                  <label>Description</label>
                  <textarea className="form-control" rows={3} value={selected.description || ""}
                    onChange={e => setSelected({ ...selected, description: e.target.value })} />
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setSelected(null)}>Cancel</button>
                  <button className="btn btn-primary" style={{ flex: 1 }} onClick={updateProduct}>Save Changes</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
