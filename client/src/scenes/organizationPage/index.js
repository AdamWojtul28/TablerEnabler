import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Calendar from "react-calendar";
import { format, parseISO } from "date-fns";
import "./OrganizationPage.css";

const OrganizationPage = () => {
  const [organization, setOrganization] = useState(null);
  const [socialMedia, setSocialMedia] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [isFavorite, setIsFavorite] = useState("Follow");
  const location = useLocation();

  // Extract the 'name' query parameter from the URL
  const queryParams = new URLSearchParams(location.search);
  const orgName = queryParams.get("name");

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
        setOrganization(data);
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
        const reservationsData = await response.json();
        setReservations(reservationsData);
      } catch (error) {
        console.error("Error fetching reservations:", error);
      }
    };

    fetchOrganization();
    fetchSocialMedia();
    fetchFavorites();
    fetchReservations();
  }, [orgName, email]);

  // Update isFavorite based on fetched favorites
  useEffect(() => {
    if (favorites.some((favorite) => favorite.org_name === orgName)) {
      setIsFavorite("Following");
    } else {
      setIsFavorite("Follow");
    }
  }, [favorites, orgName]);

  // Helper function to check if a date has reservations
  const isReserved = (date) => {
    const formattedDate = format(date, "yyyy-MM-dd");

    return reservations.some((reservation) => {
      if (reservation.date) {
        const reservationDate = parseISO(reservation.date);
        return format(reservationDate, "yyyy-MM-dd") === formattedDate;
      }
      return false;
    });
  };

  const handleFollow = async () => {
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
      } else {
        alert("Failed to add organization to favorites.");
      }
    } catch (error) {
      console.error("Error favoriting organization:", error);
      alert("An error occurred.");
    }
  };

  if (!organization) {
    return <div>Loading...</div>;
  }

  return (
    <div className="organization-page">
      <div className="organization-header">
        <h1 className="organization-name">{organization.name}</h1>
        <button className="follow-button" onClick={handleFollow}>
          {isFavorite}
        </button>
      </div>
      <div className="smooth-grey-box">
        <div className="left-section">
          <h2>Organization Purpose:</h2>
          <p>{organization.description}</p>
        </div>
        <div className="right-section">
          <img
            src={organization.profile_image || "default-image-url.jpg"}
            alt={organization.name}
            className="organization-image"
          />
        </div>

        <h2>Tabling Calendar</h2>
        <div className="calendar-container">
          <Calendar
            calendarType="gregory"
            tileClassName={({ date }) =>
              isReserved(date) ? "highlighted-day" : ""
            }
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
                  alt={`/icons/${social.application_link} icon`}
                  className="social-media-icon"
                />
                <span>{social.platform}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationPage;
