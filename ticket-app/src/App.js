import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import AdminNavbar from "./components/AdminNavbar";

// Client pages
import ClientHome from "./pages/client/Home";
import RaiseIssue from "./pages/client/RaiseIssue";
import MyTickets from "./pages/client/MyTickets";
import ClientTicketDetail from "./pages/client/TicketDetail";
import ClientHistory from "./pages/client/History";
import Login  from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";

// Admin pages
import AdminLogin from "./pages/auth/AdminLogin";
import AdminDashboard from "./pages/admin/Dashboard";
import AllTickets from "./pages/admin/AllTickets";
import AdminTicketDetail from "./pages/admin/TicketDetail";
import AdminHistory from "./pages/admin/History";

import axios from "axios";

// 1. Dynamic Environment Setup: Localhost fallback if variable is undefined
axios.defaults.baseURL = process.env.REACT_APP_API_URL || "http://localhost:5000";

// 2. Global Token Interceptor: Automatically attaches JWT headers to all API calls
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
// ⚡ 1. CLIENT ROUTE GUARD
const ClientProtectedRoute = () => {
  const token = localStorage.getItem("token");
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

// ⚡ 2. ADMIN ROUTE GUARD
const AdminProtectedRoute = () => {
  const token = localStorage.getItem("token");
  
  let user = null;
  try {
    const storedUser = localStorage.getItem("user");
    if (storedUser) user = JSON.parse(storedUser);
  } catch (err) {
    console.error("Error reading role for security gate verification", err);
  }

  if (!token || (user && user.role !== "admin")) {
    return <Navigate to="/adminlogin" replace />;
  }

  return <Outlet />;
};

// ⚡ 3. DYNAMIC NAVBAR SCHEMATICS WRAPPER (FULLY FIXED WITH RE-RENDER LIFECYCLES)
const NavigationWrapper = () => {
  // 🌟 FIX: useLocation forces React to watch routing updates actively on navigate()
  const location = useLocation(); 
  const currentPath = location.pathname;
  const isAdminRoute = currentPath.startsWith("/admin");
  const token = localStorage.getItem("token");

  // Only hide the navbar on explicit authentication routes
  const isAuthPage = ["/login", "/signup", "/adminlogin"].includes(currentPath);
  if (isAuthPage || !token) return null;

  return isAdminRoute ? <AdminNavbar /> : <Navbar />;
};

export default function App() {
  return (
    <BrowserRouter>
      {/* Dynamic Navbar Execution */}
      <NavigationWrapper />

      <main
        style={{
          minHeight: "calc(100vh - 64px)",
          background: "#f8fafc",
        }}
      >
        <Routes>
          {/* 🔓 Public Authentication Gates */}
          <Route path="/login"  element={<Login  />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/adminlogin" element={<AdminLogin />} />

          {/* 🛡️ Protected CLIENT View Layouts */}
          <Route element={<ClientProtectedRoute />}>
            <Route path="/" element={<ClientHome />} />
            <Route path="/client/raise-issue" element={<RaiseIssue />} />
            <Route path="/client/my-tickets" element={<MyTickets />} />
            <Route path="/client/ticket/:id" element={<ClientTicketDetail />} />
            <Route path="/client/history" element={<ClientHistory />} />
          </Route>

          {/* 🛡️ Protected ADMIN Dashboard Core Operations */}
          <Route element={<AdminProtectedRoute />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/all-tickets" element={<AllTickets />} />
            <Route path="/admin/ticket/:id" element={<AdminTicketDetail />} />
            <Route path="/admin/history" element={<AdminHistory />} />
          </Route>

          {/* Fallback Catch Route */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}