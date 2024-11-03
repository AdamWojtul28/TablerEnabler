import express from "express"; 
import StudentProfile from "../models/StudentProfile.js";
import bcrypt from "bcrypt";
import Joi from "joi";

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const { error } = validateLogin(req.body); // Use the renamed function
        if (error) return res.status(400).send({ message: error.details[0].message });

        const user = await StudentProfile.findOne({ ufl_email: req.body.ufl_email });
        if (!user) return res.status(401).send({ message: "Invalid Email or Password" });

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) return res.status(401).send({ message: "Invalid Email or Password" });

        const token = user.generateAuthToken();
        res.status(200).send({ data: token, message: "Logged in successfully" });
    } catch (error) {
        console.error("Error in /api/auth route:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

// Login validation function (renamed to avoid conflict)
const validateLogin = (data) => {
    const schema = Joi.object({
        ufl_email: Joi.string().email().required().label("Email"),
        password: Joi.string().required().label("Password"),
    });
    return schema.validate(data);
};

export default router;
