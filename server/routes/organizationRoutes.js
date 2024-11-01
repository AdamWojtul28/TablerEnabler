// import express from "express"; 
// import OrganizationProfile, { Organization, validate } from "../models/OrganizationProfile"; 
// import bcrypt from "bcrypt"; 
// import auth from "../middleware/authenticationMiddleware.js";

// const router = express.Router();

// // Register new user
// router.post("/", async (req, res) => {
//     try {
//         const { error } = validate(req.body);
//         if (error)
//             return res.status(400).send({ message: error.details[0].message });

//         const user = await Organization.findOne({ email: req.body.email });
//         if (user)
//             return res
//                 .status(409)
//                 .send({ message: "User with given email already exists!" });

//         const salt = await bcrypt.genSalt(Number(process.env.SALT));
//         const hashPassword = await bcrypt.hash(req.body.password, salt);

//         const newUser = new OrganizationProfile({ ...req.body, password: hashPassword });
//         await newUser.save();

//         const token = newUser.generateAuthToken();
//         res.status(201).send({ data: token, message: "User created successfully" });
//     } catch (error) {
//         res.status(500).send({ message: "Internal Server Error" });
//     }
// });

// router.get("/me", auth, async (req, res) => {
//     const user = await User.findById(req.user._id).select("-password");
//     res.send(user);
// });


// export default router;
