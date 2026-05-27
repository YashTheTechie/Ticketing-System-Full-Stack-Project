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
import AdminDashboard from "./pages/admin/Dashboard";
import AllTickets from "./pages/admin/AllTickets";
import AdminTicketDetail from "./pages/admin/TicketDetail";
import AdminHistory from "./pages/admin/History";

export default function App() {
  return (
    <BrowserRouter>

      {/* Conditional Navbar */}
      {
        window.location.pathname.startsWith("/admin")
          ? <AdminNavbar />
          : <Navbar />
      }

      <main
        style={{
          minHeight: "calc(100vh - 64px)",
          background: "#f8fafc",
        }}
      >

        <Routes>

          {/* Client Routes */}
          <Route path="/" element={<ClientHome />} />

          <Route
            path="/client/raise-issue"
            element={<RaiseIssue />}
          />

          <Route
            path="/client/my-tickets"
            element={<MyTickets />}
          />

          <Route
            path="/client/ticket/:id"
            element={<ClientTicketDetail />}
          />

          <Route
            path="/client/history"
            element={<ClientHistory />}
          />
          <Route path="/login"  element={<Login  />} />
<Route path="/signup" element={<Signup />} />
          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={<AdminDashboard />}
          />

          <Route
            path="/admin/all-tickets"
            element={<AllTickets />}
          />

          <Route
            path="/admin/ticket/:id"
            element={<AdminTicketDetail />}
          />

          <Route
            path="/admin/history"
            element={<AdminHistory />}
          />

        </Routes>

      </main>

    </BrowserRouter>
  );
}