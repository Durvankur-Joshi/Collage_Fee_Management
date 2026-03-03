import express from "express";
import { 
  createStudent, 
  getAllStudents, 
  getStudentSummary,
  sendFeeReminder,
  getCurrentStudent 
} from "../controllers/studentController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Admin routes
router.post("/", protect, authorizeRoles("admin"), createStudent);
router.get("/", protect, authorizeRoles("admin", "accountant"), getAllStudents);

// IMPORTANT: /me must come BEFORE /:id routes
router.get(
  "/me", 
  protect, 
  authorizeRoles("student"),
  getCurrentStudent
);

// Student summary - accessible by all authenticated users
router.get(
  "/:id/summary",
  protect,
  authorizeRoles("admin", "accountant", "student"),
  getStudentSummary
);

// Admin only - send reminder
router.post(
  "/:id/send-reminder",
  protect,
  authorizeRoles("admin"),
  sendFeeReminder
);

export default router;