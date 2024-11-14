import mongoose from "mongoose";

const favoriteOrganizationsSchema = new mongoose.Schema({
  org_name: { type: String, required: true },
  ufl_email: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

favoriteOrganizationsSchema.index(
  { org_name: 1, ufl_email: 1 },
  { unique: true }
);

const FavoriteOrg = mongoose.model("FavoriteOrg", favoriteOrganizationsSchema);
export default FavoriteOrg;
