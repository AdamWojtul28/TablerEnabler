import mongoose from "mongoose";

const tablingReservationSchema = new mongoose.Schema({
  event_name: { type: String, required: true },
  event_type: { type: String, required: true },
  groups: { type: String, required: true },
  first_contact: { type: String, required: true },
  first_contact_fax: { type: String, required: false },
  first_contact_phone_number: { type: String, required: true },
  first_contact_email_address: { type: String, required: true },
  event_description: { type: String, required: true },
  // advertisement info
  event_advertisement: { type: String, required: true },
  event_advertisement_info: { type: String, required: false },
  gatorconnect_permit: { type: String, required: false },
  // collab info
  collaborating_bool: { type: Boolean, required: true },
  collaborating_orgs: { type: String, required: false },
  // if need tables
  tables_needed: { type: Number, required: false },
  // org name
  org_name: { type: String, required: true },
  // org name
  payment_method: { type: String, required: true },
  // location name is official since it is done through EMS
  location_name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const TablingReservation = mongoose.model(
  "TablingReservation",
  tablingReservationSchema
);
export default TablingReservation;
