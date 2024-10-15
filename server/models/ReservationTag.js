import mongoose from "mongoose";

const reservationTagSchema = new mongoose.Schema({
  tag_id: { type: Number, required: true },
  reservation_id: { type: Number, required: true },
  tag_description: { type: String, required: true }
});

reservationTagSchema.index({ tag_id: 1, reservation_id: 1 }, { unique: true });

const ReservationTag = mongoose.model("ReservationTag", reservationTagSchema);
export default ReservationTag;