import mongoose from "mongoose";

const organizationProfileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  profile_image: { type: Buffer, required: false },
  createdAt: { type: Date, default: Date.now },
});

organizationProfileSchema.index({ name: 1 }, { unique: true });

const OrganizationProfile = mongoose.model(
  "OrganizationProfile",
  organizationProfileSchema
);
export default OrganizationProfile;
