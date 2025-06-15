// // import { validationResult } from "express-validator";
// // import User from "../Models/userModel.js";
// // import Partnership from "../Models/partnershipModel.js";
// // import bcrypt from "bcryptjs";

// // /**
// //  * Generates a random 8-character alphanumeric password.
// //  * @returns {string} The randomly generated password.
// //  */
// // const generateRandomPassword = () => {
// //   const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
// //   let password = "";
// //   for (let i = 0; i < 8; i++) {
// //     password += chars.charAt(Math.floor(Math.random() * chars.length));
// //   }
// //   return password;
// // };

// // /**
// //  * Creates a new user (Admin or User) and assigns a random password.
// //  * The plain-text password is returned in the response for the SuperAdmin to share.
// //  */
// // export const assignAdmin = async (req, res) => {
// //   try {
// //     const errors = validationResult(req);
// //     if (!errors.isEmpty()) {
// //       return res.status(400).json({ errors: errors.array() });
// //     }

// //     const { email, firstName, lastName, campusId, role } = req.body;

// //     // Validate the role
// //     if (!["Super-Admin", "Admin", "User"].includes(role)) {
// //       return res.status(400).json({ error: "Invalid role specified" });
// //     }

// //     // Check if the user already exists
// //     const existingUser = await User.findOne({ email });
// //     if (existingUser) {
// //       return res.status(400).json({ error: "Email is already registered" });
// //     }

// //     // Generate and hash the password
// //     const password = generateRandomPassword();
// //     const hashedPassword = await bcrypt.hash(password, 10); // Hash password for storage

// //     const user = new User({
// //       firstName,
// //       lastName,
// //       email,
// //       password: hashedPassword,
// //       role,
// //       campusId,
// //       status: "active",
// //     });

// //     await user.save();

// //     // Respond with the new user's email and the UN-HASHED generated password
// //     // Using 201 "Created" status is more appropriate here.
// //     res.status(201).json({
// //       message: "User assigned successfully",
// //       email: user.email,
// //       generatedPassword: password, // This is sent correctly
// //     });

// //   } catch (error) {
// //     console.error("Error assigning admin:", error.message, error.stack);
// //     res.status(500).json({ error: "Internal server error" });
// //   }
// // };

// // /**
// //  * Fetches all partnership records from the database.
// //  */
// // export const getAllPartnerships = async (req, res) => {
// //   try {
// //     const errors = validationResult(req);
// //     if (!errors.isEmpty()) {
// //       return res.status(400).json({ success: false, errors: errors.array() });
// //     }

// //     const partnerships = await Partnership.find().lean();

// //     res.status(200).json({
// //       success: true,
// //       count: partnerships.length,
// //       data: partnerships,
// //     });

// //   } catch (error) {
// //     console.error("Error fetching partnerships:", error.message, error.stack);
// //     res.status(500).json({
// //       success: false,
// //       message: "Failed to fetch partnerships",
// //       error: error.message,
// //     });
// //   }
// // };

// // /**
// //  * Updates a user's information by their ID.
// //  */
// // export const updateUser = async (req, res) => {
// //   try {
// //     const errors = validationResult(req);
// //     if (!errors.isEmpty()) {
// //       return res.status(400).json({ errors: errors.array() });
// //     }

// //     const { id } = req.params;
// //     const { firstName, lastName, email, role } = req.body;

// //     const user = await User.findByIdAndUpdate(
// //       id,
// //       { firstName, lastName, email, role },
// //       { new: true, runValidators: true } // 'new: true' returns the updated document
// //     );

// //     if (!user) {
// //       return res.status(404).json({ error: "User not found" });
// //     }

// //     res.status(200).json({ message: "User updated successfully", user });

// //   } catch (error) {
// //     console.error("Error updating user:", error.message, error.stack);
// //     res.status(500).json({ error: "Internal server error" });
// //   }
// // };

// // /**
// //  * Deletes a user by their ID.
// //  */
// // export const deleteUser = async (req, res) => {
// //   try {
// //     const { id } = req.params;
// //     const user = await User.findByIdAndDelete(id);

// //     if (!user) {
// //       return res.status(404).json({ error: "User not found" });
// //     }

// //     res.status(200).json({ message: "User deleted successfully" });

// //   } catch (error) {
// //     console.error("Error deleting user:", error.message, error.stack);
// //     res.status(500).json({ error: "Internal server error" });
// //   }
// // };

// // // It's a good practice to export all functions in a single default object
// // // for cleaner imports elsewhere.
// // export default {
// //   assignAdmin,
// //   getAllPartnerships,
// //   updateUser,
// //   deleteUser,
// // };

