import mongoose from "mongoose";

const organizationSocialsSchema = new mongoose.Schema({
  org_social_id: { type: Number, required: true },
  application_name: { type: String, required: true },
  application_link: { type: String, required: true }
});

const OrgSocials = mongoose.model("OrgSocials", organizationSocialsSchema);
export default OrgSocials;