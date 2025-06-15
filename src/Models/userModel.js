// Models/userModel.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    role: {
      type: String,
      enum: ["SuperAdmin", "Admin"], // Kept as provided
      required: true,
      default: "Admin",
    },
    campusId: {
      type: String,
      required: function () {
        return this.role !== "SuperAdmin";
      },
    },
    status: {
      type: String,
      enum: ["pending", "active", "inactive"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// Hash password before saving, but skip if already hashed
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  // Check if password is already hashed (starts with $2a$, $2b$, or $2y$)
  if (this.password && this.password.startsWith("$2")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

const User = mongoose.model("User", userSchema);

export default User;