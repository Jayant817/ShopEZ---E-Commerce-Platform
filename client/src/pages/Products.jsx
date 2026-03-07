import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import API from "../services/api"
import ProductCard from "../components/ProductCard"

const CATEGORIES = [
  { label: "All", value: "" },
  { label: "Fashion", value: "fashion" },
  { label: "Electronics", value: "electronics" },
  { label: "Mobiles", value: "mobiles" },
  { label: "Sports", value: "sports" },
  { label: "Groceries", value: "groceries" },
]

export default function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [searchParams, setSearchParams] = useSearchParams()
  const category = searchParams.get("category") || ""

  useEffect(() => { fetchProducts() }, [category])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const url = category ? `/products?category=${category}` : "/products"
      const res = await API.get(url)
      setProducts(Array.isArray(res.data.data) ? res.data.data : [])
    } catch { setProducts([]) }
    finally { setLoading(false) }
  }

  const filtered = products.filter(p =>
    !search || p.title?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="page">
      <div className="container">

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 34, marginBottom: 6 }}>
            {category ? `${CATEGORIES.find(c => c.value === category)?.label || category}` : "All Products"}
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: 15 }}>
            {loading ? "Loading..." : `${filtered.length} product${filtered.length !== 1 ? "s" : ""} found`}
          </p>
        </div>

        {/* Filters row */}
        <div style={{ display: "flex", gap: 12, marginBottom: 32, flexWrap: "wrap", alignItems: "center" }}>
          {/* Search */}
          <div style={{ flex: 1, minWidth: 200, maxWidth: 340, position: "relative" }}>
            <span style={{
              position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
              color: "var(--text-muted)", fontSize: 16
            }}>🔍</span>
            <input
              className="form-control"
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ paddingLeft: 38 }}
            />
          </div>

          {/* Category pills */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {CATEGORIES.map(cat => (
              <button key={cat.value} onClick={() => setSearchParams(cat.value ? { category: cat.value } : {})}
                className="btn btn-sm"
                style={{
                  background: category === cat.value ? "var(--text)" : "var(--bg-card)",
                  color: category === cat.value ? "#fff" : "var(--text-muted)",
                  border: `1.5px solid ${category === cat.value ? "var(--text)" : "var(--border)"}`,
                  borderRadius: "var(--radius-full)"
                }}>
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))",
            gap: 20
          }}>
            {[...Array(8)].map((_, i) => (
              <div key={i}>
                <div className="skeleton" style={{ height: 260, borderRadius: "var(--radius)" }} />
                <div style={{ padding: "14px 4px" }}>
                  <div className="skeleton" style={{ height: 12, width: "40%", marginBottom: 8 }} />
                  <div className="skeleton" style={{ height: 16, marginBottom: 8 }} />
                  <div className="skeleton" style={{ height: 20, width: "30%" }} />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <h4>No products found</h4>
            <p>Try adjusting your search or category filter.</p>
          </div>
        ) : (
          <div className="product-grid">
            {filtered.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

      </div>
    </div>
  )
}
