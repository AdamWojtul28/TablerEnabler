import express from "express";
import StudentProfile from "../models/StudentProfile.js";
import OrganizationProfile from "../models/OrganizationProfile.js";
import bcrypt from "bcrypt";
import Joi from "joi";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { identifier, password } = req.body; // Removed `role` from destructuring

    // Validate input
    const { error } = validateLogin({ identifier, password });
    if (error) return res.status(400).send({ message: error.details[0].message });

    let user = null;
    let role = null;

    // Check if the user exists in the student collection
    user = await StudentProfile.findOne({ ufl_email: identifier });
    if (user) {
      role = "student";
    } else {
      // If not found, check in the organization collection
      user = await OrganizationProfile.findOne({ name: identifier });
      if (user) {
        role = "organization";
      }
    }

    // If no user is found, return an error
    if (!user) return res.status(401).send({ message: "Invalid credentials" });

    // Verify the password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).send({ message: "Invalid credentials" });

    // Generate the token
    const token = user.generateAuthToken();

    // Respond with the user details, role, and token
    const userData = {
      name: user.first_name || user.name, // Use `first_name` for students, `name` for organizations
      email: user.ufl_email || user.email, // Use `ufl_email` for students, `email` for organizations
      role, // Include the determined role
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
  });
  return schema.validate(data);
};


export default router;
