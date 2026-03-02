import Student from "../models/Student.js";
import User from "../models/userModel.js";
import Payment from "../models/Payment.js";
import FeeStructure from "../models/FeeStructure.js";
import sendEmail from "../utils/sendEmail.js";

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

    // If user is a student, verify they are accessing their own summary
    if (req.user.role === 'student') {
      const studentRecord = await Student.findOne({ user: req.user._id }); // ✅ Different name
      if (!studentRecord || studentRecord._id.toString() !== studentId) {
        return res.status(403).json({ 
          message: "You can only view your own fee summary" 
        });
      }
    }

    // Now query for the student by ID
    const student = await Student.findById(studentId); // ✅ This works now

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Rest of your code...
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

    const payments = await Payment.find({ student: studentId });
    const totalPaid = payments.reduce((acc, payment) => acc + payment.amountPaid, 0);
    const remaining = totalFee - totalPaid;

    res.json({
      student: student.rollNumber,
      totalFee,
      totalPaid,
      remaining,
    });
  } catch (error) {
    console.error("Error in getStudentSummary:", error);
    res.status(500).json({ message: error.message });
  }
};

export const sendFeeReminder = async (req, res) => {
  try {
    const studentId = req.params.id;

    const student = await Student.findById(studentId).populate("user");

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

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

    const payments = await Payment.find({ student: studentId });

    const totalPaid = payments.reduce(
      (acc, payment) => acc + payment.amountPaid,
      0
    );

    const remaining = totalFee - totalPaid;

    if (remaining <= 0) {
      return res.json({
        message: "Student has no pending dues.",
      });
    }

    await sendEmail(
      student.user.email,
      "Fee Due Reminder",
      `Hello ${student.user.name},

Your total fee is ₹${totalFee}.
Amount paid: ₹${totalPaid}.
Remaining amount: ₹${remaining}.

Please complete your payment as soon as possible.

Thank you.`
    );

    res.json({
      message: "Fee reminder email sent successfully.",
      remaining,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createStudentWithUser = async (req, res) => {
  try {
    const { name, email, password, rollNumber, department, year, semester } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    // Create user with student role
    const user = await User.create({
      name,
      email,
      password,
      role: "student", // Explicitly set role
    });

    // Create student profile
    const student = await Student.create({
      user: user._id,
      rollNumber,
      department,
      year,
      semester,
    });

    // Populate user data for response
    const populatedStudent = await Student.findById(student._id).populate("user", "-password");

    res.status(201).json({
      message: "Student created successfully",
      student: populatedStudent,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get current student profile for logged-in student
export const getCurrentStudent = async (req, res) => {
  try {
    // Find student associated with the logged-in user
    const student = await Student.findOne({ user: req.user._id })
      .populate("user", "-password");
    
    if (!student) {
      return res.status(404).json({ 
        message: "Student profile not found. Please contact administrator." 
      });
    }
    
    res.json(student);
  } catch (error) {
    console.error("Error in getCurrentStudent:", error);
    res.status(500).json({ message: error.message });
  }
};