import mongoose from "mongoose";

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    enum: ["admin", "accountant", "student"],
    required: true,
    unique: true
  },
  permissions: {
    type: [String],
    default: []
  }
}, { timestamps: true });

export default mongoose.model("Role", roleSchema);