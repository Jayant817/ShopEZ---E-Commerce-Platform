/**
 * ShopEZ — Product Seed Script
 * Run: node seed.js
 * Seeds 40 products across 5 categories with real Unsplash images
 */

import mongoose from "mongoose"
import dotenv from "dotenv"
import Product from "./models/Product.js"

dotenv.config()

const products = [

  // ─── FASHION (12) ───────────────────────────────────────────────────────────
  {
    title: "Classic White Oversized T-Shirt",
    description: "A wardrobe staple. 100% cotton, pre-shrunk, with a relaxed boxy fit that pairs with anything. Available in multiple sizes.",
    mainImg: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600&q=80",
    category: "fashion",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    price: 599,
    discount: 20,
  },
  {
    title: "Slim Fit Chino Trousers — Beige",
    description: "Smart casual chinos crafted from stretch-cotton twill. Perfect for office days or weekend outings.",
    mainImg: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80",
    category: "fashion",
    sizes: ["28", "30", "32", "34", "36"],
    price: 1299,
    discount: 15,
  },
  {
    title: "Premium Denim Jacket — Washed Blue",
    description: "Classic denim jacket with a modern slim silhouette. Washed for a vintage look. Timeless piece for every season.",
    mainImg: "https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=600&q=80",
    category: "fashion",
    sizes: ["S", "M", "L", "XL"],
    price: 2499,
    discount: 25,
  },
  {
    title: "Floral Wrap Midi Dress",
    description: "Elegant wrap-style midi dress with a vibrant floral print. Lightweight fabric, flattering silhouette, perfect for occasions.",
    mainImg: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&q=80",
    category: "fashion",
    sizes: ["XS", "S", "M", "L"],
    price: 1899,
    discount: 10,
  },
  {
    title: "Leather Crossbody Bag — Tan",
    description: "Full-grain leather crossbody with adjustable strap, interior zip pocket, and antique brass hardware. Built to last.",
    mainImg: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80",
    category: "fashion",
    sizes: ["Free Size"],
    price: 3299,
    discount: 0,
  },
  {
    title: "Striped Linen Shirt — Navy",
    description: "Breathable linen shirt with classic navy stripes. Button-down collar, chest pocket, relaxed fit. Summer essential.",
    mainImg: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80",
    category: "fashion",
    sizes: ["S", "M", "L", "XL", "XXL"],
    price: 999,
    discount: 0,
  },
  {
    title: "High-Waist Jogger Pants — Olive",
    description: "Comfortable high-waist joggers in olive green. Tapered fit, elastic waistband with drawstring, side pockets. Casual perfection.",
    mainImg: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=600&q=80",
    category: "fashion",
    sizes: ["XS", "S", "M", "L", "XL"],
    price: 1499,
    discount: 30,
  },
  {
    title: "Wool Blend Overcoat — Camel",
    description: "Luxurious wool-blend overcoat in timeless camel. Double-breasted, notched lapels, fully lined. The ultimate winter statement.",
    mainImg: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600&q=80",
    category: "fashion",
    sizes: ["S", "M", "L", "XL"],
    price: 5999,
    discount: 20,
  },
  {
    title: "Graphic Print Hoodie — Black",
    description: "Heavy-weight 380gsm fleece hoodie with bold graphic print. Kangaroo pocket, adjustable hood. Streetwear essential.",
    mainImg: "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&q=80",
    category: "fashion",
    sizes: ["S", "M", "L", "XL", "XXL"],
    price: 1799,
    discount: 15,
  },
  {
    title: "Silk Blend Scarf — Multicolour",
    description: "Luxe silk-blend scarf with a vibrant abstract print. Wear as a headscarf, necktie, or bag accessory. 90x90cm.",
    mainImg: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600&q=80",
    category: "fashion",
    sizes: ["Free Size"],
    price: 799,
    discount: 0,
  },
  {
    title: "Chelsea Boots — Black Leather",
    description: "Classic Chelsea boots in full-grain black leather. Elastic side panels, leather sole, 3cm stacked heel. Handcrafted.",
    mainImg: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=600&q=80",
    category: "fashion",
    sizes: ["6", "7", "8", "9", "10", "11"],
    price: 4499,
    discount: 10,
  },
  {
    title: "Ribbed Knit Turtleneck — Cream",
    description: "Soft ribbed-knit turtleneck in warm cream. Slim fit, mid-weight yarn, pairs perfectly with tailored trousers or jeans.",
    mainImg: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&q=80",
    category: "fashion",
    sizes: ["XS", "S", "M", "L", "XL"],
    price: 1599,
    discount: 20,
  },

  // ─── ELECTRONICS (10) ────────────────────────────────────────────────────────
  {
    title: "Noise-Cancelling Wireless Headphones",
    description: "40-hour battery life, hybrid active noise cancellation, premium 40mm drivers. Foldable design with carrying case included.",
    mainImg: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",
    category: "electronics",
    sizes: ["Free Size"],
    price: 7999,
    discount: 25,
  },
  {
    title: "Mechanical Gaming Keyboard — RGB",
    description: "TKL layout, Cherry MX Red switches, per-key RGB lighting, aircraft-grade aluminium frame. N-key rollover, anti-ghosting.",
    mainImg: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&q=80",
    category: "electronics",
    sizes: ["Free Size"],
    price: 5499,
    discount: 15,
  },
  {
    title: "4K Webcam with Ring Light",
    description: "4K30fps / 1080p60fps, built-in dual microphone with noise reduction, privacy cover, adjustable ring light. Plug & play.",
    mainImg: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=600&q=80",
    category: "electronics",
    sizes: ["Free Size"],
    price: 3299,
    discount: 20,
  },
  {
    title: "Portable Bluetooth Speaker — IPX7",
    description: "360° surround sound, 24-hour playtime, IPX7 waterproof, USB-C charging, built-in microphone. Take the party anywhere.",
    mainImg: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80",
    category: "electronics",
    sizes: ["Free Size"],
    price: 2999,
    discount: 10,
  },
  {
    title: "Smart LED Desk Lamp with Wireless Charger",
    description: "5 colour temps, 10 brightness levels, built-in 15W wireless charger, USB-A port, touch controls, auto dim mode.",
    mainImg: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&q=80",
    category: "electronics",
    sizes: ["Free Size"],
    price: 1899,
    discount: 0,
  },
  {
    title: "Ultra-Slim Laptop Stand — Aluminium",
    description: "Adjustable ergonomic stand, holds up to 20kg, foldable to 3mm, compatible with all 10–17\" laptops. Silver aluminium.",
    mainImg: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80",
    category: "electronics",
    sizes: ["Free Size"],
    price: 1299,
    discount: 0,
  },
  {
    title: "True Wireless Earbuds — Active ANC",
    description: "6mm custom drivers, 32hr total playtime, active noise cancellation, IPX4 sweat resistance, wireless charging case.",
    mainImg: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&q=80",
    category: "electronics",
    sizes: ["Free Size"],
    price: 4999,
    discount: 30,
  },
  {
    title: "27\" QHD IPS Monitor — 165Hz",
    description: "2560×1440 IPS panel, 165Hz refresh, 1ms MPRT, HDR400, sRGB 99%, USB-C 65W PD, height-adjustable stand.",
    mainImg: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&q=80",
    category: "electronics",
    sizes: ["Free Size"],
    price: 28999,
    discount: 12,
  },
  {
    title: "Ergonomic Wireless Mouse",
    description: "Vertical ergonomic design, 4000 DPI, tri-mode connectivity (BT 5.0 / 2.4GHz / USB-C), 70-day battery, silent clicks.",
    mainImg: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&q=80",
    category: "electronics",
    sizes: ["Free Size"],
    price: 2299,
    discount: 0,
  },
  {
    title: "Smart Home Security Camera — 2K",
    description: "2K QHD, 360° pan & tilt, AI person/pet detection, two-way audio, night vision, works with Alexa & Google Home.",
    mainImg: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=600&q=80",
    category: "electronics",
    sizes: ["Free Size"],
    price: 3499,
    discount: 20,
  },

  // ─── MOBILES (8) ─────────────────────────────────────────────────────────────
  {
    title: "ShopEZ Pro Max Smartphone — 256GB",
    description: "6.7\" AMOLED 120Hz, 50MP triple camera, 5000mAh battery, 67W fast charge, IP68, under-display fingerprint sensor.",
    mainImg: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80",
    category: "mobiles",
    sizes: ["Free Size"],
    price: 54999,
    discount: 8,
  },
  {
    title: "Budget 5G Phone — 128GB",
    description: "6.5\" IPS 90Hz display, 5G capable, 48MP rear + 8MP front, 5000mAh, 18W charging. Great value for everyday use.",
    mainImg: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600&q=80",
    category: "mobiles",
    sizes: ["Free Size"],
    price: 14999,
    discount: 15,
  },
  {
    title: "Premium Silicone Phone Case — Clear",
    description: "Military-grade drop protection, precise cutouts, anti-yellowing clear silicone, raised bezels. Fits all major models.",
    mainImg: "https://images.unsplash.com/photo-1601972599720-36938d4ecd31?w=600&q=80",
    category: "mobiles",
    sizes: ["Free Size"],
    price: 399,
    discount: 0,
  },
  {
    title: "65W GaN USB-C Charger",
    description: "3-port GaN charger (2×USB-C + 1×USB-A), 65W total output, universal compatibility, safety certified, compact fold-flat plug.",
    mainImg: "https://images.unsplash.com/photo-1610465299996-30f240ac2b1c?w=600&q=80",
    category: "mobiles",
    sizes: ["Free Size"],
    price: 1299,
    discount: 10,
  },
  {
    title: "MagSafe-Compatible Wireless Charger — 15W",
    description: "15W max wireless charging pad, works with MagSafe & Qi devices, LED indicator, braided USB-C cable included.",
    mainImg: "https://images.unsplash.com/photo-1586816879360-004f5b0c51e3?w=600&q=80",
    category: "mobiles",
    sizes: ["Free Size"],
    price: 1599,
    discount: 20,
  },
  {
    title: "Tempered Glass Screen Protector — 3-Pack",
    description: "9H hardness, oleophobic coating, bubble-free installation frame included. 99.9% clarity. Universal fit across major brands.",
    mainImg: "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600&q=80",
    category: "mobiles",
    sizes: ["Free Size"],
    price: 299,
    discount: 0,
  },
  {
    title: "Foldable Phone Stand & Grip — Ring Holder",
    description: "360° rotatable ring holder with kickstand function. Adhesive back, compatible with all phones and cases. 5 colours.",
    mainImg: "https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=600&q=80",
    category: "mobiles",
    sizes: ["Free Size"],
    price: 199,
    discount: 0,
  },
  {
    title: "Power Bank 20000mAh — 65W PD",
    description: "20000mAh lithium-polymer, 65W USB-C PD output, 22.5W for phones, simultaneous charging of 3 devices, LED display.",
    mainImg: "https://images.unsplash.com/photo-1585338083060-a11f7fbde3e5?w=600&q=80",
    category: "mobiles",
    sizes: ["Free Size"],
    price: 2999,
    discount: 25,
  },

  // ─── SPORTS (6) ──────────────────────────────────────────────────────────────
  {
    title: "Adjustable Dumbbell Set — 5-25kg",
    description: "Single dumbbell replaces 9 pairs. Quick-adjust dial system, anti-slip contoured handle, durable moulded ABS housing.",
    mainImg: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80",
    category: "sports",
    sizes: ["Free Size"],
    price: 12999,
    discount: 15,
  },
  {
    title: "Pro Yoga Mat — 6mm Non-Slip",
    description: "6mm TPE foam, double-sided non-slip texture, alignment lines, moisture-resistant, carrying strap included. 183×68cm.",
    mainImg: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&q=80",
    category: "sports",
    sizes: ["Free Size"],
    price: 1499,
    discount: 20,
  },
  {
    title: "Running Shoes — Ultra Boost Foam",
    description: "Responsive boost midsole, Primeknit upper, Continental rubber outsole for grip in wet conditions. Men's & Women's sizing.",
    mainImg: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
    category: "sports",
    sizes: ["6", "7", "8", "9", "10", "11", "12"],
    price: 8999,
    discount: 10,
  },
  {
    title: "Resistance Band Set — 5 Levels",
    description: "5 progressive resistance bands (5–50 lbs), latex-free TPE, door anchor & handles included. Full-body home workout solution.",
    mainImg: "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=600&q=80",
    category: "sports",
    sizes: ["Free Size"],
    price: 799,
    discount: 0,
  },
  {
    title: "Smart Jump Rope with Counter",
    description: "Digital LCD counter, calorie tracker, adjustable cable length, ball-bearing handles for tangle-free spin. Wireless sync.",
    mainImg: "https://images.unsplash.com/photo-1603988363607-e1e4a66962c6?w=600&q=80",
    category: "sports",
    sizes: ["Free Size"],
    price: 999,
    discount: 30,
  },
  {
    title: "Premium Cycling Helmet — MIPS",
    description: "MIPS rotational protection, 21 ventilation channels, adjustable fit dial, magnetic buckle, meets CE EN1078 safety standard.",
    mainImg: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
    category: "sports",
    sizes: ["S", "M", "L"],
    price: 4999,
    discount: 0,
  },

  // ─── GROCERIES (4) ───────────────────────────────────────────────────────────
  {
    title: "Cold-Pressed Extra Virgin Olive Oil — 1L",
    description: "Single-origin Greek EVOO, first cold press, acidity < 0.3%, rich in polyphenols. Perfect for salads and drizzling.",
    mainImg: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&q=80",
    category: "groceries",
    sizes: ["1L"],
    price: 799,
    discount: 0,
  },
  {
    title: "Organic Whole Bean Coffee — 500g",
    description: "Shade-grown Arabica, medium-dark roast, notes of dark chocolate and caramel. Ethically sourced, freshness sealed bag.",
    mainImg: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&q=80",
    category: "groceries",
    sizes: ["500g"],
    price: 699,
    discount: 10,
  },
  {
    title: "Raw Honey — Himalayan Wildflower 500g",
    description: "Pure unfiltered wildflower honey from Himalayan apiaries. No additives, rich in antioxidants and natural enzymes.",
    mainImg: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&q=80",
    category: "groceries",
    sizes: ["500g"],
    price: 449,
    discount: 0,
  },
  {
    title: "Protein Granola Clusters — 400g",
    description: "18g protein per serving, baked oats with whey crisps, dark chocolate chips, no refined sugar. 3 flavours available.",
    mainImg: "https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?w=600&q=80",
    category: "groceries",
    sizes: ["400g"],
    price: 349,
    discount: 15,
  },
]

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log("Connected to MongoDB")

    const existing = await Product.countDocuments()
    if (existing > 0) {
      console.log(`⚠️  Database already has ${existing} products.`)
      console.log("   To re-seed, manually clear the products collection first.")
      console.log("   Or run: db.products.deleteMany({}) in MongoDB shell")
      process.exit(0)
    }

    await Product.insertMany(products)
    console.log(`✅  Successfully seeded ${products.length} products!`)
    console.log("   Categories:")
    const cats = [...new Set(products.map(p => p.category))]
    cats.forEach(c => {
      const count = products.filter(p => p.category === c).length
      console.log(`   • ${c}: ${count} products`)
    })
  } catch (err) {
    console.error("Seed failed:", err.message)
  } finally {
    await mongoose.disconnect()
    process.exit(0)
  }
}

seed()
