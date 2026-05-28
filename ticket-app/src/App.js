import { BrowserRouter, Routes, Route } from "react-router-dom";

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
import AdminLogin from "./pages/auth/AdminLogin"; // ⚡ 1. IMPORT YOUR NEW ADMIN LOGIN PAGE
import AdminDashboard from "./pages/admin/Dashboard";
import AllTickets from "./pages/admin/AllTickets";
import AdminTicketDetail from "./pages/admin/TicketDetail";
import AdminHistory from "./pages/admin/History";

// ⚡ 2. HELPER TO DETERMINE NAVBAR SCHEMATICS SAFELY
const NavigationWrapper = () => {
  const isAdminRoute = window.location.pathname.startsWith("/admin");
  return isAdminRoute ? <AdminNavbar /> : <Navbar />;
};

export default function App() {
  return (
    <BrowserRouter>
      {/* 🛠️ Dynamic Navbar Execution */}
      <NavigationWrapper />

      <main
        style={{
          minHeight: "calc(100vh - 64px)",
          background: "#f8fafc",
        }}
      >
        <Routes>
          {/* 👥 Client Routes */}
          <Route path="/" element={<ClientHome />} />
          <Route path="/client/raise-issue" element={<RaiseIssue />} />
          <Route path="/client/my-tickets" element={<MyTickets />} />
          <Route path="/client/ticket/:id" element={<ClientTicketDetail />} />
          <Route path="/client/history" element={<ClientHistory />} />
          
          {/* 🔐 Auth Routes */}
          <Route path="/login"  element={<Login  />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* 👑 3. REGISTERED ADMIN LOGIN LINK (Fixes the blank page error) */}
          <Route path="/adminlogin" element={<AdminLogin />} />

          {/* 📊 Admin Dashboard Core Operations */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/all-tickets" element={<AllTickets />} />
          <Route path="/admin/ticket/:id" element={<AdminTicketDetail />} />
          <Route path="/admin/history" element={<AdminHistory />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}