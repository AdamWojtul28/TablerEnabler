import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import Joi from "joi";
import passwordComplexity from "joi-password-complexity";

const organizationProfileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  profile_image: { type: Buffer, required: false },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  role: { type: String, enum: ['student', 'admin', 'organization'], default: 'organization' }
});

organizationProfileSchema.index({ name: 1 }, { unique: true });

const OrganizationProfile = mongoose.model(
  "OrganizationProfile",
  organizationProfileSchema
);

// Define password complexity options
const complexityOptions = {
  min: 4, // Minimum length
  max: 30, // Maximum length
  lowerCase: 0, // Minimum number of lowercase letters
  upperCase: 0, // Minimum number of uppercase letters
  numeric: 0, // Minimum number of numeric characters
  symbol: 0, // Minimum number of special characters
  requirementCount: 1, // Number of complexity requirements to enforce (out of the above)
};


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

const Organization = mongoose.model("Organization", organizationProfileSchema);

const validate = (data) => {
    const schema = Joi.object({
      name: Joi.string().required().label("Name"),
      password: passwordComplexity(complexityOptions).required().label("Password"),
      role: Joi.string().valid('organization').optional() // Validate role field
    });
    return schema.validate(data);
};


export default OrganizationProfile;
export { Organization, validate };