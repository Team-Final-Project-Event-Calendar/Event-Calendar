import mongoose from "mongoose";
import bcrypt from "bcrypt";

/**
 * Mongoose schema for the User model.
 * 
 * @typedef {Object} User
 * @property {string} username - Unique username of the user.
 * @property {string} phoneNumber - Unique phone number.
 * @property {string} email - Unique email address.
 * @property {string} password - Hashed password of the user.
 * @property {string} firstName - First name of the user.
 * @property {string} lastName - Last name of the user.
 * @property {"user" | "admin"} role - Role of the user (default: "user").
 * @property {string} avatar - URL to the user's avatar.
 * @property {string} [address] - Optional address of the user.
 * @property {boolean} isBlocked - Whether the user is blocked.
 */
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  avatar: { type: String, default: "https://example.com/default-avatar.png" },
  address: { type: String },
  isBlocked: {
    type: Boolean,
    default: false,
  },
});

/**
 * Pre-save hook to hash the user's password before saving.
 * 
 * @function
 * @name userSchema.pre("save")
 * @param {Function} next - Callback to proceed to the next middleware.
 */
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

export default mongoose.model("User", userSchema);
