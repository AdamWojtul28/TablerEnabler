import mongoose from "mongoose";

const reservationTagSchema = new mongoose.Schema({
  tag_id: { type: Number, required: true },
  reservation_id: { type: Number, required: true },
  tag_description: { type: String, required: true }
});

const ReservationTag = mongoose.model("ReservationTag", reservationTagSchema);
export default ReservationTag;