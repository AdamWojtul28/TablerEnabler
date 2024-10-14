import mongoose from "mongoose";

const studentProfileSchema = new mongoose.Schema({
    gator_id: { type: Number, required: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    ufl_email: { type: String, required: true },
    profile_image: { type: Mixed, required: true },
    createdAt: { type: Date, default: Date.now }
});

const StudentProfile = mongoose.model("StudentProfile", studentProfileSchema);
export default StudentProfile;