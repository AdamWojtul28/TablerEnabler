import express from "express";
import ReservationTag from "../models/ReservationTag.js";
import StudentProfile from "../models/StudentProfile.js";
import TablingReservation from "../models/TablingReservation.js";
import FavoriteOrg from "../models/FavoriteOrg.js";
import OrganizationProfile from "../models/OrganizationProfile.js";
import OrgSocial from "../models/OrgSocial.js";
import FixedTablingLocs from "../models/FixedTablingLocations.js";

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

// ********************************** FIXED-TABLING-LOCATIONS ROUTES **********************************
router.post("/fixed-location", async (req, res) => {
  try {
    // console.log("Raw Body:", req.body); - can use this line to see if request goes through
    const { name, location } = req.body;
    const newFixedLoc = new FixedTablingLocs({
      name,
      location,
    });
    await newFixedLoc.save();
    res.status(201).json(newFixedLoc);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/fixed-locations", async (req, res) => {
  try {
    const fixedLocations = await FixedTablingLocs.find();
    res.status(200).json(fixedLocations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// get specific student based on the gator_id passed in the request query parameter
router.get("/fixed-location", async (req, res) => {
  const { name } = req.query; // Extract from request
  try {
    const specificLocation = await FixedTablingLocs.find({
      // This assumes that `date` is stored as a full Date object in the schema.
      name: {
        $eq: name,
      },
    });
    res.status(200).json(specificLocation);
  } catch (error) {
    res.status(500).json({ error: error.message });
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

// extract all of the profile informations for organizations that a student (gator_id passed in as query parameter) has marked as favorite
router.get("/favorite-organization-profiles", async (req, res) => {
  const { gator_id } = req.query; // Extract from request
  try {
    const relevantOrgs = await FavoriteOrg.find(
      {
        // This assumes that `date` is stored as a full Date object in the schema.
        gator_id: {
          $eq: gator_id,
        },
      },
      "org_name"
    );
    // extracts all of the org_names that the student with passed in gator_id has marked as favorite

    const relevantOrgNames = relevantOrgs.map((org) => org.org_name);
    // extract only the names of the organizations and store them in a string array so they can be used in the next query

    const studentFavoriteOrgs = await OrganizationProfile.find({
      name: { $in: relevantOrgNames },
    });
    // extract the profile information of the clubs that the student has marked as favorite

    res.status(200).json(studentFavoriteOrgs);
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

// get specific student based on the gator_id passed in the request query parameter
router.get("/student-profile", async (req, res) => {
  const { gator_id } = req.query; // Extract from request
  try {
    const specificStudent = await StudentProfile.find({
      // This assumes that `date` is stored as a full Date object in the schema.
      gator_id: {
        $eq: gator_id,
      },
    });
    res.status(200).json(specificStudent);
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

// Fetch live tabling reservations (live events)
router.get("/live-tabling-events", async (req, res) => {
  try {
    const now = new Date();

    // Find all events where the start_time is before now and end_time is after now
    const liveEvents = await TablingReservation.find({
      start_time: { $lte: now }, // Events that have started
      end_time: { $gte: now }, // Events that haven't ended yet
    });

    // If no live events are found, return a message
    if (liveEvents.length === 0) {
      return res
        .status(200)
        .json({ message: "No live events happening right now", events: [] });
    }

    // Return live events
    res.status(200).json({ events: liveEvents });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch live tabling events" });
  }
});

// Fetch all tabling reservations taking place today
router.get("/tabling-reservations-today", async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0); // Set time to the start of the day (00:00:00)

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999); // Set time to the end of the day (23:59:59)

    const liveEvents = await TablingReservation.find({
      // This assumes that `date` is stored as a full Date object in the schema.
      start_time: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });
    res.status(200).json(liveEvents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Fetch all tabling reservations taking place on a given day
router.get("/tabling-reservations-day", async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0); // Set time to the start of the day (00:00:00)

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999); // Set time to the end of the day (23:59:59)

    const liveEvents = await TablingReservation.find({
      // This assumes that `date` is stored as a full Date object in the schema.
      start_time: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });
    res.status(200).json(liveEvents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
