import express from "express";
import FavoriteOrg from "../models/FavoriteOrg"
import StudentOrg from "../models/OrganizationProfile"
import OrgSocial from "../models/OrgSocial"
import ReservationTag from "../models/ReservationTag"
import StudentProfile from "../models/StudentProfile";
import TablingReservation from "../models/TablingReservation";

const router = express.Router();



// Create a new tag for a tabling event
router.post("/create-tag", async (req, res) => {
    try {
      const { tag_id, reservation_id, tag_description} = req.body;
      const newTag = new ReservationTag({
        tag_id, 
        reservation_id, 
        tag_description
      });
      await newTag.save();
      res.status(201).json(newTag);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
});



// Create a new tag for a tabling event
router.post("/create-tag", async (req, res) => {
    try {
      const { tag_id, reservation_id, tag_description} = req.body;
      const newTag = new ReservationTag({
        tag_id, 
        reservation_id, 
        tag_description
      });
      await newTag.save();
      res.status(201).json(newTag);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
});
  
// TABLING RESERVATIONS

// Fetch all tabling reservations
router.get("/events", async (req, res) => {
    try {
      const events = await TablingReservation.find();
      res.status(200).json(events);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

// Create a new tabling reservation
router.post("/create-reservation", async (req, res) => {
    try {
      const { reservation_id, student_org_id, start_time, end_time, location, description } = req.body;
      const newReservation = new TablingReservation({
        reservation_id, 
        student_org_id, 
        start_time, 
        end_time, 
        location,
        description
      });
      await newReservation.save();
      res.status(201).json(newReservation);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
});

export default router;