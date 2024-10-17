import mongoose, { Mongoose } from "mongoose";

const reservationTagSchema = new mongoose.Schema({
  reservation_id: { type: mongoose.Schema.Types.ObjectId, required: true },
  tag_description: { type: String, required: true },
});

reservationTagSchema.index(
  { reservation_id: 1, tag_description: 1 },
  { unique: true }
);

const ReservationTag = mongoose.model("ReservationTag", reservationTagSchema);
export default ReservationTag;
