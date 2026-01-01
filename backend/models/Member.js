import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const memberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Member name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
    },
    membershipId: {
      type: String,
      unique: true,
      required: true,
    },
    membershipDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

// Generate unique membership ID before saving
memberSchema.pre("save", async function (next) {
  if (!this.membershipId) {
    const count = await mongoose.model("Member").countDocuments();
    this.membershipId = `MEM${String(count + 1).padStart(5, "0")}`;
  }
  next();
});

// Index for faster search
memberSchema.index({ name: "text", email: "text", membershipId: "text" });

const Member = mongoose.model("Member", memberSchema);

export default Member;