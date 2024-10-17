import mongoose from "mongoose";

const organizationProfileSchema = new mongoose.Schema({
    _id: { type: Number, required: true },
    description: { type: String, required: true },
    profile_image: { type: Array, required: true },
    createdAt: { type: Date, default: Date.now }
});

const StudentOrg = mongoose.model("StudentOrg", organizationProfileSchema);
export default StudentOrg;