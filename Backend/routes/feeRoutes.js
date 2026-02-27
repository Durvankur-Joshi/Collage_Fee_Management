import express from "express";
import { createFeeStructure, getFeeStructures } from "../controllers/feeContoller.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", protect, authorizeRoles("admin"), createFeeStructure);
router.get("/", protect, getFeeStructures);

export default router;