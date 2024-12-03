// EditOrganizationPage.jsx

import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Import useNavigate
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./EditOrganizationPage.css";
import defaultImage from "../../../assets/organization-default.png";
import { format } from "date-fns";

const EditOrganizationPage = () => {
  const [organization, setOrganization] = useState(null);
  const [socialMedia, setSocialMedia] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [isFavorite, setIsFavorite] = useState("Follow");
  const [modalData, setModalData] = useState(null); // Current modal data
  const [modalIndex, setModalIndex] = useState(0); // Current reservation index for the modal
  const [modalArrayLength, setModalArrayLength] = useState(1); // Total reservations for the day
  const [dayReservations, setDayReservations] = useState([]); // Reservations for the selected day
  const [next, setNext] = useState(false); // Reservations for the selected day
  const [previous, setPrevious] = useState(false); // Reservations for the selected day
  const [updateModalTitle, setUpdateModalTitle] = useState(null);
  const location = useLocation();
  const navigate = useNavigate(); // Initialize navigate
  const queryParams = new URLSearchParams(location.search);
  
  // Define orgName and originalOrgName as state variables
  const [orgName, setOrgName] = useState(location.state?.orgName || '');
  const [originalOrgName, setOriginalOrgName] = useState(location.state?.orgName || '');
  const [orgId, setOrgId] = useState(null); // Initialize orgId
  const email = localStorage.getItem("email");

  // States for editing
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editImage, setEditImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    // Function to initialize orgName from localStorage if not provided via location.state
    const initializeOrgName = () => {
      if (!orgName) {
        const storedOrgName = localStorage.getItem('orgName');
        if (storedOrgName) {
          try {
            const parsedName = JSON.parse(storedOrgName);
            if (typeof parsedName === 'string') {
              setOrgName(parsedName);
              setOriginalOrgName(parsedName);
            } else if (parsedName.name) {
              setOrgName(parsedName.name);
              setOriginalOrgName(parsedName.name);
              localStorage.setItem('orgName', parsedName.name);
            }
          } catch (e) {
            // If parsing fails, assume it's a string
            setOrgName(storedOrgName);
            setOriginalOrgName(storedOrgName);
          }
        }
      }
    };

    initializeOrgName();
  }, [orgName]);

  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        const response = await fetch(
          `http://localhost:5001/general/organization-profile?name=${encodeURIComponent(
            orgName
          )}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch organization profile");
        }
        const data = await response.json();
        setOrganization(data);
        setEditName(data.name);
        setEditDescription(data.description);
        setImagePreview(data.profile_image ? `http://localhost:5001${data.profile_image}` : defaultImage);
        setOrgId(data._id); // Store the organization's ID
      } catch (error) {
        console.error("Error fetching organization:", error);
      }
    };

    const fetchSocialMedia = async () => {
      try {
        const response = await fetch(
          `http://localhost:5001/general/organization-socials?org_name=${encodeURIComponent(
            orgName
          )}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch social media");
        }
        const socialData = await response.json();
        setSocialMedia(socialData);
      } catch (error) {
        console.error("Error fetching social media:", error);
      }
    };

    const fetchFavorites = async () => {
      try {
        const response = await fetch(
          `http://localhost:5001/general/favorite-organizations?email=${encodeURIComponent(
            email
          )}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch favorites");
        }
        const favoritesData = await response.json();
        setFavorites(favoritesData);
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };

    const fetchReservations = async () => {
      try {
        const response = await fetch(
          `http://localhost:5001/general/tabling-reservations?org=${encodeURIComponent(
            orgName
          )}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch reservations");
        }
        const reservationsData = await response.json();
        setReservations(reservationsData);
      } catch (error) {
        console.error("Error fetching reservations:", error);
      }
    };

    if (orgName) {
      fetchOrganization();
      fetchSocialMedia();
      fetchFavorites();
      fetchReservations();
    }
  }, [orgName, email]);

  // Update isFavorite based on fetched favorites
  useEffect(() => {
    if (favorites.some((favorite) => favorite.org_name === orgName)) {
      setIsFavorite("Following");
    } else {
      setIsFavorite("Follow");
    }
  }, [favorites, orgName, modalArrayLength]);

  // Ensure modalData initializes properly when dayReservations or modalIndex changes
  useEffect(() => {
    if (dayReservations.length > 0) {
      setModalData(
        formatReservationData(dayReservations[modalIndex], modalIndex)
      );
    }
  }, [dayReservations, modalIndex]);

  // Update modalArrayLength and reset modalIndex when dayReservations changes
  useEffect(() => {
    if (dayReservations.length > 0) {
      setModalArrayLength(dayReservations.length); // Set total count of reservations for the day
      setModalIndex(0); // Reset modal index
    }
  }, [dayReservations]);

  // Function to check if a date has a reservation
  const isReserved = (date) => {
    const formattedDate = date.toISOString().split("T")[0]; // Format as YYYY-MM-DD
    return reservations.some(
      (reservation) =>
        reservation.start_time &&
        reservation.start_time.startsWith(formattedDate)
    );
  };

  const handleClickDay = (date) => {
    const formattedDate = date.toISOString().split("T")[0];
    const matchingReservations = reservations.filter(
      (res) => res.start_time && res.start_time.startsWith(formattedDate)
    );

    if (matchingReservations.length > 0) {
      setDayReservations(matchingReservations); // Store reservations for the day
      setModalArrayLength(matchingReservations.length); // Set total count
      setModalIndex(0); // Reset modal index
      setModalData(formatReservationData(matchingReservations[0], 0)); // Initialize modal data with index 0
    } else {
      handleModalClose(); // Close modal if no reservations
    }
  };

  const handleNext = () => {
    if (modalIndex < dayReservations.length - 1) {
      const nextIndex = modalIndex + 1;
      setModalIndex(nextIndex); // Update modal index
      setModalData(formatReservationData(dayReservations[nextIndex], nextIndex)); // Update modal content
    }
  };

  const handlePrevious = () => {
    if (modalIndex > 0) {
      const prevIndex = modalIndex - 1;
      setModalIndex(prevIndex); // Update modal index
      setModalData(formatReservationData(dayReservations[prevIndex], prevIndex)); // Update modal content
    }
  };

  const formatReservationData = (reservation, index) => ({
    title: `${organization?.name || "Organization"} ${
      reservation.start_time.split("T")[0]
    } Tabling Session ${index + 1} / ${dayReservations.length}`,
    location: reservation.location,
    startTime: new Date(reservation.start_time).toLocaleTimeString("en-US", {
      timeZone: "UTC",
      hour12: true,
    }),
    endTime: new Date(reservation.end_time).toLocaleTimeString("en-US", {
      timeZone: "UTC",
      hour12: true,
    }),
    description: reservation.description,
  });

  const handleModalClose = () => {
    setModalData(null);
    setDayReservations([]);
  };

  const handleClickOutsideModal = (e) => {
    if (e.target.className === "modal-overlay") handleModalClose();
  };

  // Check if a month has any reservations
  const isMonthReserved = (date) => {
    const month = date.getMonth();
    const year = date.getFullYear();
    return reservations.some((reservation) => {
      const reservationDate = new Date(reservation.start_time);
      return (
        reservationDate.getMonth() === month &&
        reservationDate.getFullYear() === year
      );
    });
  };

  // Check if a year has any reservations
  const isYearReserved = (date) => {
    const year = date.getFullYear();
    return reservations.some(
      (reservation) => new Date(reservation.start_time).getFullYear() === year
    );
  };

  const handleFollow = async () => {
    if (isFavorite === "Follow") {
      // Handle following the organization
      try {
        const response = await fetch(
          "http://localhost:5001/general/favorite-organization",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ org_name: orgName, ufl_email: email }),
          }
        );
        if (response.ok) {
          alert(`${orgName} added to favorites!`);
          setFavorites((prev) => [
            ...prev,
            { org_name: orgName, ufl_email: email },
          ]);
          setIsFavorite("Following"); // Update the button state
        } else {
          alert("Failed to add organization to favorites.");
        }
      } catch (error) {
        console.error("Error favoriting organization:", error);
        alert("An error occurred.");
      }
    } else if (isFavorite === "Following") {
      // Handle unfollowing the organization
      try {
        const response = await fetch(
          `http://localhost:5001/general/favorite-organization?org_name=${encodeURIComponent(
            orgName
          )}&ufl_email=${encodeURIComponent(email)}`,
          {
            method: "DELETE",
          }
        );
        if (response.ok) {
          alert(`${orgName} removed from favorites!`);
          setFavorites((prev) =>
            prev.filter((favorite) => favorite.org_name !== orgName)
          );
          setIsFavorite("Follow"); // Update the button state
        } else {
          alert("Failed to remove organization from favorites.");
        }
      } catch (error) {
        console.error("Error unfavoriting organization:", error);
        alert("An error occurred.");
      }
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // If currently editing, cancel the edit and reset fields
      setEditName(organization.name);
      setEditDescription(organization.description);
      setImagePreview(organization.profile_image ? `http://localhost:5001${organization.profile_image}` : defaultImage);
      setEditImage(null);
    }
    setIsEditing(!isEditing);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validImageTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!validImageTypes.includes(file.type)) {
        alert("Please select a valid image file (jpeg, png, gif).");
        return;
      }

      // Validate file size (e.g., max 5MB)
      const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSizeInBytes) {
        alert("Image size should be less than 5MB.");
        return;
      }

      setEditImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("name", editName);
      formData.append("description", editDescription);
      if (editImage) {
        formData.append("profile_image", editImage);
      }
      if (organization.createdAt) {
        formData.append("createdAt", organization.createdAt);
      }

      console.log("Sending PUT request with orgId:", orgId);
      console.log("New organization name:", editName);

      const response = await fetch(
        `http://localhost:5001/general/organization-profile?orgId=${encodeURIComponent(orgId)}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      if (response.ok) {
        const updatedOrg = await response.json();
        console.log("Received updated organization:", updatedOrg);
        setOrganization(updatedOrg);
        setEditName(updatedOrg.name);
        setEditDescription(updatedOrg.description);
        setImagePreview(updatedOrg.profile_image ? `http://localhost:5001${updatedOrg.profile_image}` : defaultImage);
        setIsEditing(false);
        setEditImage(null);
        alert("Organization profile updated successfully!");

        // Update local storage if orgName is stored there
        localStorage.setItem('orgName', updatedOrg.name);

        // Update orgName in state
        setOrgName(updatedOrg.name);

        // Update originalOrgName for future edits
        setOriginalOrgName(updatedOrg.name);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update organization profile");
      }
    } catch (error) {
      console.error("Error updating organization profile:", error);
      alert(`Error: ${error.message}`);
    }
  };

  if (!organization) {
    return <div>Loading...</div>;
  }

  return (
    <div className="organization-page">
      <div className="organization-header">
        {isEditing ? (
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            className="edit-name-input"
          />
        ) : (
          <h1 className="organization-name">{organization.name}</h1>
        )}

        <button className="edit-button" onClick={handleEditToggle}>
          {isEditing ? "Cancel" : "Edit"}
        </button>
        {isEditing && (
          <button className="save-button" onClick={handleSave}>
            Save
          </button>
        )}
      </div>
      <div className="smooth-grey-box">
        <div className="parent-div">
          <div className="left-section">
            <h2>Organization Purpose:</h2>
            {isEditing ? (
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="edit-description-textarea"
              />
            ) : (
              <p>{organization.description}</p>
            )}
          </div>
          <div className="right-section">
            <img
              src={imagePreview}
              alt={organization.name || "Default Organization"}
              className="organization-image"
            />
            {isEditing && (
             <div className="image-upload-section">
                <label htmlFor="file-upload" className="custom-file-label">
                  {editImage ? "File Selected" : "Choose a file"}
                </label>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                />
           </div>
            )}
          </div>
        </div>
        <h2>Tabling Calendar</h2>
        <div className="calendar-container">
          <Calendar
            calendarType="gregory"
            tileClassName={({ date, view }) => {
              if (view === "month" && isReserved(date)) {
                return "highlighted-day"; // Reserved days in day view
              } else if (view === "year" && isMonthReserved(date)) {
                return "highlighted-month"; // Highlighted month in year view
              } else if (view === "decade" && isYearReserved(date)) {
                return "highlighted-year"; // Highlighted year in decade view
              }
              return "";
            }}
            onClickDay={handleClickDay}
            className="custom-calendar"
          />
        </div>

        <h2>Contact Information</h2>
        <div className="social-media-section">
          <h2>Follow Us</h2>
          <div className="social-media-links">
            {socialMedia.map((social) => (
              <a
                key={social.application_name}
                href={social.application_link}
                target="_blank"
                rel="noopener noreferrer"
                className="social-media-link"
              >
                <img
                  src={`/icons/${social.application_name}-icon.png`}
                  alt={`${social.application_name} icon`}
                  className="social-media-icon"
                />
                <span>{social.platform}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
      {modalData && (
        <div className="modal-overlay" onClick={handleClickOutsideModal}>
          <div className="modal">
            <button className="close-button" onClick={handleModalClose}>
              X
            </button>
            <h2>{modalData.title}</h2>
            <p>
              <strong>Location:</strong> {modalData.location}
            </p>
            <p>
              <strong>Start Time:</strong> {modalData.startTime}
            </p>
            <p>
              <strong>End Time:</strong> {modalData.endTime}
            </p>
            <p>
              <strong>Description:</strong> {modalData.description}
            </p>
            <div className="modal-navigation">
              <button
                className="navigate-button"
                onClick={handlePrevious}
                disabled={modalIndex === 0}
              >
                Previous
              </button>
              <button
                className="navigate-button"
                onClick={handleNext}
                disabled={modalIndex === dayReservations.length - 1}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditOrganizationPage;
