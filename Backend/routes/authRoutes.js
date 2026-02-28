import express from "express";
import { register, login, createUserByAdmin  } from "../controllers/authContoller.js";
import  { authorizeRoles } from "../middleware/roleMiddleware.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post(
  "/create-user",
  protect,
  authorizeRoles("admin"),
  createUserByAdmin
);

export default router;