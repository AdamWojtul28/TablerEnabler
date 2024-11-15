import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./OrganizationPage.css";

const OrganizationPage = () => {
  const [organization, setOrganization] = useState(null);
  const [socialMedia, setSocialMedia] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [isFavorite, setIsFavorite] = useState("Follow");
  const [modalData, setModalData] = useState(null); // To store data for modal
  const location = useLocation();
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

  // Function to check if a date has a reservation
  const isReserved = (date) => {
    const formattedDate = date.toISOString().split("T")[0]; // Format as YYYY-MM-DD
    // let value = "";
    // for (let i = 0; i < reservations.length; i++) {
    //   alert(JSON.stringify(reservations[i].start_time));
    // }
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
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizationPage;
