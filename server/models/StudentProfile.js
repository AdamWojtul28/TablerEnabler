import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import Joi from "joi";
import passwordComplexity from "joi-password-complexity";

const studentProfileSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  ufl_email: { type: String, required: true, unique: true },
  profile_image: { type: Buffer, default: null },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  role: { type: String, enum: ['student'], default: 'student' }
});

// Define password complexity options
const complexityOptions = {
  min: 4,
  max: 30,
  lowerCase: 0,
  upperCase: 0,
  numeric: 0,
  symbol: 0,
  requirementCount: 1,
};

// Method to generate auth token
studentProfileSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
      {
          _id: this._id,
          first_name: this.first_name,
          last_name: this.last_name,
          role: this.role
      },
      process.env.JWTPRIVATEKEY,
      { expiresIn: "7d" }
  );
  return token;
};

const StudentProfile = mongoose.model("StudentProfile", studentProfileSchema);

// Validation function
const validate = (data) => {
  const schema = Joi.object({
      first_name: Joi.string().required().label("First Name"),
      last_name: Joi.string().required().label("Last Name"),
      ufl_email: Joi.string().email().required().label("Email"),
      password: passwordComplexity(complexityOptions).required().label("Password"),
      role: Joi.string().valid('student', 'organization').optional().label("Role")
  });
  return schema.validate(data);
};

export { StudentProfile, validate };
export default StudentProfile;
