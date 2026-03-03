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


// ============================================
// STUDENT SUMMARY - COMPLETELY REWRITTEN
// ============================================
export const getStudentSummary = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("🔍 Fetching summary for student ID:", id);

    // 1. Find the student with populated user data
    const student = await Student.findById(id).populate('user', 'name email');
    
    if (!student) {
      console.log("❌ Student not found in database");
      return res.status(404).json({ 
        success: false,
        message: "Student not found" 
      });
    }

    console.log("✅ Student found:", {
      id: student._id,
      rollNumber: student.rollNumber,
      department: student.department,
      year: student.year,
      semester: student.semester
    });

    // 2. Find fee structure for this student
    const feeStructure = await FeeStructure.findOne({
      department: student.department,
      year: student.year,
      semester: student.semester
    });

    if (!feeStructure) {
      console.log("❌ No fee structure found for:", {
        department: student.department,
        year: student.year,
        semester: student.semester
      });
      return res.status(404).json({ 
        success: false,
        message: "Fee structure not found for this student's department/year/semester" 
      });
    }

    console.log("✅ Fee structure found:", {
      tuitionFee: feeStructure.tuitionFee,
      examFee: feeStructure.examFee,
      libraryFee: feeStructure.libraryFee,
      hostelFee: feeStructure.hostelFee
    });

    // 3. Calculate total fee
    const totalFee = 
      (feeStructure.tuitionFee || 0) + 
      (feeStructure.examFee || 0) + 
      (feeStructure.libraryFee || 0) + 
      (feeStructure.hostelFee || 0);

    // 4. Find all payments for this student
    const payments = await Payment.find({ 
      student: student._id,
      status: "completed" 
    }).sort({ createdAt: -1 });

    console.log(`✅ Found ${payments.length} payments for student`);

    // 5. Calculate total paid
    const totalPaid = payments.reduce((sum, payment) => sum + (payment.amountPaid || 0), 0);
    
    // 6. Calculate remaining
    const remaining = Math.max(0, totalFee - totalPaid);

    // 7. Prepare response
    const summary = {
      success: true,
      student: {
        id: student._id,
        rollNumber: student.rollNumber,
        name: student.user?.name || "Unknown",
        email: student.user?.email || "Unknown",
        department: student.department,
        year: student.year,
        semester: student.semester
      },
      feeDetails: {
        tuitionFee: feeStructure.tuitionFee || 0,
        examFee: feeStructure.examFee || 0,
        libraryFee: feeStructure.libraryFee || 0,
        hostelFee: feeStructure.hostelFee || 0,
        totalFee: totalFee
      },
      paymentSummary: {
        totalPaid: totalPaid,
        remaining: remaining,
        paymentCount: payments.length,
        isFullyPaid: remaining === 0,
        hasDue: remaining > 0
      },
      recentPayments: payments.slice(0, 5).map(p => ({
        id: p._id,
        amount: p.amountPaid,
        mode: p.paymentMode,
        transactionId: p.transactionId,
        date: p.createdAt,
        status: p.status
      }))
    };

    console.log("📊 Summary calculated:", {
      totalFee,
      totalPaid,
      remaining,
      paymentCount: payments.length
    });

    res.status(200).json(summary);

  } catch (error) {
    console.error("❌ Error in getStudentSummary:", error);
    res.status(500).json({ 
      success: false,
      message: "Server error while fetching student summary",
      error: error.message 
    });
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