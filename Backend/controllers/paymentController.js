import Payment from "../models/Payment.js";

export const addPayment = async (req, res) => {
  try {
    const payment = await Payment.create(req.body);
    res.status(201).json(payment);
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