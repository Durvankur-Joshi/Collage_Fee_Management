import express from "express";
import { createStudent, getAllStudents } from "../controllers/studentController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { getStudentSummary } from "../controllers/studentController.js";
import { sendFeeReminder } from "../controllers/studentController.js";
import { createStudentWithUser } from "../controllers/studentController.js";
import { getCurrentStudent } from "../controllers/studentController.js";

const router = express.Router();

router.post("/", protect, authorizeRoles("admin"), createStudent);
router.get("/", protect, authorizeRoles("admin", "accountant"), getAllStudents);

// This route must come BEFORE the /:id routes
router.get(
  "/me", 
  protect, 
  authorizeRoles("student"),
  getCurrentStudent
);

// Fix: Students should be able to access their own summary
router.get(
  "/:id/summary",
  protect,
  authorizeRoles("admin", "accountant", "student"), // Make sure 'student' is included
  getStudentSummary
);

router.post(
  "/:id/send-reminder",
  protect,
  authorizeRoles("admin"),
  sendFeeReminder
);

router.post(
  "/with-user",
  protect,
  authorizeRoles("admin"),
  createStudentWithUser
);


export default router;