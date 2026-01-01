import mongoose from "mongoose";

const issueSchema = new mongoose.Schema(
  {
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: [true, "Book reference is required"],
    },
    member: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      required: [true, "Member reference is required"],
    },
    issueDate: {
      type: Date,
      default: Date.now,
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    returnDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["issued", "returned", "overdue"],
      default: "issued",
    },
    fine: {
      type: Number,
      default: 0,
      min: 0,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Set due date to 14 days from issue date by default
issueSchema.pre("save", function (next) {
  if (!this.dueDate) {
    const due = new Date(this.issueDate);
    due.setDate(due.getDate() + 14);
    this.dueDate = due;
  }
  next();
});

// Calculate fine for overdue books (Rs 5 per day)
issueSchema.methods.calculateFine = function () {
  if (this.status === "returned" && this.returnDate) {
    const daysLate = Math.floor(
      (this.returnDate - this.dueDate) / (1000 * 60 * 60 * 24)
    );
    if (daysLate > 0) {
      this.fine = daysLate * 5; // Rs 5 per day
    }
  }
};

// Index for faster queries
issueSchema.index({ book: 1, member: 1, status: 1 });

const Issue = mongoose.model("Issue", issueSchema);

export default Issue;