import express from "express";
import ReservationTag from "../models/ReservationTag.js";
import StudentProfile from "../models/StudentProfile.js";
import TablingReservation from "../models/TablingReservation.js";
import FavoriteOrg from "../models/FavoriteOrg.js";
import OrganizationProfile from "../models/OrganizationProfile.js";
import OrgSocial from "../models/OrgSocial.js";

const router = express.Router();

// ********************************** FAVORITE-ORGS ROUTES **********************************
router.get("/favorite-organizations", async (req, res) => {
  try {
    const allFavs = await FavoriteOrg.find();
    res.status(200).json(allFavs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/favorite-organization", async (req, res) => {
  try {
    // console.log("Raw Body:", req.body); - can use this line to see if request goes through
    const { org_name, gator_id, createdAt } = req.body;
    const newFavoriteOrg = new FavoriteOrg({
      org_name,
      gator_id,
      createdAt: createdAt || undefined,
    });
    await newFavoriteOrg.save();
    res.status(201).json(newFavoriteOrg);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ********************************** ORG-PROFILE ROUTES **********************************

router.get("/organization-profiles", async (req, res) => {
  try {
    const allOrgs = await OrganizationProfile.find();
    res.status(200).json(allOrgs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/organization-profile", async (req, res) => {
  try {
    // console.log("Raw Body:", req.body); - can use this line to see if request goes through
    const { name, description, profile_image, createdAt } = req.body;
    const newOrganizationProfile = new OrganizationProfile({
      name,
      description,
      profile_image: profile_image || null,
      createdAt: createdAt || undefined,
    });
    await newOrganizationProfile.save();
    res.status(201).json(newOrganizationProfile);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ********************************** ORG-SOCIAL ROUTES **********************************

router.get("/organization-socials", async (req, res) => {
  try {
    const allSocials = await OrgSocial.find();
    res.status(200).json(allSocials);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/organization-social", async (req, res) => {
  try {
    // console.log("Raw Body:", req.body); - can use this line to see if request goes through
    const { org_name, application_name, application_link } = req.body;
    const newOrgSocial = new OrgSocial({
      org_name,
      application_name,
      application_link,
    });
    await newOrgSocial.save();
    res.status(201).json(newOrgSocial);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ********************************** RESERVATION-TAGS ROUTES **********************************

router.get("/reservation-tags", async (req, res) => {
  try {
    const allTags = await ReservationTag.find();
    res.status(200).json(allTags);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new tag for a tabling event
router.post("/reservation-tag", async (req, res) => {
  try {
    const { reservation_id, tag_description } = req.body;
    const newTag = new ReservationTag({
      reservation_id,
      tag_description,
    });
    await newTag.save();
    res.status(201).json(newTag);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ********************************** STUDENT PROFILE ROUTES **********************************

router.get("/student-profiles", async (req, res) => {
  try {
    const allStudentProfiles = await StudentProfile.find();
    res.status(200).json(allStudentProfiles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new student profile
router.post("/student-profile", async (req, res) => {
  try {
    // console.log("Raw Body:", req.body); - can use this line to see if request goes through
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

// ********************************** TABLING RESERVATIONS ROUTES **********************************

// Fetch all tabling reservations
router.get("/tabling-reservations", async (req, res) => {
  try {
    const events = await TablingReservation.find();
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new tabling reservation
router.post("/tabling-reservation", async (req, res) => {
  try {
    const { org_name, start_time, end_time, location, description, createdAt } =
      req.body;
    const newReservation = new TablingReservation({
      org_name,
      start_time,
      end_time,
      location,
      description: description || "",
      createdAt: createdAt || undefined,
    });
    await newReservation.save();
    res.status(201).json(newReservation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
