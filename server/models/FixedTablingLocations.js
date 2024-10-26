import mongoose from "mongoose";

const fixedTablingLocationsSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  location: { type: String, required: true, unique: true },
});

const FixedTablingLocs = mongoose.model(
  "FixedTablingLocations",
  fixedTablingLocationsSchema
);
export default FixedTablingLocs;
