import Student from "../models/Student.js";
import User from "../models/userModel.js";
import Payment from "../models/Payment.js";
import FeeStructure from "../models/FeeStructure.js";

export const createStudent = async (req, res) => {
  try {
    const { user, rollNumber, department, year, semester } = req.body;

    // Check if user exists
    const existingUser = await User.findById(user);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const student = await Student.create({
      user,
      rollNumber,
      department,
      year,
      semester,
    });

    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllStudents = async (req, res) => {
  const students = await Student.find().populate("user", "-password");
  res.json(students);
};

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Get student summary (fees and payments)
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export const getStudentSummary = async (req, res) => {
  try {
    const studentId = req.params.id;

    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Find fee structure
    const feeStructure = await FeeStructure.findOne({
      department: student.department,
      year: student.year,
      semester: student.semester,
    });

    if (!feeStructure) {
      return res.status(404).json({ message: "Fee structure not found" });
    }

    const totalFee =
      feeStructure.tuitionFee +
      feeStructure.examFee +
      feeStructure.libraryFee +
      feeStructure.hostelFee;

    // Get payments
    const payments = await Payment.find({ student: studentId });

    const totalPaid = payments.reduce(
      (acc, payment) => acc + payment.amountPaid,
      0
    );

    const remaining = totalFee - totalPaid;

    res.json({
      student: student.rollNumber,
      totalFee,
      totalPaid,
      remaining,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};