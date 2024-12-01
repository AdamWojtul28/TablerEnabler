// server.js

import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import generalRoutes from "./routes/general.js";
import studentRoutes from "./routes/studentRoutes.js";
import organizationRoutes from "./routes/organizationRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import path from 'path';
import { fileURLToPath } from 'url'; // Correctly import fileURLToPath

// Define __dirname and __filename for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Data imports
import StudentProfile from "./models/StudentProfile.js";
import { dataUser } from "./data/index.js";

dotenv.config();
const app = express();

// Security and logging middleware
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// CORS configuration
const corsOptions = {
  origin: "http://localhost:3000" // Replace with your frontend URI
};
app.use(cors(corsOptions));

// JSON parsing (redundant with bodyParser)
app.use(express.json());

/* ROUTES */
app.use("/general", generalRoutes);
app.use("/students", studentRoutes);
app.use("/organizations", organizationRoutes);
app.use("/auth", authRoutes);

// Serve static files from 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 9000;
mongoose.connect(process.env.MONGODB_URI, {})
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));

    /* Insert only once */
    // StudentProfile.insertMany(dataUser)
  })
  .catch((error) => console.log(`${error} did not connect`));
