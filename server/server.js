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
  origin: "http://localhost:3000" // Replace with frontend URI
};
app.use(cors(corsOptions));

// JSON parsing
app.use(express.json());

/* ROUTES */
app.use("/api/general", generalRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/organizations", organizationRoutes);
app.use("/api/auth", authRoutes);

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 9000;
mongoose.connect(process.env.MONGODB_URI, {})
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
  })
  .catch((error) => console.log(`${error} did not connect`));
