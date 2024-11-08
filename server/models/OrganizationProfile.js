import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import Joi from "joi";
import passwordComplexity from "joi-password-complexity";

const organizationProfileSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: false }, // Optional field
  profile_image: { type: Buffer, required: false },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  role: { type: String, enum: ['student', 'admin', 'organization'], default: 'organization' }
});

// Unique index on the name field
organizationProfileSchema.index({ name: 1 }, { unique: true });

// Method to generate auth token
organizationProfileSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      name: this.name,
      role: this.role // Include role in the token
    },
    process.env.JWTPRIVATEKEY,
    { expiresIn: "7d" }
  );
  return token;
};

// Define password complexity options
const complexityOptions = {
  min: 4,
  max: 30,
  lowerCase: 1,
  upperCase: 1,
  numeric: 1,
  symbol: 1,
  requirementCount: 3
};

// Model definition
const OrganizationProfile = mongoose.model("OrganizationProfile", organizationProfileSchema);

// Validation function
const validate = (data) => {
  const schema = Joi.object({
    name: Joi.string().required().label("Name"),
    password: passwordComplexity(complexityOptions).required().label("Password"),
    role: Joi.string().valid('organization').optional() // Validate role field
  });
  return schema.validate(data);
};

export default OrganizationProfile;
export { validate };
