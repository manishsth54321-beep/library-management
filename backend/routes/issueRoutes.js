import express from "express";
import {
  getAllIssues,
  getIssueById,
  issueBook,
  returnBook,
  updateIssue,
  deleteIssue,
  getDashboardStats,
} from "../controllers/issueController.js";

const router = express.Router();

// Get dashboard statistics
router.get("/stats/dashboard", getDashboardStats);

// Get all issues & create new issue
router.route("/").get(getAllIssues).post(issueBook);

// Return a book
router.put("/:id/return", returnBook);

// Get, update, delete single issue
router.route("/:id").get(getIssueById).put(updateIssue).delete(deleteIssue);

export default router;