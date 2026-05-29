import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import User from "../models/User.js";

const router = express.Router();

// 🧠 Temporary memory cache to store active Admin OTP sequences (Expires in 5 minutes)
const adminOtpCache = new Map();

// ==========================================
// 👥 CLIENT AUTHENTICATION ENDPOINTS
// ==========================================

// SIGNUP (CLIENT)
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user attempts to signup maliciously as an admin
    if (role === "admin") {
      return res.status(403).json({ message: "Action forbidden. Cannot signup with admin privileges." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "client",
    });

    await user.save();

    res.status(201).json({ message: "Account created successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// LOGIN (CLIENT)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Security block: Prevent standard password endpoint from handling admin login
    if (user.role === "admin") {
      return res.status(403).json({ message: "Please log in through the secure admin portal." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ==========================================
// 👑 PASSWORDLESS ADMIN AUTHENTICATION ENDPOINTS
// ==========================================

// PHASE 1: ADMIN LOGIN INITIALIZATION (Verify email and generate OTP)
router.post("/admin/login", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email field parameters are required."
      });
    }

    // Strict validation against your specific admin email address
    if (email.trim().toLowerCase() !== process.env.ADMIN_EMAIL.toLowerCase()) {
      return res.status(401).json({
        message: "Access Denied. Incorrect admin email address."
      });
    }

    // Upsert Check: Make sure the admin profile exists in the database
    let user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      user = await User.create({
        name: "Master Admin User",
        email: email.toLowerCase(),
        role: "admin",
        password: "PASSWORDLESS_ACCOUNT"
      });
    }

    // Generate secure 6-digit OTP
    const otpCode = String(
      Math.floor(100000 + Math.random() * 900000)
    );

    // Save OTP in cache
    adminOtpCache.set(email.toLowerCase(), {
      code: otpCode,
      expiresAt: Date.now() + 5 * 60 * 1000,
    });

    console.log(`\n👑 GENERATED OTP: ${otpCode}\n`);

    // ==========================================
    // 📧 NODEMAILER TRANSPORTER
    // ==========================================
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // ==========================================
    // 📩 SEND OTP EMAIL
    // ==========================================
    await transporter.sendMail({
      from: `"SupportDesk Admin" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your Admin Login OTP",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color:#2563eb;">SupportDesk Admin Login</h2>

          <p>Your secure verification code is:</p>

          <div style="
            font-size: 36px;
            font-weight: bold;
            letter-spacing: 6px;
            color: #111827;
            margin: 20px 0;
          ">
            ${otpCode}
          </div>

          <p>This OTP will expire in 5 minutes.</p>

          <p style="font-size: 12px; color: gray;">
            If you did not request this login, please ignore this email.
          </p>
        </div>
      `,
    });

    console.log("✅ OTP EMAIL SENT SUCCESSFULLY");

    res.status(200).json({
      message: "Verification tracking code dispatched.",
      step2Required: true
    });

  } catch (error) {
    console.error("❌ EMAIL ERROR:", error);

    res.status(500).json({
      message: "Internal application authorization processing failure.",
      error: error.message
    });
  }
});

// PHASE 2: ADMIN OTP VERIFICATION (Validates code and returns JWT token)
router.post("/admin/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    const sessionCache = adminOtpCache.get(email.toLowerCase());

    if (!sessionCache) {
      return res.status(400).json({
        message: "Session record expired or missing. Re-enter email credentials."
      });
    }

    if (Date.now() > sessionCache.expiresAt) {
      adminOtpCache.delete(email.toLowerCase());

      return res.status(400).json({
        message: "OTP tracking expiration limit reached."
      });
    }

    if (sessionCache.code !== otp) {
      return res.status(400).json({
        message: "Security confirmation code validation string mismatch."
      });
    }

    // Clear verification cache
    adminOtpCache.delete(email.toLowerCase());

    const user = await User.findOne({
      email: email.toLowerCase()
    });

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
        name: user.name
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Admin verification successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({
      message: "Verification compilation errors.",
      error: error.message
    });
  }
});

export default router;