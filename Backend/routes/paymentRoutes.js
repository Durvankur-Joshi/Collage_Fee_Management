import express from "express";
import { addPayment, getPayments } from "../controllers/paymentController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", protect, authorizeRoles("accountant"), addPayment);
router.get("/", protect, authorizeRoles("admin", "accountant"), getPayments);

export default router;