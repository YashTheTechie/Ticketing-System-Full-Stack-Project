import User from "../models/User.js";
import jwt from "jsonwebtoken";

// Temporary memory matrix cache to store active OTP sequences (Expires in 5 minutes)
const adminOtpCache = new Map();

/**
 * PHASE 1: ADMIN LOGIN INITIALIZATION
 */
export const adminLogin = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email field parameters are required." });
    }

    // ⚡ Hard Match against your custom email profile request requirement
    if (email.trim().toLowerCase() !== process.env.ADMIN_EMAIL.toLowerCase()) {
      return res.status(401).json({ message: "Access Denied. Unauthorized admin email identity entry." });
    }

    // Upsert Check: Make sure an official user profile matching this role exists inside Atlas
    let user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      user = await User.create({
        name: "Master Admin User",
        email: email.toLowerCase(),
        role: "admin",
        password: "PASSWORDLESS_ACCOUNT" // Placeholder string since we bypass password flows
      });
    }

    // Generate a secure 6-digit verification integer code string
    const otpCode = String(Math.floor(100000 + Math.random() * 900000));

    // Save context structure into server cache limits
    adminOtpCache.set(email.toLowerCase(), {
      code: otpCode,
      expiresAt: Date.now() + 5 * 60 * 1000, // Valid for 5 minutes
    });

    // 🚀 MASTER TERMINAL TELEMETRY INTERCEPT LOG
    console.log(`\n👑 [ADMIN SECURITY OTP ACCESS LINK]: ${otpCode}\n`);

    res.status(200).json({ message: "Verification tracking code dispatched.", step2Required: true });

  } catch (error) {
    console.error("Admin identity authentication error:", error);
    res.status(500).json({ message: "Internal application authorization processing failures." });
  }
};

/**
 * PHASE 2: ADMIN OTP VERIFICATION SAVES
 */
export const verifyAdminOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const sessionCache = adminOtpCache.get(email.toLowerCase());

    if (!sessionCache) {
      return res.status(400).json({ message: "Session record expired or missing. Re-enter email credentials." });
    }

    if (Date.now() > sessionCache.expiresAt) {
      adminOtpCache.delete(email.toLowerCase());
      return res.status(400).json({ message: "OTP tracking expiration limit reached." });
    }

    if (sessionCache.code !== otp) {
      return res.status(400).json({ message: "Security confirmation code validation string mismatch." });
    }

    // Clear verification tracking elements out of application runtime loops
    adminOtpCache.delete(email.toLowerCase());

    const user = await User.findOne({ email: email.toLowerCase() });

    // Generate standard authentication signature token payload context 
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });

  } catch (error) {
    console.error("OTP Verification pipeline failure error:", error);
    res.status(500).json({ message: "Verification compilation errors." });
  }
};