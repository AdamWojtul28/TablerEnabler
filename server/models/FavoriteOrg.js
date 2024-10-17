import mongoose from "mongoose";

const favoriteOrganizationsSchema = new mongoose.Schema({
  org_name: { type: String, required: true },
  gator_id: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

favoriteOrganizationsSchema.index(
  { org_name: 1, gator_id: 1 },
  { unique: true }
);

const FavoriteOrg = mongoose.model("FavoriteOrg", favoriteOrganizationsSchema);
export default FavoriteOrg;
