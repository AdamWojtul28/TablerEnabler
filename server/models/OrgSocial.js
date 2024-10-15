import mongoose from "mongoose";

const organizationSocialsSchema = new mongoose.Schema({
  org_social_id: { type: Number, required: true },
  application_name: { type: String, required: true },
  application_link: { type: String, required: true }
});

organizationSocialsSchema.index({ org_social_id: 1, application_name: 1 }, { unique: true });

const OrgSocial = mongoose.model("OrgSocials", organizationSocialsSchema);
export default OrgSocial;