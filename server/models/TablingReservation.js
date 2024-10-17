import mongoose from "mongoose";

const tablingReservationSchema = new mongoose.Schema({
  org_name: { type: String, required: true },
  start_time: { type: Date, required: true },
  end_time: { type: Date, required: true },
  location: { type: String, required: true },
  description: { type: String, required: false, default: "" },
  createdAt: { type: Date, default: Date.now },
});

const TablingReservation = mongoose.model(
  "TablingReservation",
  tablingReservationSchema
);
export default TablingReservation;
