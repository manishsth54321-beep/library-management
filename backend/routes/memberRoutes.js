import express from "express";
import {
  getAllMembers,
  getMemberById,
  createMember,
  updateMember,
  deleteMember,
} from "../controllers/memberController.js";

const router = express.Router();

// Get all members & create new member
router.route("/").get(getAllMembers).post(createMember);

// Get, update, delete single member
router.route("/:id").get(getMemberById).put(updateMember).delete(deleteMember);

export default router;