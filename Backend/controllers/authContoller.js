import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
}

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Always default role = student
    const user = await User.create({
      name,
      email,
      password,
      role: "student",
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user._id,
      name: user.name,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
};

export const createUserByAdmin = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!["admin", "accountant"].includes(role)) {
      return res.status(400).json({
        message: "Invalid role selection",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    res.status(201).json({
      message: `${role} created successfully`,
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};