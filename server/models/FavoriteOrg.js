import mongoose from "mongoose";

const favoriteOrganizationsSchema = new mongoose.Schema({
  student_org_id: { type: Number, required: true },
  gator_id: { type: Number, required: true }
});

const FavoriteOrg = mongoose.model("FavoriteOrg", favoriteOrganizationsSchema);
export default FavoriteOrg;