import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rollNumber: {
      type: String,
      required: true,
      unique: true,
    },
    department: String,
    year: Number,
    semester: Number,
  },
  { timestamps: true }
);

const Student = mongoose.model("Student", studentSchema);

export default Student;