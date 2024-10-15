import mongoose from "mongoose";

const tablingReservationSchema = new mongoose.Schema({
  _id: { type: Number, required: true },
  student_org_id: { type: Number, required: true },
  start_time: { type: Date, required: true },
  end_time: { type: Date, required: true },
  location: { type: String, required: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const TablingReservation = mongoose.model("TablingReservation", tablingReservationSchema);
export default TablingReservation;