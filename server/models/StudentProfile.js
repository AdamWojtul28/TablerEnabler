import mongoose from "mongoose";

const studentProfileSchema = new mongoose.Schema({
  gator_id: { type: Number, required: true, unique: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  ufl_email: { type: String, required: true, unique: true },
  profile_image: { type: Buffer, default: null },
  createdAt: { type: Date, default: Date.now },
});

const StudentProfile = mongoose.model("StudentProfile", studentProfileSchema);
export default StudentProfile;
