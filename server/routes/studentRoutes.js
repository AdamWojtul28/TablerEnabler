import express from "express"; 
import StudentProfile, { validate } from "../models/StudentProfile.js";
import bcrypt from "bcrypt"; 
import auth from "../middleware/authenticationMiddleware.js";

const router = express.Router();

// Register new student
router.post("/", async (req, res) => {
    try {
        const { error } = validate(req.body);
        if (error) return res.status(400).send({ message: error.details[0].message });

        const user = await StudentProfile.findOne({ ufl_email: req.body.ufl_email });
        if (user) return res.status(409).send({ message: "User with given email already exists!" });

        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashPassword = await bcrypt.hash(req.body.password, salt);

        const newUser = new StudentProfile({ ...req.body, password: hashPassword });
        await newUser.save();

        const token = newUser.generateAuthToken();
        res.status(201).send({ data: token, message: "Student account created successfully" });
    } catch (error) {
        console.error("Error in /api/students route:", error); 
        res.status(500).send({ message: "Internal Server Error new student" });
    }
});

// Get student profile
router.get("/me", auth, async (req, res) => {
    try {
        const user = await StudentProfile.findById(req.user._id).select("-password");
        res.send(user);
    } catch (error) {
        console.error("Error fetching user profile:", error); 
        res.status(500).send({ message: "Internal Server Error get student profile" });
    }
});

export default router;
