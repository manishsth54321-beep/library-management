import Issue from "../models/Issue.js";
import Book from "../models/Book.js";
import Member from "../models/Member.js";

// @desc    Get all issues
// @route   GET /api/issues
// @access  Private
export const getAllIssues = async (req, res) => {
  try {
    const { status, memberId, bookId } = req.query;
    let query = {};

    if (status) {
      query.status = status;
    }
    if (memberId) {
      query.member = memberId;
    }
    if (bookId) {
      query.book = bookId;
    }

    const issues = await Issue.find(query)
      .populate("book", "title author isbn")
      .populate("member", "name email membershipId")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: issues.length,
      data: issues,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching issues",
      error: error.message,
    });
  }
};

// @desc    Get single issue by ID
// @route   GET /api/issues/:id
// @access  Private
export const getIssueById = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id)
      .populate("book")
      .populate("member");

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "Issue record not found",
      });
    }

    res.status(200).json({
      success: true,
      data: issue,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching issue",
      error: error.message,
    });
  }
};

// @desc    Issue a book to member
// @route   POST /api/issues
// @access  Private
export const issueBook = async (req, res) => {
  try {
    const { bookId, memberId, dueDate, notes } = req.body;

    // Validate book exists and is available
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    if (book.availableQuantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Book is not available for issue",
      });
    }

    // Validate member exists and is active
    const member = await Member.findById(memberId);
    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    if (member.status !== "active") {
      return res.status(400).json({
        success: false,
        message: "Member account is not active",
      });
    }

    // Check if member already has this book issued
    const existingIssue = await Issue.findOne({
      book: bookId,
      member: memberId,
      status: "issued",
    });

    if (existingIssue) {
      return res.status(400).json({
        success: false,
        message: "This book is already issued to this member",
      });
    }

    // Create issue record
    const issue = await Issue.create({
      book: bookId,
      member: memberId,
      dueDate: dueDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      notes,
    });

    // Update book available quantity
    book.availableQuantity -= 1;
    await book.save();

    const populatedIssue = await Issue.findById(issue._id)
      .populate("book", "title author isbn")
      .populate("member", "name email membershipId");

    res.status(201).json({
      success: true,
      message: "Book issued successfully",
      data: populatedIssue,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error issuing book",
      error: error.message,
    });
  }
};

// @desc    Return a book
// @route   PUT /api/issues/:id/return
// @access  Private
export const returnBook = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id).populate("book");

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "Issue record not found",
      });
    }

    if (issue.status === "returned") {
      return res.status(400).json({
        success: false,
        message: "Book is already returned",
      });
    }

    // Set return date and calculate fine if overdue
    issue.returnDate = new Date();
    issue.status = "returned";
    issue.calculateFine();

    await issue.save();

    // Update book available quantity
    const book = await Book.findById(issue.book._id);
    book.availableQuantity += 1;
    await book.save();

    const populatedIssue = await Issue.findById(issue._id)
      .populate("book", "title author isbn")
      .populate("member", "name email membershipId");

    res.status(200).json({
      success: true,
      message: "Book returned successfully",
      data: populatedIssue,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error returning book",
      error: error.message,
    });
  }
};

// @desc    Update issue record
// @route   PUT /api/issues/:id
// @access  Private
export const updateIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "Issue record not found",
      });
    }

    const updatedIssue = await Issue.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    )
      .populate("book", "title author isbn")
      .populate("member", "name email membershipId");

    res.status(200).json({
      success: true,
      message: "Issue record updated successfully",
      data: updatedIssue,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error updating issue record",
      error: error.message,
    });
  }
};

// @desc    Delete issue record
// @route   DELETE /api/issues/:id
// @access  Private
export const deleteIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "Issue record not found",
      });
    }

    // If book is still issued, return it before deleting
    if (issue.status === "issued") {
      const book = await Book.findById(issue.book);
      book.availableQuantity += 1;
      await book.save();
    }

    await Issue.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Issue record deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting issue record",
      error: error.message,
    });
  }
};

// @desc    Get dashboard statistics
// @route   GET /api/issues/stats/dashboard
// @access  Private
export const getDashboardStats = async (req, res) => {
  try {
    const totalBooks = await Book.countDocuments();
    const totalMembers = await Member.countDocuments();
    const issuedBooks = await Issue.countDocuments({ status: "issued" });
    const returnedBooks = await Issue.countDocuments({ status: "returned" });
    
    // Calculate total available books
    const books = await Book.find();
    const availableBooks = books.reduce((sum, book) => sum + book.availableQuantity, 0);

    res.status(200).json({
      success: true,
      data: {
        totalBooks,
        totalMembers,
        issuedBooks,
        returnedBooks,
        availableBooks,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching dashboard statistics",
      error: error.message,
    });
  }
};