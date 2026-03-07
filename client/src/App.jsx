import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Toaster } from "react-hot-toast"

import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Products from "./pages/Products"
import ProductDetail from "./pages/ProductDetail"
import Cart from "./pages/Cart"
import Orders from "./pages/Orders"
import Checkout from "./pages/Checkout"

import AdminDashboard from "./pages/AdminDashboard"
import AddProduct from "./pages/AddProduct"
import AdminProducts from "./pages/AdminProducts"
import AdminOrders from "./pages/AdminOrders"

import AdminRoute from "./components/AdminRoute"
import ProtectedRoute from "./components/ProtectedRoute"
import Navbar from "./components/Navbar"

function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "14px",
            borderRadius: "8px",
            boxShadow: "0 8px 24px rgba(0,0,0,.12)",
          },
          success: { iconTheme: { primary: "#16a34a", secondary: "#fff" } },
          error:   { iconTheme: { primary: "#e02d2d", secondary: "#fff" } },
        }}
      />

      <Navbar />

      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />

        {/* Protected user routes */}
        <Route path="/cart"     element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        <Route path="/orders"   element={<ProtectedRoute><Orders /></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />

        {/* Admin routes */}
        <Route path="/admin"              element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/products"     element={<AdminRoute><AdminProducts /></AdminRoute>} />
        <Route path="/admin/orders"       element={<AdminRoute><AdminOrders /></AdminRoute>} />
        <Route path="/admin/add-product"  element={<AdminRoute><AddProduct /></AdminRoute>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
