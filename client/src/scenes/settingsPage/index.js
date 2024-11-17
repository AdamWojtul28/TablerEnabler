import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./settingsPage.css";

const SettingsPage = () => {
  const [organization, setOrganization] = useState({});
  const [socialMedia, setSocialMedia] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [newSocial, setNewSocial] = useState({ application_name: "", application_link: "" });
  const [modalData, setModalData] = useState(null); // To store data for modal
  const [isLoading, setIsLoading] = useState(true);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const orgName = localStorage.getItem('organizationName');
  

  const email = localStorage.getItem("email");

  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        const response = await fetch(
          `http://localhost:5001/general/organization-profile?name=${encodeURIComponent(
            orgName
          )}`
        );
        const data = await response.json();
        console.log("Organization Data:", data);    // Debug log
        setOrganization(data);
      } catch (error) {
        console.error("Error fetching organization:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchSocialMedia = async () => {
        try {
          const response = await fetch(
            `http://localhost:5001/general/organization-socials?org_name=${encodeURIComponent(
              orgName
            )}`
          );
          const socialData = await response.json();
          setSocialMedia(socialData);
        } catch (error) {
          console.error("Error fetching social media:", error);
        }
    };

    const fetchReservations = async () => {
      try {
        const response = await fetch(
          `http://localhost:5001/general/tabling-reservations?org=${encodeURIComponent(
            orgName
          )}`
        );
        const reservationsData = await response.json();
        setReservations(reservationsData);
      } catch (error) {
        console.error("Error fetching reservations:", error);
      }
    };

    fetchOrganization();
    fetchSocialMedia();
    fetchReservations();
  }, [orgName, email]);

  // Function to check if a date has a reservation
  const isReserved = (date) => {
    const formattedDate = date.toISOString().split("T")[0]; // Format as YYYY-MM-DD
    return reservations.some(
      (reservation) =>
        reservation.start_time &&
        reservation.start_time.startsWith(formattedDate)
    );
  };

  const handleModalClose = () => setModalData(null);

  const handleClickOutsideModal = (e) => {
    if (e.target.className === "modal-overlay") handleModalClose();
  };

  const handleClickDay = (date) => {
    const formattedDate = date.toISOString().split("T")[0];
    const reservation = reservations.find(
      (res) => res.start_time && res.start_time.startsWith(formattedDate)
    );

    if (reservation) {
      setModalData({
        title: `${organization.name} ${
          reservation.start_time.split("T")[0]
        } Tabling Session`,
        location: reservation.location,
        startTime: new Date(reservation.start_time).toLocaleTimeString(),
        endTime: new Date(reservation.end_time).toLocaleTimeString(),
        description: reservation.description,
      });
    }
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

  // Add a useEffect to handle calendar reservations on initial load
  useEffect(() => {
    // This effect ensures that the calendar highlights all reservation dates upon loading.
  }, [reservations]);


  if (isLoading) {
    return <div>Loading organization details...</div>;
  }

  if (!organization) {
    return <div>No organization found.</div>;
  }









  const handleEventSubmit = async (eventData) => {
    try {
      const response = await fetch(
        `http://localhost:5001/general/manage-tabling-event`,
        {
          method: eventData.id ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(eventData),
        }
      );
  
      if (!response.ok) {
        throw new Error("Failed to save event");
      }
  
      const updatedEvents = await response.json();
      setReservations(updatedEvents);
      setModalData(null);
      alert("Event saved successfully!");
    } catch (error) {
      console.error("Error saving event:", error);
      alert("Failed to save event.");
    }
  };
  
  
  const handleDeleteEvent = async (eventId) => {
    try {
      const response = await fetch(
        `http://localhost:5001/general/delete-tabling-event?id=${eventId}`,
        { method: "DELETE" }
      );
  
      if (!response.ok) {
        throw new Error("Failed to delete event");
      }
  
      const updatedEvents = await response.json();
      setReservations(updatedEvents);
      alert("Event deleted successfully!");
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("Failed to delete event.");
    }
  };


  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const requestBody = {
        name: organization.name || "",
        description: organization.description || "",
        profile_image: organization.profile_image || null,
        createdAt: organization.createdAt || new Date().toISOString(),
      };
  
      const response = await fetch(
        `http://localhost:5001/general/organization-profile?org=MaxLife`, // Use `org` instead of `name`
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        }
      );
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Backend Error:", errorData);
        throw new Error("Failed to update profile");
      }
  
      const updatedData = await response.json();
      setOrganization(updatedData);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };
  
  

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    const formData = new FormData();
    formData.append("profile_image", file);
  
    try {
      const response = await fetch(
        `http://localhost:5001/general/organization-profile?name=MaxLife`,
        {
          method: "PUT",
          body: formData,
        }
      );
      if (!response.ok) throw new Error("Failed to upload image");
      const updatedData = await response.json();
      setOrganization(updatedData);
      alert("Profile picture updated successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image.");
    }
  };

  const handleSocialMediaSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:5001/general/organization-socials`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...newSocial, org_name: orgName }),
        }
      );
      if (!response.ok) throw new Error("Failed to save social media link");
      const updatedSocialMedia = await response.json();
      setSocialMedia(updatedSocialMedia);
      setNewSocial({ application_name: "", application_link: "" });
      alert("Social media updated successfully!");
    } catch (error) {
      console.error("Error updating social media:", error);
      alert("Failed to update social media.");
    }
  };
  
  
  return (
    <div className="organization-page">
      <div className="organization-header">
        <h1 className="organization-name">{organization.name || "Unknown Name"}</h1>
      </div>
      <div className="smooth-grey-box">
        <div className="left-section">
          <h2>Organization Purpose:</h2>
          <p>{organization.description || "No description available."}</p>
        </div>
        <div className="right-section">
          <img
            src={organization.profile_image || "default-image-url.jpg"}
            alt={organization.name || "Organization"}
            className="organization-image"
          />
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

        <div className="update-profile">
        <h2>Update Profile</h2>
        <form onSubmit={handleProfileUpdate}>
            <label>
            Name:
            <input
                type="text"
                value={organization.name || ""}
                onChange={(e) =>
                setOrganization((prev) => ({ ...prev, name: e.target.value }))
                }
            />
            </label>
            <label>
            Description:
            <textarea
                value={organization.description || ""}
                onChange={(e) =>
                setOrganization((prev) => ({ ...prev, description: e.target.value }))
                }
            />
            </label>
            <label>
            Contact Email:
            <input
                type="email"
                value={organization.contact_email || ""}
                onChange={(e) =>
                setOrganization((prev) => ({ ...prev, contact_email: e.target.value }))
                }
            />
            </label>
            <div className="change-profile-picture">
                <h2>Change Profile Picture</h2>
                <input type="file" accept="image/*" onChange={handleImageUpload} />
            </div>
            

            <div className="manage-social-media">
                <h2>Social Media Links</h2>
                <form onSubmit={handleSocialMediaSubmit}>
                    <label>
                        Platform:
                        <input type="text"  value={newSocial.platform || ""} onChange={(e) => setNewSocial({ ...newSocial, platform: e.target.value })} />
                    </label>
                    <label>
                        Link:
                        <input type="url" value={newSocial.link || ""} onChange={(e) => setNewSocial({ ...newSocial, link: e.target.value })} />
                    </label>
                </form>
            </div>

            <button type="submit">Save Changes</button>
        </form>
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
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;


// Update Profile: Allow organizations to update their name, description, or contact details.
// Change Profile Picture: Upload or change their logo/image.
// Manage Events: Add, edit, or remove tabling events.
// Social Media Links: Add or update social media accounts.