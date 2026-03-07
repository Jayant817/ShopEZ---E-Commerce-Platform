import { Link } from "react-router-dom"

const categories = [
  { icon: "📱", label: "Mobiles",     value: "mobiles",     bg: "#fef3c7" },
  { icon: "💻", label: "Electronics", value: "electronics", bg: "#ede9fe" },
  { icon: "👕", label: "Fashion",     value: "fashion",     bg: "#fce7f3" },
  { icon: "🏀", label: "Sports",      value: "sports",      bg: "#dcfce7" },
  { icon: "🛒", label: "Groceries",   value: "groceries",   bg: "#fff7ed" },
]

const features = [
  { icon: "🚚", title: "Free Shipping",    desc: "On orders above ₹999" },
  { icon: "🔒", title: "Secure Payments",  desc: "100% safe & encrypted" },
  { icon: "↩️", title: "Easy Returns",     desc: "7-day hassle-free returns" },
  { icon: "⭐", title: "Premium Quality",  desc: "Curated products only" },
]

export default function Home() {
  return (
    <div>

      {/* ── HERO ── */}
      <section style={{
        background: "linear-gradient(135deg, #0f0f0f 0%, #1c1917 50%, #0f0f0f 100%)",
        padding: "90px 0 80px", position: "relative", overflow: "hidden"
      }}>
        {/* Subtle grid overlay */}
        <div style={{
          position: "absolute", inset: 0, opacity: .04,
          backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
          backgroundSize: "40px 40px"
        }} />
        {/* Red glow */}
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%,-50%)",
          width: 600, height: 300, borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(224,45,45,.15) 0%, transparent 70%)",
          pointerEvents: "none"
        }} />

        <div className="container" style={{ position: "relative", textAlign: "center" }}>
          <div className="fade-up" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(224,45,45,.15)", border: "1px solid rgba(224,45,45,.3)",
            borderRadius: "var(--radius-full)", padding: "5px 16px 5px 6px", marginBottom: 28
          }}>
            <span style={{
              background: "var(--accent)", color: "#fff",
              borderRadius: "var(--radius-full)", fontSize: 12, fontWeight: 700,
              padding: "2px 8px"
            }}>NEW</span>
            <span style={{ color: "rgba(255,255,255,.7)", fontSize: 13 }}>Summer Sale — Up to 50% off</span>
          </div>

          <h1 className="fade-up fade-up-1" style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "clamp(40px, 7vw, 72px)",
            fontWeight: 800, color: "#fff",
            lineHeight: 1.08, marginBottom: 20,
            letterSpacing: "-.03em"
          }}>
            Shop Smarter,<br />
            <span style={{ color: "var(--accent)" }}>Live Better.</span>
          </h1>

          <p className="fade-up fade-up-2" style={{
            color: "rgba(255,255,255,.55)", fontSize: 18,
            maxWidth: 440, margin: "0 auto 36px", lineHeight: 1.6
          }}>
            Discover thousands of products across every category, delivered to your door.
          </p>

          <div className="fade-up fade-up-3" style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/products" className="btn btn-xl" style={{
              background: "var(--accent)",
              color: "#fff",
              boxShadow: "0 6px 24px rgba(224,45,45,.4)"
            }}>
              Shop Now →
            </Link>
            <Link to="/register" className="btn btn-xl" style={{
              background: "rgba(255,255,255,.08)",
              color: "#fff",
              border: "1px solid rgba(255,255,255,.15)"
            }}>
              Create Account
            </Link>
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section style={{ padding: "64px 0" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <p style={{ color: "var(--accent)", fontWeight: 600, fontSize: 13, letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 8 }}>Browse</p>
            <h2 style={{ fontSize: 32 }}>Shop by Category</h2>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: 16
          }}>
            {categories.map((cat, i) => (
              <Link
                key={cat.value}
                to={`/products?category=${cat.value}`}
                className="fade-up"
                style={{ animationDelay: `${i * .05}s` }}
              >
                <div style={{
                  background: cat.bg,
                  borderRadius: "var(--radius-lg)",
                  padding: "28px 20px",
                  textAlign: "center",
                  border: "1px solid transparent",
                  transition: "var(--transition-slow)",
                  cursor: "pointer"
                }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = "translateY(-4px)"
                    e.currentTarget.style.boxShadow = "var(--shadow)"
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = "translateY(0)"
                    e.currentTarget.style.boxShadow = "none"
                  }}
                >
                  <div style={{ fontSize: 38, marginBottom: 10 }}>{cat.icon}</div>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 15, color: "var(--text)" }}>
                    {cat.label}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROMO BANNER ── */}
      <section style={{
        background: "var(--accent)",
        padding: "56px 0",
        position: "relative",
        overflow: "hidden"
      }}>
        <div style={{
          position: "absolute", right: -40, top: -40,
          width: 260, height: 260, borderRadius: "50%",
          background: "rgba(255,255,255,.06)"
        }} />
        <div style={{
          position: "absolute", left: 60, bottom: -60,
          width: 200, height: 200, borderRadius: "50%",
          background: "rgba(0,0,0,.06)"
        }} />
        <div className="container" style={{ textAlign: "center", position: "relative" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🔥</div>
          <h2 style={{ color: "#fff", fontSize: 36, marginBottom: 10 }}>Mega Sale is Live!</h2>
          <p style={{ color: "rgba(255,255,255,.8)", fontSize: 17, marginBottom: 28 }}>
            Up to 50% OFF on Electronics & Fashion. Limited time only.
          </p>
          <Link to="/products" className="btn" style={{
            background: "#fff", color: "var(--accent)", fontFamily: "'Syne',sans-serif",
            fontWeight: 700, padding: "13px 32px", fontSize: 15,
            boxShadow: "0 4px 16px rgba(0,0,0,.15)"
          }}>
            Browse Deals
          </Link>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ padding: "72px 0", background: "var(--bg-subtle)" }}>
        <div className="container">
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 20
          }}>
            {features.map((f, i) => (
              <div key={i} className="card fade-up" style={{ animationDelay: `${i * .08}s`, border: "none" }}>
                <div className="card-body" style={{ textAlign: "center", padding: "32px 24px" }}>
                  <div style={{ fontSize: 36, marginBottom: 12 }}>{f.icon}</div>
                  <h5 style={{ fontSize: 17, marginBottom: 6 }}>{f.title}</h5>
                  <p style={{ color: "var(--text-muted)", fontSize: 14, margin: 0 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        background: "var(--bg-dark)",
        color: "rgba(255,255,255,.4)",
        textAlign: "center",
        padding: "28px 0",
        fontSize: 13
      }}>
        <div className="container">
          <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, color: "#fff", fontSize: 16 }}>ShopEZ</span>
          <span style={{ margin: "0 12px" }}>·</span>
          © {new Date().getFullYear()} All rights reserved.
        </div>
      </footer>
    </div>
  )
}
