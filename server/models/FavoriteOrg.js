import mongoose from "mongoose";

const favoriteOrganizationsSchema = new mongoose.Schema({
  student_org_id: { type: Number, required: true },
  gator_id: { type: Number, required: true }
});

favoriteOrganizationsSchema.index({ student_org_id: 1, gator_id: 1 }, { unique: true });

const FavoriteOrg = mongoose.model("FavoriteOrg", favoriteOrganizationsSchema);
export default FavoriteOrg;