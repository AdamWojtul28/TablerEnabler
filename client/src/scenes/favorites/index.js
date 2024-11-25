import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Favorites.css"; // Assuming you already have CSS for styling

const Favorites = () => {
  const [organizations, setOrganizations] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // Search term state
  const [favorites, setFavorites] = useState([]);

  const email = localStorage.getItem("email");

  // Fetch favorites once on component mount
  useEffect(() => {
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

    fetchFavorites();
  }, [email]);

  // Fetch organizations and reservations based on favorites
  useEffect(() => {
    if (favorites.length > 0) {
      const favoriteOrgs = favorites.map((favorite) => favorite.org_name);
      const orgNames = JSON.stringify(favoriteOrgs);

      const fetchOrganizations = async () => {
        try {
          const response = await fetch(
            `http://localhost:5001/general/organization-profiles?orgNames=${encodeURIComponent(
              orgNames
            )}`
          );
          const data = await response.json();
          setOrganizations(data); // Set the organizations data
        } catch (error) {
          console.error("Error fetching organizations:", error);
        }
      };

      const fetchReservations = async () => {
        try {
          const response = await fetch(
            `http://localhost:5001/general/favorite-organization-reservations?orgNames=${encodeURIComponent(
              orgNames
            )}`
          );
          const data = await response.json();
          // Filter reservations to include only future tabling events
          const currentDateTime = new Date();
          const upcomingReservations = data.filter((reservation) => {
            const endTime = new Date(reservation.end_time);
            return endTime > currentDateTime;
          });
          setReservations(upcomingReservations); // Set the reservations data
        } catch (error) {
          console.error("Error fetching reservations:", error);
        }
      };

      fetchOrganizations();
      fetchReservations();
    }
  }, [favorites]);

  // Filter organizations based on the search term
  const filteredOrganizations = organizations.filter(
    (org) =>
      org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="search-page">
      <h1>Favorite Organizations</h1>

      {/* Search bar */}
      <input
        type="text"
        placeholder="Search clubs..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)} // Update the search term
        className="search-bar"
      />

      {/* Display filtered clubs */}
      <div className="club-grid">
        {filteredOrganizations.length > 0 ? (
          filteredOrganizations.map((org) => (
            <Link
              key={org._id}
              to={`/organization-profile?name=${encodeURIComponent(org.name)}`}
              className="club-card"
            >
              <img
                src={org.profile_image || "default-image-url.jpg"}
                alt={org.name}
                className="club-image"
              />
              <h2>{org.name}</h2>
              <p>{org.description}</p>
            </Link>
          ))
        ) : (
          <p className="no-events">No organizations found</p>
        )}
      </div>

      <h1>Upcoming Tabling Events</h1>
      <div className="reservations-banner">
        {reservations.length > 0 ? (
          reservations.map((reservation, index) => {
            const organization = organizations.find(
              (org) => org.name === reservation.org_name
            );

            return (
              <div key={index} className="reservation-banner">
                {/* Left image container */}
                <div className="banner-image-container">
                  <img
                    src={organization?.profile_image || "default-image-url.jpg"}
                    alt={reservation.org_name}
                    className="banner-image"
                  />
                </div>

                {/* Right text container */}
                <div className="banner-text-container">
                  <h2>
                    {new Date(reservation.start_time).toLocaleDateString()} -{" "}
                    {reservation.org_name} Tabling Session
                  </h2>
                  <p>
                    <strong>Start Time:</strong>{" "}
                    {new Date(reservation.start_time).toLocaleTimeString([], {
                      timeZone: "UTC",
                      hour12: true,
                    })}
                    {" | "} <strong>End Time:</strong>{" "}
                    {new Date(reservation.end_time).toLocaleTimeString([], {
                      timeZone: "UTC",
                      hour12: true,
                    })}
                    {" | "} <strong>Location: </strong>
                    {reservation.location}
                  </p>
                  <p>
                    <strong>Description: </strong>
                    {reservation.description}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <p className="no-events">No upcoming tabling events</p>
        )}
      </div>
    </div>
  );
};

export default Favorites;
