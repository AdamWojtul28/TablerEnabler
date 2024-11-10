import express from "express";
import ReservationTag from "../models/ReservationTag.js";
import StudentProfile from "../models/StudentProfile.js";
import TablingReservation from "../models/TablingReservation.js";
import FavoriteOrg from "../models/FavoriteOrg.js";
import OrganizationProfile from "../models/OrganizationProfile.js";
import OrgSocial from "../models/OrgSocial.js";
import FixedTablingLocs from "../models/FixedTablingLocations.js";
import TablingReservationRequest from "../models/TablingReservation.js";

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

export default router;