// import { validationResult } from "express-validator";
// import User from "../Models/userModel.js";
// import bcrypt from "bcryptjs";

// /**
//  * Generates a random 8-character alphanumeric password.
//  * @returns {string} The randomly generated password.
//  */
// const generateRandomPassword = () => {
//   const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
//   let password = "";
//   for (let i = 0; i < 8; i++) {
//     password += chars.charAt(Math.floor(Math.random() * chars.length));
//   }
//   return password;
// };

// /**
//  * Creates a new user (Admin or User) and assigns a random password.
//  * The plain-text password is returned in the response for the Admin to share.
//  */
// export const assignAdmin = async (req, res) => {
//   try {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     const { email, firstName, lastName, campusId, role } = req.body;

//     // Validate the role
//     if (!["Admin", "User"].includes(role)) {
//       return res.status(400).json({ error: "Invalid role specified" });
//     }

//     // Check if the user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ error: "Email is already registered" });
//     }

//     // Generate and hash the password
//     const password = generateRandomPassword();
//     const hashedPassword = await bcrypt.hash(password, 10);

//     const user = new User({
//       firstName,
//       lastName,
//       email,
//       password: hashedPassword,
//       role,
//       campusId,
//       status: "active",
//     });

//     await user.save();

//     res.status(201).json({
//       message: "User assigned successfully",
//       email: user.email,
//       generatedPassword: password,
//     });
//   } catch (error) {
//     console.error("Error assigning admin:", error.message, error.stack);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// /**
//  * Fetches all partnership records from the database.
//  */
// export const getAllPartnerships = async (req, res) => {
//   try {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ success: false, errors: errors.array() });
//     }

//     const partnerships = await Partnership.find().lean();

//     res.status(200).json({
//       success: true,
//       count: partnerships.length,
//       data: partnerships,
//     });
//   } catch (error) {
//     console.error("Error fetching partnerships:", error.message, error.stack);
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch partnerships",
//       error: error.message,
//     });
//   }
// };

// /**
//  * Updates a user's information by their ID.
//  */
// export const updateUser = async (req, res) => {
//   try {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     const { id } = req.params;
//     const { firstName, lastName, email, role } = req.body;

//     const user = await User.findByIdAndUpdate(
//       id,
//       { firstName, lastName, email, role },
//       { new: true, runValidators: true }
//     );

//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     res.status(200).json({ message: "User updated successfully", user });
//   } catch (error) {
//     console.error("Error updating user:", error.message, error.stack);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// /**
//  * Deletes a user by their ID.
//  */
// export const deleteUser = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const user = await User.findByIdAndDelete(id);

//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     res.status(200).json({ message: "User deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting user:", error.message, error.stack);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// export default {
//   assignAdmin,
//   getAllPartnerships,
//   updateUser,
//   deleteUser,
// };
import { validationResult } from "express-validator";
import User from "../Models/userModel.js";
import bcrypt from "bcryptjs";

const generateRandomPassword = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let password = "";
  for (let i = 0; i < 8; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

export const assignAdmin = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, firstName, lastName, campusId, role } = req.body;

    // Validate the role
    if (!["SuperAdmin", "Admin"].includes(role)) {
      return res.status(400).json({ error: "Invalid role specified" });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email is already registered" });
    }

    // Generate and hash the password
    const password = generateRandomPassword();
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
      campusId,
      status: "active",
    });

    await user.save();

    res.status(201).json({
      message: "User assigned successfully",
      email: user.email,
      generatedPassword: password,
    });
  } catch (error) {
    console.error("Error assigning admin:", error.message, error.stack);
    res.status(500).json({ error: "Internal server error" });
  }
};
/**
 * Fetches all users from the database.
 */
export const getUsers = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const users = await User.find().lean();

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    console.error("Error fetching users:", error.message, error.stack);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message,
    });
  }
};

/**
 * Fetches all partnership records from the database.
 */
export const getAllPartnerships = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const partnerships = await Partnership.find().lean();

    res.status(200).json({
      success: true,
      count: partnerships.length,
      data: partnerships,
    });
  } catch (error) {
    console.error("Error fetching partnerships:", error.message, error.stack);
    res.status(500).json({
      success: false,
      message: "Failed to fetch partnerships",
      error: error.message,
    });
  }
};

/**
 * Updates a user's information by their ID.
 */
export const updateUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { firstName, lastName, email, role } = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      { firstName, lastName, email, role },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    console.error("Error updating user:", error.message, error.stack);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Deletes a user by their ID.
 */
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error.message, error.stack);
    res.status(500).json({ error: "Internal server error" });
  }
};

export default {
  assignAdmin,
  getUsers,
  getAllPartnerships,
  updateUser,
  deleteUser,
};