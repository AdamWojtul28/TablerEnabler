import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import generalRoutes from "./routes/general.js";
import studentRoutes from "./routes/studentRoutes.js";
//import organizationRoutes from "./routes/organizationRoutes.js";
import authRoutes from "./routes/authRoutes.js";



// data imports from models for user schema and tabling schema
// data imports from data folder if we will populate tabling events manually



/* CONFIGURATION */
dotenv.config();
const app = express();
//app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(cors());

// Middleware
const corsOptions = {
  origin: "http://localhost:3000" // frontend URI (ReactJS)
};
app.use(express.json());
app.use(cors(corsOptions));

/* ROUTES */
app.use("/general", generalRoutes);
app.use("/studentRoutes", studentRoutes);
//app.use("/organizationRoutes", organizationRoutes);
app.use("/authRoutes", authRoutes);

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 9000;
mongoose.connect(process.env.MONGODB_URI, {
  }).then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

    /* ADD DATA HERE BUT ONLY ONE TIME So after we add data shema to mongodb we will comment out these lines*/
  })
  .catch((error) => console.log(`${error} did not connect`));