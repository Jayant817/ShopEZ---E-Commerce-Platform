import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import API from "../services/api"
import toast from "react-hot-toast"

export default function AddProduct() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ title: "", description: "", mainImg: "", price: "", discount: "", category: "" })
  const u = (f, v) => setForm(p => ({ ...p, [f]: v }))

  const submit = async (e) => {
    e.preventDefault()
    if (!form.title || !form.price || !form.category) { toast.error("Title, price and category are required"); return }
    setLoading(true)
    try {
      await API.post("/products", { ...form, price: Number(form.price), discount: form.discount ? Number(form.discount) : 0 })
      toast.success("Product added!")
      navigate("/admin/products")
    } catch (err) { toast.error(err.response?.data?.message || "Failed to add product") }
    finally { setLoading(false) }
  }

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 660 }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <Link to="/admin/products" style={{ fontSize: 13, color: "var(--text-muted)", display: "inline-flex", alignItems: "center", gap: 4, marginBottom: 12 }}>
            ← Back to Products
          </Link>
          <h1 style={{ fontSize: 30 }}>Add New Product</h1>
        </div>

        <form onSubmit={submit}>
          <div className="card">
            <div className="card-body" style={{ padding: 28 }}>
              <h5 style={{ fontFamily: "'Syne',sans-serif", marginBottom: 20 }}>Basic Information</h5>

              <div className="form-group">
                <label>Product Title *</label>
                <input className="form-control" placeholder="e.g. Nike Air Max 270" required value={form.title}
                  onChange={e => u("title", e.target.value)} />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea className="form-control" rows={4} placeholder="Describe the product..."
                  value={form.description} onChange={e => u("description", e.target.value)} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div className="form-group">
                  <label>Price (₹) *</label>
                  <input type="number" className="form-control" placeholder="999" min="0" required
                    value={form.price} onChange={e => u("price", e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Discount (%)</label>
                  <input type="number" className="form-control" placeholder="0" min="0" max="100"
                    value={form.discount} onChange={e => u("discount", e.target.value)} />
                </div>
              </div>

              <div className="form-group">
                <label>Category *</label>
                <select className="form-select" required value={form.category} onChange={e => u("category", e.target.value)}>
                  <option value="">Select a category</option>
                  <option value="fashion">Fashion</option>
                  <option value="electronics">Electronics</option>
                  <option value="mobiles">Mobiles</option>
                  <option value="sports">Sports</option>
                  <option value="groceries">Groceries</option>
                </select>
              </div>
            </div>
          </div>

          <div className="card" style={{ marginTop: 16 }}>
            <div className="card-body" style={{ padding: 28 }}>
              <h5 style={{ fontFamily: "'Syne',sans-serif", marginBottom: 20 }}>Product Image</h5>
              <div className="form-group" style={{ marginBottom: form.mainImg ? 16 : 0 }}>
                <label>Image URL</label>
                <input className="form-control" placeholder="https://example.com/image.jpg"
                  value={form.mainImg} onChange={e => u("mainImg", e.target.value)} />
              </div>
              {form.mainImg && (
                <div style={{ borderRadius: "var(--radius)", overflow: "hidden", border: "1px solid var(--border)", maxHeight: 240 }}>
                  <img src={form.mainImg} alt="preview" style={{ width: "100%", height: 200, objectFit: "cover" }} />
                </div>
              )}
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
            <Link to="/admin/products" className="btn btn-outline" style={{ flex: 1, justifyContent: "center", padding: "13px" }}>Cancel</Link>
            <button className="btn btn-primary" style={{ flex: 2, padding: "13px" }} disabled={loading}>
              {loading ? <><span className="spinner-sm" style={{ borderColor: "rgba(255,255,255,.3)", borderTopColor: "#fff" }} /> &nbsp;Adding...</> : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
