// src/routes/AppRouter.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProtectedRoute from "../components/ProtectedRoute";
import RoleGuard from "../components/RoleGuard";
import { AuthProvider } from "../store/AuthContext";   // you already have this

import Home from "../pages/Home";        // <-- NEW
import Login from "../pages/Login";      // <-- make sure these exist
import Register from "../pages/Register";
import Account from "../pages/Account";
import AccountBills from "../pages/AccountBills";
import AdminDashboard from "../pages/AdminDashboard";
import AddBook from "../pages/AddBook";
import EditBook from "../pages/EditBook";
import ApiTest from "../pages/ApiTest";
import Catalog from "../pages/Catalog";
import DebugBooks from "../pages/DebugBooks";
import AuthTest from "../pages/AuthTest";
import CategoryManager from "../pages/CategoryManager";
import ImageTest from "../pages/ImageTest";
import DatabaseTest from "../pages/DatabaseTest";
import AboutUs from "../pages/AboutUs";
import Help from "../pages/Help";
import Contact from "../pages/Contact";

import { Toaster } from "react-hot-toast";            // <-- NEW
import { CartProvider } from "../store/CartContext";
import CartPage from "../pages/Cart";
import CheckoutPage from "../pages/Checkout";
import OrderSuccess from "../pages/OrderSuccess";

const NotFound = () => <div className="p-6">404</div>;
const Forbidden = () => <div className="p-6">403 – Not allowed</div>;

export default function AppRouter() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Header />
          <Toaster position="top-right" />               {/* <-- add me once */}
          <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/catalog/:category" element={<Catalog />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/api-test" element={<ApiTest />} />
          <Route path="/debug-books" element={<DebugBooks />} />
          <Route path="/auth-test" element={<AuthTest />} />
          <Route path="/category-manager" element={<CategoryManager />} />
          <Route path="/image-test" element={<ImageTest />} />
          <Route path="/database-test" element={<DatabaseTest />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/help" element={<Help />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />          {/* <-- ensure these routes exist */}
          <Route path="/register" element={<Register />} />
          <Route path="/403" element={<Forbidden />} />

          {/* Customer area */}
          <Route element={<ProtectedRoute />}>
            <Route path="/account" element={<Account />} />
            <Route path="/account/bills" element={<AccountBills />} />
          </Route>

          {/* Admin area */}
          <Route element={<ProtectedRoute />}>
            <Route
              path="/admin"
              element={
                <RoleGuard allow={["ADMIN", "STAFF"]}>
                  <AdminDashboard />
                </RoleGuard>
              }
            />
            <Route
              path="/admin/add-book"
              element={
                <RoleGuard allow={["ADMIN", "STAFF"]}>
                  <AddBook />
                </RoleGuard>
              }
            />
            <Route
              path="/admin/edit-book/:id"
              element={
                <RoleGuard allow={["ADMIN", "STAFF"]}>
                  <EditBook />
                </RoleGuard>
              }
            />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </CartProvider>
    </AuthProvider>
  );
}
