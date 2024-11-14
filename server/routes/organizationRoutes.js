import express from "express"; 
import OrganizationProfile, { validate } from "../models/OrganizationProfile.js";
import bcrypt from "bcrypt";
import auth from "../middleware/authenticationMiddleware.js";

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        console.log("Received request for organization registration:", req.body);

        const { error } = validate(req.body);
        if (error) {
            console.error("Validation error:", error.details[0].message);
            return res.status(400).send({ message: error.details[0].message });
        }

        const existingOrg = await OrganizationProfile.findOne({ name: req.body.name });
        if (existingOrg) {
            console.log("Organization name already exists:", req.body.name);
            return res.status(409).send({ message: "Organization name already exists!" });
        }

        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashPassword = await bcrypt.hash(req.body.password, salt);

        const newOrg = new OrganizationProfile({ 
            name: req.body.name, 
            password: hashPassword, 
            role: "organization" 
        });

        await newOrg.save();
        console.log("Organization saved successfully:", newOrg);

        const token = newOrg.generateAuthToken();
        console.log("Token generated for new organization.");
        res.status(201).send({ data: token, message: "Organization account created successfully" });
    } catch (error) {
        console.error("Error during organization registration:", error);
        res.status(500).send({ message: error.message }); // Send full error message temporarily
    }
});


export default router;
