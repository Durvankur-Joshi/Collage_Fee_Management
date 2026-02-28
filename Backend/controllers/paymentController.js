import Payment from "../models/Payment.js";
import sendEmail from "../utils/sendEmail.js";
import Student from "../models/Student.js";
import User from "../models/userModel.js";

export const addPayment = async (req, res) => {
  try {
    const payment = await Payment.create(req.body);

    // Get student details
    const student = await Student.findById(payment.student).populate("user");

    const email = student.user.email;

    // Send email
    await sendEmail(
      email,
      "Payment Confirmation",
      `Hello ${student.user.name},

Your payment of ₹${payment.amountPaid} has been successfully received.

Transaction ID: ${payment.transactionId}

Thank you.`
    );

    res.status(201).json({
      message: "Payment added & email sent successfully",
      payment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPayments = async (req, res) => {
  const payments = await Payment.find().populate({
    path: "student",
    populate: { path: "user", select: "-password" },
  });

  res.json(payments);
};