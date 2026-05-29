import mongoose from "mongoose"; 
import Ticket from "../models/Ticket.js";
import Counter from "../models/Counter.js";

/**
 * 🔢 Generate sequential ticket number
 */
const getNextTicketNumber = async () => {
  const counter = await Counter.findOneAndUpdate(
    { name: "ticket" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  return `TKT-${String(counter.seq).padStart(4, "0")}`;
};

/**
 * 🎫 CREATE TICKET (CLIENT PATHWAY)
 */
export const createTicket = async (req, res) => {
  try {
    if (!req.body.category || !req.body.title || !req.body.description) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const ticketNumber = await getNextTicketNumber();
    const userId = req.user?.userId || req.user?.id || req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized. Missing authentication info context." });
    }

    const ticket = await Ticket.create({
      ticketNumber,
      user: userId,
      category: req.body.category,
      title: req.body.title,
      description: req.body.description,
      priority: req.body.priority || "Medium",
      status: "Open",
      timeline: [
        {
          message: "Ticket created",
          time: new Date(),
        },
      ],
    });

    res.status(201).json(ticket);
  } catch (error) {
    console.error("Error creating ticket:", error);
    res.status(500).json({ message: error.message || "Server Error" });
  }
};

/**
 * 👑 GET ALL TICKETS (ADMIN ONLY PATHWAY)
 */
export const getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(tickets);
  } catch (error) {
    console.error("Error fetching all tickets:", error);
    res.status(500).json({ message: error.message || "Server Error fetching tickets" });
  }
};

/**
 * 👥 GET LOGGED-IN USER TICKETS (CLIENT PATHWAY)
 */
export const getMyTickets = async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?.id || req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: "User identity not resolved in request validation process." });
    }

    const tickets = await Ticket.find({ user: userId }).sort({ createdAt: -1 });

    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.status(200).json(tickets);
  } catch (error) {
    console.error("Error fetching user tickets:", error);
    res.status(500).json({ message: "Error fetching user tickets" });
  }
};

/**
 * 🔍 GET SINGLE TICKET (SHARED PATHWAY WITH ACCESS CONTROLS)
 */
export const getSingleTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId || req.user?.id || req.user?._id;
    let ticket = null;

    if (mongoose.Types.ObjectId.isValid(id)) {
      ticket = await Ticket.findById(id).populate("user", "name email");
    }

    if (!ticket) {
      ticket = await Ticket.findOne({ ticketNumber: id }).populate("user", "name email");
    }

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // 🛡️ SECURITY CHECK: Verify they own this ticket record if they are not an admin
    const ticketOwnerId = ticket.user?._id || ticket.user;
    if (req.user?.role !== "admin" && ticketOwnerId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Access Denied. You do not own this ticket record." });
    }

    res.status(200).json(ticket);
  } catch (error) {
    console.error("Error fetching ticket:", error);
    res.status(500).json({ message: "Error fetching ticket" });
  }
};

/**
 * 👑 UPDATE TICKET STATUS (ADMIN ONLY PATHWAY)
 */
export const updateTicketStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const allowedStatuses = ["Open", "In Progress", "Resolved"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    let ticket = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      ticket = await Ticket.findById(id);
    }
    if (!ticket) {
      ticket = await Ticket.findOne({ ticketNumber: id });
    }

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    ticket.status = status;
    ticket.timeline.push({
      message: `Status updated to ${status}`,
      time: new Date(),
    });

    await ticket.save();
    res.status(200).json(ticket);
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ message: "Error updating ticket status" });
  }
};

/**
 * 👑 ADD ADMIN NOTE (ADMIN ONLY PATHWAY)
 */
export const addNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Note text cannot be empty" });
    }

    let ticket = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      ticket = await Ticket.findById(id);
    }
    if (!ticket) {
      ticket = await Ticket.findOne({ ticketNumber: id });
    }

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    ticket.notes.push({ text, time: new Date() });
    await ticket.save();
    res.status(200).json(ticket.notes);
  } catch (error) {
    console.error("Error adding note:", error);
    res.status(500).json({ message: "Error adding note" });
  }
};

/**
 * 💬 SEND MESSAGE (TWO-WAY CHAT PATHWAY)
 */
export const sendMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    const userId = req.user?.userId || req.user?.id || req.user?._id;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Message text cannot be empty" });
    }

    let ticket = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      ticket = await Ticket.findById(id);
    }
    if (!ticket) {
      ticket = await Ticket.findOne({ ticketNumber: id });
    }

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // 🛡️ SECURITY CHECK SAFED: Works beautifully whether ticket.user is populated or not
    const ticketOwnerId = ticket.user?._id || ticket.user;
    if (req.user?.role !== "admin" && ticketOwnerId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Unauthorized messaging attempt context." });
    }

    // ⚡ AUTO ASSIGN IDENTITY: Enforces validation schemas securely from token structures
    const messageSenderType = req.user?.role === "admin" ? "admin" : "user";

    ticket.messages.push({
      text,
      sender: messageSenderType,
      time: new Date(),
    });

    await ticket.save();
    res.status(200).json(ticket.messages);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Error sending message" });
  }
};

/**
 * 👑 GET RESOLVED TICKETS HISTORY (ADMIN ONLY PATHWAY)
 * ✅ ADDED: This connects directly to your newly created admin History page!
 */
export const getResolvedHistory = async (req, res) => {
  try {
    const history = await Ticket.find({ status: "Resolved" })
      .populate("user", "name email")
      .sort({ updatedAt: -1 }); // Arranges by the most recently closed tickets first

    res.status(200).json(history);
  } catch (error) {
    console.error("Error fetching resolution history logs:", error);
    res.status(500).json({ message: "Failed to load historical resolution logs." });
  }
};