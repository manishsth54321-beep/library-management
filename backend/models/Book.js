import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Book title is required"],
      trim: true,
    },
    author: {
      type: String,
      required: [true, "Author name is required"],
      trim: true,
    },
    isbn: {
      type: String,
      required: [true, "ISBN is required"],
      unique: true,
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [0, "Quantity cannot be negative"],
      default: 1,
    },
    availableQuantity: {
      type: Number,
      required: true,
      min: [0, "Available quantity cannot be negative"],
      default: 1,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster search
bookSchema.index({ title: "text", author: "text", isbn: "text" });

const Book = mongoose.model("Book", bookSchema);

export default Book;