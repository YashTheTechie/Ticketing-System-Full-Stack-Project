import jwt from "jsonwebtoken";

/**
 * 🔒 VERIFY TOKEN MIDDLEWARE
 * Extracts and verifies the JWT token from the Authorization header
 */
export const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // 1. Check if Authorization header exists and follows Bearer schema
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "No token provided, access denied",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Token missing from authentication payload",
      });
    }

    // 2. Verify token integrity
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // 3. Attach user context safely
    // ✅ Changed key to 'userId' to completely isolate it from route path parameters like /:id
    req.user = {
      userId: decoded.id || decoded._id,
      email: decoded.email,
      role: decoded.role,
      name: decoded.name,
    };

    next();
  } catch (error) {
    console.error(
      "JWT Verification failure:",
      error.message
    );

    return res.status(401).json({
      message: "Invalid or expired token, please login again",
    });
  }
};

/**
 * 👑 VERIFY ADMIN MIDDLEWARE
 * Restricts route access to users with the 'admin' role exclusively
 */
export const verifyAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({
      message: "Forbidden: Admin access required",
    });
  }
};