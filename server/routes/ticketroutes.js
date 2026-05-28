import express from "express";
import {
  createTicket,
  getAllTickets,
  getMyTickets,
  getSingleTicket,
  updateTicketStatus,
  addNote,
  sendMessage,
} from "../controllers/ticketController.js";
import { protect, verifyAdmin } from "../middleware/auth.js";

const router = express.Router();

/* =============================================================
   1. STATIC & EXPLICIT PATHS (Must stay on top)
============================================================= */

// 🎫 CREATE TICKET -> POST /api/tickets
router.post("/", protect, createTicket);

// 🔍 GET MY TICKETS (CLIENT) -> GET /api/tickets/my-tickets
router.get("/my-tickets", protect, getMyTickets);

// 👑 GET ALL TICKETS (ADMIN ONLY) -> GET /api/tickets/admin/all
router.get("/admin/all", protect, verifyAdmin, getAllTickets);


/* =============================================================
   2. DYNAMIC PARAMETER PATHS (Keep these strictly at the bottom)
============================================================= */

// 📄 GET SINGLE TICKET -> GET /api/tickets/:id
// ✅ Anyone logged in (Admin or Client) can view a single ticket's details!
router.get("/:id", protect, getSingleTicket);

// 🔄 UPDATE TICKET STATUS -> PUT /api/tickets/:id/status
router.put("/:id/status", protect, verifyAdmin, updateTicketStatus);

// 📝 ADD ADMIN NOTE -> POST /api/tickets/:id/note
router.post("/:id/note", protect, verifyAdmin, addNote);

// 💬 SEND MESSAGE -> POST /api/tickets/:id/message
// ✅ Protect ensures authentication, controller identifies if 'admin' or 'user' sent it
router.post("/:id/message", protect, sendMessage);

export default router;