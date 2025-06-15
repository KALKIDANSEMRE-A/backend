import jwt from "jsonwebtoken";
import User from "../Models/userModel.js";

export const authenticateToken = async (req, res, next) => {
  // Try to get token from Authorization header first
  let token = null;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies && req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    console.log("No token provided");
    return res.status(401).json({ error: "Access token required" });
  }
  try {
    const decoded = jwt.verify(
      token,
      process.env.PRIVATE_KEY || process.env.JWT_SECRET
    );
    console.log("Decoded JWT:", decoded);

    if (!decoded.id || !decoded.role) {
      console.log("Invalid token: missing id or role");
      return res
        .status(401)
        .json({ error: "Invalid token: missing id or role" });
    }

    const user = await User.findById(decoded.id);
    console.log("User from DB:", user);

    if (!user) {
      console.log("User not found");
      return res.status(404).json({ error: "User not found" });
    }

    // Verify role consistency
    if (decoded.role !== user.role) {
      console.log(
        `Role mismatch: JWT role=${decoded.role}, DB role=${user.role}`
      );
      return res.status(403).json({ error: "Role mismatch in token" });
    }

    req.user = {
      userId: decoded.id,
      email: user.email, // Add email to req.user for password reset verification
      role: decoded.role,
      campusId: decoded.campusId || user.campusId,
      status: user.status,
    };
    console.log("req.user set to:", req.user);

    next();
  } catch (error) {
    console.error("Token verification error:", error.message, error.stack);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    console.log(
      `Checking roles: user role=${req.user.role}, required=${roles}`
    );
    const normalizedUserRole = req.user.role ? req.user.role.toLowerCase() : "";
    const normalizedRequiredRoles = roles.map((r) => r.toLowerCase());
    if (
      !normalizedUserRole ||
      !normalizedRequiredRoles.includes(normalizedUserRole)
    ) {
      console.log("Role check failed");
      return res
        .status(403)
        .json({ error: "Access forbidden: insufficient role" });
    }
    console.log("Role check passed");
    next();
  };
};

// New middleware to verify user can only reset their own password
export const verifyOwnership = (req, res, next) => {
  const requestedEmail = req.body.email;
  const loggedInUserEmail = req.user.email;

  console.log(
    `Ownership check: requested=${requestedEmail}, loggedIn=${loggedInUserEmail}`
  );

  if (requestedEmail !== loggedInUserEmail) {
    console.log("Unauthorized password reset attempt");
    return res.status(403).json({
      error: "You can only reset your own password",
    });
  }

  console.log("Ownership verified");
  next();
};

export default {
  authenticateToken,
  authorizeRoles,
  verifyOwnership,
};
