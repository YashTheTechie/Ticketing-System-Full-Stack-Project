import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    ticketNumber: {
      type: String,
      unique: true,
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },

    status: {
      type: String,
      enum: ["Open", "In Progress", "Resolved"],
      default: "Open",
    },

    // ✅ TIMELINE
    timeline: [
      {
        message: {
          type: String,
          required: true,
        },

        time: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // ✅ ADMIN NOTES
    notes: [
      {
        text: {
          type: String,
        },

        time: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // ✅ CLIENT / ADMIN MESSAGES
    messages: [
      {
        text: {
          type: String,
          required: true,
        },

        sender: {
          type: String,
          // ✅ FIXED: Added "user" to the enum list so your frontend sends don't trip data flags
          enum: ["admin", "client", "user"],
          default: "client",
        },

        time: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Ticket", ticketSchema);