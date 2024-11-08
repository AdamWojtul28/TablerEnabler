import express from "express";
import StudentProfile from "../models/StudentProfile.js";
import OrganizationProfile from "../models/OrganizationProfile.js";
import bcrypt from "bcrypt";
import Joi from "joi";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { identifier, password, role } = req.body;

    const { error } = validateLogin({ identifier, password, role });
    if (error) return res.status(400).send({ message: error.details[0].message });

    let user;
    if (role === "student") {
      user = await StudentProfile.findOne({ ufl_email: identifier });
    } else if (role === "organization") {
      user = await OrganizationProfile.findOne({ name: identifier });
    }

    if (!user) return res.status(401).send({ message: "Invalid credentials" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).send({ message: "Invalid credentials" });

    const token = user.generateAuthToken();
    
    // Sending back user details along with token
    const userData = {
      name: user.first_name || user.name, // Assuming `first_name` for students and `name` for organizations
      email: user.ufl_email || user.email  // Assuming `ufl_email` for students and `email` for organizations if available
    };
    
    res.status(200).send({ data: token, user: userData, message: "Logged in successfully" });
  } catch (error) {
    console.error("Error in /auth route:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// Validation schema
const validateLogin = (data) => {
  const schema = Joi.object({
    identifier: Joi.string().required().label("Email or Organization Name"),
    password: Joi.string().required().label("Password"),
    role: Joi.string().valid("student", "organization").required().label("Role"),
  });
  return schema.validate(data);
};

export default router;
