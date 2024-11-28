import express from "express";
import ReservationTag from "../models/ReservationTag.js";
import StudentProfile from "../models/StudentProfile.js";
import TablingReservation from "../models/TablingReservation.js";
import FavoriteOrg from "../models/FavoriteOrg.js";
import OrganizationProfile from "../models/OrganizationProfile.js";
import OrgSocial from "../models/OrgSocial.js";
import FixedTablingLocs from "../models/FixedTablingLocations.js";
import TablingReservationRequest from "../models/TablingReservation.js";
import bcrypt from "bcrypt";
import PendingOrganizationProfile from "../models/PendingOrganizationProfile.js";
import multer from 'multer';
import Officer from '../models/Officer.js';

const router = express.Router();

// Configure multer storage for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save files in the 'uploads' directory
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// ********************************** FAVORITE-ORGS ROUTES **********************************
// get specific student based on the gator_id passed in the request query parameter
router.get("/favorite-organizations", async (req, res) => {
  const { email } = req.query; // Extract from request
  if (email) {
    try {
      const favOrgsStudent = await FavoriteOrg.find({
        // This assumes that `date` is stored as a full Date object in the schema.
        ufl_email: {
          $eq: email,
        },
      }).sort({ org_name: 1 });
      res.status(200).json(favOrgsStudent);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    try {
      const allFavs = await FavoriteOrg.find();
      res.status(200).json(allFavs);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
});

router.post("/favorite-organization", async (req, res) => {
  try {
    // console.log("Raw Body:", req.body); - can use this line to see if request goes through
    const { org_name, ufl_email } = req.body;
    const newFavoriteOrg = new FavoriteOrg({
      org_name,
      ufl_email,
      createdAt: undefined,
    });
    await newFavoriteOrg.save();
    res.status(201).json(newFavoriteOrg);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete("/favorite-organization", async (req, res) => {
  try {
    const { org_name, ufl_email } = req.query;

    if (!org_name || !ufl_email) {
      return res.status(400).json({
        message: "Missing required query parameters: org_name or ufl_email",
      });
    }

    // Find and delete the favorite organization
    const deletedFavoriteOrg = await FavoriteOrg.findOneAndDelete({
      org_name,
      ufl_email,
    });

    if (!deletedFavoriteOrg) {
      return res.status(404).json({
        message: "Favorite organization not found for the specified user.",
      });
    }

    res.status(200).json({
      message: "Favorite organization successfully removed.",
      deletedFavoriteOrg,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
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
  const { orgNames } = req.query; // Extract the orgNames query parameter
  if (orgNames) {
    try {
      let allOrgs;
      if (orgNames) {
        // If orgNames exists, parse it and query for matching organizations
        const orgNamesArray = JSON.parse(orgNames); // Parse orgNames if sent as a JSON string
        allOrgs = await OrganizationProfile.find({
          name: { $in: orgNamesArray },
        }).sort({ name: 1 });
      } else {
        // If orgNames is not provided, return all organizations
        allOrgs = await OrganizationProfile.find();
      }

      res.status(200).json(allOrgs);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    try {
      const allOrgs = await OrganizationProfile.find();
      res.status(200).json(allOrgs);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
});

router.get("/organization-profile", async (req, res) => {
  const { name } = req.query; // Extract from request
  try {
    const specificLocation = await OrganizationProfile.findOne({
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


// Route to delete a regular organization
router.delete("/organization-profile", async (req, res) => {
  const { name } = req.query;

  if (!name) {
    return res.status(400).json({ error: "Organization name is required" });
  }

  try {
    const deletedOrg = await OrganizationProfile.findOneAndDelete({ name });

    if (!deletedOrg) {
      return res.status(404).json({ error: "Organization not found" });
    }

    res.status(200).json({
      message: "Organization successfully deleted",
      deletedOrg,
    });
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

router.put("/organization-profile", async (req, res) => {
  try {
    const { org } = req.query;
    const { name, description, profile_image, createdAt } = req.body;

    // Check if name is provided in the query
    if (!org) {
      return res
        .status(400)
        .json({ error: "Email query parameter is required" });
    }

    // Update the organization profile
    const updatedOrganizationProfile =
      await OrganizationProfile.findOneAndUpdate(
        { name: org }, // Match based on org name
        {
          name,
          description,
          profile_image: profile_image || null,
          createdAt: createdAt || undefined,
        },
        { new: true, runValidators: true } // Return updated document & enforce schema validation
      );

    // If no document found with the given email
    if (!updatedOrganizationProfile) {
      return res.status(404).json({ error: "Organization profile not found" });
    }

    res.status(200).json(updatedOrganizationProfile);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ********************************** PENDING-ORG-Profile ROUTES **********************************
router.get("/pending-organization-profiles", async (req, res) => {
  try {
    const { org_name } = req.query;
    if (org_name) {
      const specificSocials = await PendingOrganizationProfile.find({
        // This assumes that `date` is stored as a full Date object in the schema.
        name: {
          $eq: org_name,
        },
      }).sort({ application_name: 1 });
      res.status(200).json(specificSocials);
    } else {
      const allSocials = await PendingOrganizationProfile.find().sort({
        requestedAt: -1,
      });
      res.status(200).json(allSocials);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/pending-organization-profile", upload.single("profile_image"), async (req, res) => {
  try {
    console.log("Request body:", req.body);
    console.log("Uploaded file:", req.file);

    const { name, description } = req.body;

    // Handle officers array
    const officersRaw = req.body["officers[]"] || req.body["officers"] || [];
    const officersArray = Array.isArray(officersRaw) ? officersRaw : [officersRaw].filter(Boolean);

    console.log("Original officers field:", officersRaw);
    console.log("Parsed officers array:", officersArray);

    // Handle the uploaded file
    const profile_image = req.file ? req.file.buffer : null;

    const newOrganizationProfile = new PendingOrganizationProfile({
      name,
      description,
      profile_image,
      officers: officersArray, // Store officers as an array of strings
    });

    await newOrganizationProfile.save();

    res.status(201).json(newOrganizationProfile);
  } catch (err) {
    console.error("Error occurred:", err);
    res.status(400).json({ error: err.message });
  }
});



router.put("/pending-organization-profile", async (req, res) => {
  const { name } = req.query;
  const { status, adminComments } = req.body;

  try {
    const updatedOrganization = await PendingOrganizationProfile.findOneAndUpdate(
      { name },
      { status, adminComments },
      { new: true } // Return the updated document
    );

    if (!updatedOrganization) {
      return res.status(404).json({ error: "Organization not found" });
    }

    res.status(200).json(updatedOrganization);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


// Route to delete a pending organization
router.delete("/pending-organization-profile", async (req, res) => {
  try {
    const { name } = req.query;

    if (!name) {
      return res.status(400).json({ message: "Organization name is required" });
    }

    const deletedPendingOrg = await PendingOrganizationProfile.findOneAndDelete({ name });

    if (!deletedPendingOrg) {
      return res.status(404).json({ message: "Pending organization not found" });
    }

    res.status(200).json({
      message: "Pending organization successfully deleted",
      deletedPendingOrg,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



// ********************************** ORG-SOCIAL ROUTES **********************************

router.get("/organization-socials", async (req, res) => {
  try {
    const { org_name } = req.query;
    if (org_name) {
      const specificSocials = await OrgSocial.find({
        // This assumes that `date` is stored as a full Date object in the schema.
        org_name: {
          $eq: org_name,
        },
      }).sort({ application_name: 1 });
      res.status(200).json(specificSocials);
    } else {
      const allSocials = await OrgSocial.find().sort({ application_name: 1 });
      res.status(200).json(allSocials);
    }
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

router.put("/organization-social", async (req, res) => {
  try {
    const { org } = req.query;
    const { org_name, application_name, application_link } = req.body;

    // Check if name is provided in the query
    if (!org) {
      return res
        .status(400)
        .json({ error: "Org name query parameter is required" });
    }

    // Update the organization profile
    const updatedOrganizationSocial = await OrgSocial.findOneAndUpdate(
      { name: org }, // Match based on org name
      {
        org_name,
        application_name,
        application_link,
      },
      { new: true, runValidators: true } // Return updated document & enforce schema validation
    );

    // If no document found with the given email
    if (!updatedOrganizationSocial) {
      return res.status(404).json({ error: "Organization profile not found" });
    }

    res.status(200).json(updatedOrganizationSocial);
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

// get specific student based on the gator_id passed in the request query parameter
router.get("/student-profile", async (req, res) => {
  const { email } = req.query; // Extract from request
  try {
    const specificStudent = await StudentProfile.find({
      // This assumes that `date` is stored as a full Date object in the schema.
      ufl_email: {
        $eq: email,
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

router.put("/student-profile", async (req, res) => {
  try {
    const { email } = req.query;
    const { first_name, last_name, ufl_email, profile_image } = req.body;

    // Check if gatorid is provided in the query
    if (!email) {
      return res
        .status(400)
        .json({ error: "Gator ID query parameter is required" });
    }

    // Update the organization profile
    const updatedStudent = await StudentProfile.findOneAndUpdate(
      { ufl_email: email }, // Match based on org name
      {
        first_name,
        last_name,
        ufl_email,
        profile_image,
      },
      { new: true, runValidators: true } // Return updated document & enforce schema validation
    );

    // If no document found with the given email
    if (!updatedStudent) {
      return res.status(404).json({ error: "Student profile not found" });
    }

    res.status(200).json(updatedStudent);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ********************************** TABLING RESERVATIONS ROUTES **********************************

// Fetch all tabling reservations or all tabling reservations for org if query passed in
router.get("/tabling-reservations", async (req, res) => {
  const { org } = req.query; // Extract from request
  if (org) {
    try {
      const orgReservations = await TablingReservation.find({
        // This assumes that `date` is stored as a full Date object in the schema.
        org_name: {
          $eq: org,
        },
      });
      res.status(200).json(orgReservations);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    try {
      const events = await TablingReservation.find();
      res.status(200).json(events);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
});

router.get("/favorite-organization-reservations", async (req, res) => {
  try {
    const { orgNames } = req.query; // Extract the orgNames query parameter
    let favoriteReservations;
    if (orgNames) {
      // If orgNames exists, parse it and query for matching organizations
      const orgNamesArray = JSON.parse(orgNames); // Parse orgNames if sent as a JSON string
      favoriteReservations = await TablingReservation.find({
        org_name: { $in: orgNamesArray },
      }).sort({ start_time: 1 });
    } else {
      // If orgNames is not provided, return all organizations
      favoriteReservations = await TablingReservation.find();
    }
    res.status(200).json(favoriteReservations);
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

router.put("/tabling-reservation", async (req, res) => {
  try {
    const { id, name } = req.query;
    const { org_name, start_time, end_time, location, description } = req.body;

    // Check if gatorid is provided in the query
    if (!id || !name) {
      return res
        .status(400)
        .json({ error: "Gator ID query parameter is required" });
    }

    // Update the organization profile
    const updatedReservation = await TablingReservation.findOneAndUpdate(
      { _id: id, org_name: name }, // Match based on org name
      {
        org_name,
        start_time,
        end_time,
        location,
        description: description || "",
      },
      { new: true, runValidators: true } // Return updated document & enforce schema validation
    );

    // If no document found with the given email
    if (!updatedReservation) {
      return res.status(404).json({ error: "Student profile not found" });
    }

    res.status(200).json(updatedReservation);
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

// Fetch all places and times a reservation cannot be made
router.get("/unavailable-tabling-options", async (req, res) => {
  try {
    const { start_time, end_time } = req.query;
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0); // Set time to the start of the day (00:00:00)

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999); // Set time to the end of the day (23:59:59)

    const liveEvents = await TablingReservation.find({
      // events that occur on the same day
      start_time: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
      // that occur either before (end_time less than or equal to start time of this reservation)
      // or after (start_time greater than or equal the end time of this reservation)
      // equal to condition provided for both for when an existing reservation ends at 2:00PM and this one starts at 2:00PM for example
      $or: [
        { start_time: { $le: end_time } },
        { end_time: { $ge: start_time } },
      ],
    });
    res.status(200).json(liveEvents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Fetch events during a specific time range
router.get("/events-during", async (req, res) => {
  try {
    const { start_time, end_time } = req.query;

    // Validate query parameters
    if (!start_time || !end_time) {
      return res
        .status(400)
        .json({ error: "start_time and end_time are required." });
    }

    const start = new Date(start_time);
    const end = new Date(end_time);

    // Find events that overlap with the given time range
    const overlappingEvents = await TablingReservation.find({
      $or: [
        { start_time: { $lt: end, $gte: start } }, // Events starting during the range
        { end_time: { $lte: end, $gt: start } }, // Events ending during the range
        { start_time: { $lte: start }, end_time: { $gte: end } }, // Events encompassing the range
      ],
    });

    res.status(200).json(overlappingEvents);
  } catch (error) {
    console.error("Error fetching events during time range:", error);
    res.status(500).json({
      error: "Failed to fetch events during the specified time range.",
    });
  }
});

// ********************************** TABLING RESERVATION REQUESTS ROUTES **********************************
// Create a new tabling reservation request based on the existing formatting from EMS
router.post("/tabling-reservation-request", async (req, res) => {
  try {
    const {
      event_name,
      groups,
      first_contact,
      first_contact_fax,
      first_contact_phone_number,
      first_contact_email_address,
      event_description,
      event_advertisement,
      event_advertisement_info,
      gatorconnect_permit,
      collaborating_bool,
      collaborating_orgs,
      tables_needed,
      org_name,
      payment_method,
      location,
      start_time,
      end_time,
    } = req.body;
    const newReservationRequest = new TablingReservationRequest({
      event_name,
      event_type: "Tabling",
      groups,
      first_contact,
      first_contact_fax,
      first_contact_phone_number,
      first_contact_email_address,
      event_description,
      event_advertisement,
      event_advertisement_info,
      gatorconnect_permit,
      collaborating_bool,
      collaborating_orgs,
      tables_needed,
      org_name,
      payment_method,
      location,
      start_time,
      end_time,
      createdAt: createdAt || undefined,
      status: "Pending",
    });
    await newReservationRequest.save();
    res.status(201).json(newReservationRequest);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Route to get the most recent event by createdAt that matches criteria
router.get("/latest-tabling-reservation-request", async (req, res) => {
  try {
    const { organization } = req.query;

    // Query to find the most recent event with matching organization and eventName
    const mostRecentRequest = await TablingReservationRequest.findOne({
      organization: organization,
    }).sort({ createdAt: -1 });

    // Send the result as a JSON response
    if (mostRecentRequest) {
      res.status(200).json(mostRecentEvent);
    } else {
      res
        .status(404)
        .json({ message: "No request found matching the criteria" });
    }
  } catch (error) {
    console.error("Error fetching the most recent event with criteria:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error Reservation request" });
  }
});

// Fetch all tabling reservation requests made by a specific student org
router.get("/latest-tabling-reservation-request", async (req, res) => {
  try {
    const latestRequests = await TablingReservationRequest.find({
      organization: organization,
    }).sort({ createdAt: -1 });
    // Send the result as a JSON response
    if (latestRequests.length > 0) {
      res.status(200).json(latestRequests);
    } else {
      res
        .status(404)
        .json({ message: "No events found matching the criteria" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Fetch all tabling reservation requests (displayed in descending order)
router.get("/tabling-reservation-requests", async (req, res) => {
  try {
    const latestRequests = await TablingReservationRequest.find().sort({
      createdAt: -1,
    });
    // Send the result as a JSON response
    if (latestRequests.length > 0) {
      res.status(200).json(latestRequests);
    } else {
      res
        .status(404)
        .json({ message: "No requests found matching the criteria" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Fetch all pending tabling reservation requests that need to be approved (displayed in descending order)
// For the purposes of this project, we will let student government to approve this so we may not have to implement this
// For non-EMS tabling reservations, as long as the location and time doesn't interfere with others, we will allow
// student orgs to table at any location
router.get("/pending-tabling-reservation-requests", async (req, res) => {
  try {
    const latestRequests = await TablingReservationRequest.find({
      status: "Pending",
    }).sort({
      createdAt: 1,
    });
    // Send the result as a JSON response
    if (latestRequests.length > 0) {
      res.status(200).json(latestRequests);
    } else {
      res
        .status(404)
        .json({ message: "No requests found matching the criteria" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/admin", async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      ufl_email,
      profile_image,
      password,
      organization,
      role,
    } = req.body;

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const studentProfile = new StudentProfile({
      first_name,
      last_name,
      ufl_email,
      profile_image,
      password: hashedPassword, // Save the hashed password
      organization,
      role,
    });

    await studentProfile.save();
    res.status(201).json(studentProfile);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});



router.put("/student-role", async (req, res) => {
  const { email, role } = req.body;

  if (!email || !role) {
    return res.status(400).json({ message: "Email and role are required" });
  }

  try {
    const user = await StudentProfile.findOneAndUpdate(
      { ufl_email: email },
      { role },
      { new: true }
    );

    if (user) {
      res.status(200).json({ message: "Role updated successfully", user });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error updating user role:", error);
    res.status(500).json({ error: "An error occurred while updating role" });
  }
});



router.get("/is-officer", async (req, res) => {
  const { ufl_email } = req.query;

  if (!ufl_email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    console.log("Checking officer status for email:", ufl_email);

    const officerRecord = await Officer.findOne({ ufl_email });
    if (officerRecord) {
      return res.status(200).json({
        isOfficer: true,
        message: "Student is an officer",
        officerRecord,
      });
    } else {
      return res.status(200).json({
        isOfficer: false,
        message: "Student is not an officer",
      });
    }
  } catch (error) {
    console.error("Error checking officer status:", error.message, error.stack);
    res.status(500).json({ error: "An error occurred while checking officer status" });
  }
});



export default router;
