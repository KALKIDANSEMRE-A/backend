import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import generateTokenAndSetCookie from "../Utils/generateTokenAndSetCookie.js";
import User from "../Models/userModel.js";

const isValidEmail = (email) => {
  const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return pattern.test(email);
};

// Middleware to authenticate JWT
const authMiddleware = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    console.log("No token provided");
    return res.status(401).json({ error: "Authentication required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.PRIVATE_KEY);
    req.user = decoded; // { userId, email, role }
    next();
  } catch (error) {
    console.error("JWT verification error:", error.message);
    return res.status(401).json({ error: "Invalid token" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate request body
    if (!email || !password) {
      console.log("Missing email or password:", { email, password });
      return res.status(400).json({ error: "Email and password are required" });
    }

    console.log("Login attempt:", { email, passwordLength: password.length });

    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found:", email);
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    console.log("Password check:", { isPasswordCorrect });

    if (!isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const token = generateTokenAndSetCookie(user, res);

    res.status(200).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      campusId: user.campusId,
      status: user.status,
      token: token,
    });
  } catch (error) {
    console.error("Error in login controller:", error.message, error.stack);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error in logout controller:", error.message, error.stack);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { newPassword, confirmPassword } = req.body;
    const { email } = req.user; // Get email from authenticated user

    if (!newPassword || !confirmPassword) {
      return res
        .status(400)
        .json({ error: "New password and confirmation are required" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: "Passwords don't match" });
    }

    const user = await User.findOne({ email });
    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export default { login, logout, resetPassword, authMiddleware };
