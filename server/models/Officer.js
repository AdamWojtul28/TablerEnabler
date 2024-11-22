import mongoose from "mongoose";

const officerSchema = new mongoose.Schema({
  org_name: { type: String, required: true },
  ufl_email: { type: String, required: true },
  position: { type: String, required: true, default: "Board Member" },
  createdAt: { type: Date, default: Date.now },
});

officerSchema.index({ org_name: 1, ufl_email: 1 }, { unique: true });

const Officer = mongoose.model("Officer", officerSchema);
export default Officer;
