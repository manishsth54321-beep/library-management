import express from "express";
import {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  getCategories,
} from "../controllers/bookController.js";

const router = express.Router();

// Get all books & create new book
router.route("/").get(getAllBooks).post(createBook);

// Get categories
router.get("/categories", getCategories);

// Get, update, delete single book
router.route("/:id").get(getBookById).put(updateBook).delete(deleteBook);

export default router;