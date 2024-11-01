import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import Joi from "joi";
import passwordComplexity from "joi-password-complexity";

const studentProfileSchema = new mongoose.Schema({
  gator_id: { type: Number, required: true, unique: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  ufl_email: { type: String, required: true, unique: true },
  profile_image: { type: Buffer, default: null },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  role: { type: String, enum: ['student', 'admin', 'organization'], default: 'student' }
});

const StudentProfile = mongoose.model("StudentProfile", studentProfileSchema);

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


studentProfileSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
      {
          _id: this._id,
          gator_id: this.gator_id,
          first_name: this.first_name,
          last_name: this.last_name,
          role: this.role // Include role in the token
      },
      process.env.JWTPRIVATEKEY,
      { expiresIn: "7d" }
  );
  return token;
};

const Student = mongoose.model("Student", studentProfileSchema);

const validate = (data) => {
    const schema = Joi.object({
      first_name: Joi.string().required().label("First Name"),
      last_name: Joi.string().required().label("Last Name"),
      ufl_email: Joi.string().email().required().label("Email"),
      password: passwordComplexity(complexityOptions).required().label("Password"),
      role: Joi.string().valid('student').optional() // Validate role field
    });
    return schema.validate(data);
};

export { Student, validate }; // Use named exports

export default StudentProfile;
