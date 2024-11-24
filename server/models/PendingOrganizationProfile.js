import mongoose from "mongoose";
import Joi from "joi";

// Define PendingOrganizationProfile Schema
const pendingOrganizationProfileSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: false }, // Optional field
  profile_image: { type: Buffer, required: false }, // Optional profile image
  requestedAt: { type: Date, default: Date.now }, // When the request was made
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  }, // Approval status
  adminComments: { type: String, default: "" }, // Admin's comments for approval/rejection
  officers: [{ type: String, required: true }], // List of officer emails
});

// Email validation function
const emailValidator = (value) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
};

// Unique index on the name field
pendingOrganizationProfileSchema.index({ name: 1 }, { unique: true });

// Model definition
const PendingOrganizationProfile = mongoose.model(
  "PendingOrganizationProfile",
  pendingOrganizationProfileSchema
);

// Validation function
const validatePendingOrganizationProfile = (data) => {
  const schema = Joi.object({
    name: Joi.string().required().label("Name"),
    description: Joi.string().optional().label("Description"),
    profile_image: Joi.any().optional().label("Profile Image"), // Buffer or file
    status: Joi.string()
      .valid("pending", "approved", "rejected")
      .optional()
      .label("Status"),
    adminComments: Joi.string().optional().label("Admin Comments"),
    officers: Joi.array()
      .items(Joi.string().email())
      .optional()
      .label("Officers"),
  });
  return schema.validate(data);
};

export default PendingOrganizationProfile;
export { validatePendingOrganizationProfile };
