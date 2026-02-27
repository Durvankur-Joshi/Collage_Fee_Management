import mongoose from "mongoose";

const feeStructureSchema = new mongoose.Schema(
  {
    department: String,
    year: Number,
    semester: Number,
    tuitionFee: Number,
    examFee: Number,
    libraryFee: Number,
    hostelFee: Number,
  },
  { timestamps: true }
);

const FeeStructure = mongoose.model("FeeStructure", feeStructureSchema);

export default FeeStructure;