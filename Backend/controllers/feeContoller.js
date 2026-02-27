import FeeStructure from "../models/FeeStructure.js";

export const createFeeStructure = async (req, res) => {
  try {
    const fee = await FeeStructure.create(req.body);
    res.status(201).json(fee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFeeStructures = async (req, res) => {
  const fees = await FeeStructure.find();
  res.json(fees);
};