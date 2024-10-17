import express from "express";
import ReservationTag from "../models/ReservationTag.js";
import StudentProfile from "../models/StudentProfile.js";
import TablingReservation from "../models/TablingReservation.js";
import FavoriteOrg from "../models/FavoriteOrg.js";
import StudentOrg from "../models/OrganizationProfile.js";
import OrgSocial from "../models/OrgSocial.js";

const router = express.Router();

// STUDENT PROFILE

// Create a new student profile
router.post("/studentprofile", async (req, res) => {
  try {
    // console.log("Raw Body:", req.body);

    const {
      gator_id,
      first_name,
      last_name,
      ufl_email,
      profile_image,
      createdAt,
    } = req.body;
    const studentProfile = new StudentProfile({
      gator_id,
      first_name,
      last_name,
      ufl_email,
      profile_image: profile_image || null,
      createdAt: createdAt || undefined,
    });
    await studentProfile.save();
    res.status(201).json(studentProfile);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// TAGS

// Create a new tag for a tabling event
router.post("/create-tag", async (req, res) => {
  try {
    const { tag_id, reservation_id, tag_description } = req.body;
    const newTag = new ReservationTag({
      tag_id,
      reservation_id,
      tag_description,
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
    const {
      reservation_id,
      student_org_id,
      start_time,
      end_time,
      location,
      description,
    } = req.body;
    const newReservation = new TablingReservation({
      reservation_id,
      student_org_id,
      start_time,
      end_time,
      location,
      description,
    });
    await newReservation.save();
    res.status(201).json(newReservation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
