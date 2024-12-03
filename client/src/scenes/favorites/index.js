import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Favorites.css"; // Assuming you already have CSS for styling
import defaultImage from "../../assets/organization-default.png"; // Import the default image

const Favorites = () => {
  const [organizations, setOrganizations] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // Search term state
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();

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
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const favoritesData = await response.json();
        setFavorites(favoritesData);
      } catch (error) {
        console.error("Error fetching favorites:", error);
        setFavorites([]); // Optionally reset favorites on error
      }
    };

    if (email) {
      fetchFavorites();
    } else {
      console.error("No email found in localStorage.");
    }
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
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();

          // Validate data structure
          if (Array.isArray(data)) {
            setOrganizations(data);
          } else {
            console.error("Invalid data format: expected an array.");
            setOrganizations([]);
          }
        } catch (error) {
          console.error("Error fetching organizations:", error);
          setOrganizations([]); // Optionally reset organizations on error
        }
      };

      const fetchReservations = async () => {
        try {
          const response = await fetch(
            `http://localhost:5001/general/favorite-organization-reservations?orgNames=${encodeURIComponent(
              orgNames
            )}`
          );
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
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
          setReservations([]); // Optionally reset reservations on error
        }
      };

      fetchOrganizations();
      fetchReservations();
    } else {
      // If no favorites, reset organizations and reservations
      setOrganizations([]);
      setReservations([]);
    }
  }, [favorites]);

  // Convert searchTerm to lower case once to optimize performance
  const lowerCaseSearchTerm = searchTerm.toLowerCase();

  // Filter organizations based on the search term
  const filteredOrganizations = organizations.filter((org) => {
    const name = org.name ? org.name.toLowerCase() : "";
    const description = org.description ? org.description.toLowerCase() : "";
    return (
      name.includes(lowerCaseSearchTerm) ||
      description.includes(lowerCaseSearchTerm)
    );
  });

  // Function to construct image URLs
  const getImageUrl = (profileImage) => {
    if (profileImage) {
      // Ensure the profileImage starts with a slash
      const normalizedPath = profileImage.startsWith("/")
        ? profileImage
        : `/${profileImage}`;
      return `http://localhost:5001${normalizedPath}`;
    }
    return defaultImage;
  };

  // Optional: Handle image loading errors by setting the src to defaultImage
  const handleImageError = (e) => {
    e.target.src = defaultImage;
  };

  // Adjusted navigateToMap function to pass relevant params
  const navigateToMap = (reservation) => {
    const organization = organizations.find(
      (org) => org.name === reservation.org_name
    );
    if (organization && reservation) {
      const params = new URLSearchParams({
        name: organization.name,
        startTime: reservation.start_time, // Send full start time (date and time)
        endTime: reservation.end_time, // Send full end time (date and time)
        location: reservation.location,
        description: reservation.description,
      });
      navigate(`/map?${params.toString()}`);
    }
  };

  return (
    <div className="favorites-page">
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
                src={getImageUrl(org.profile_image)}
                alt={org.name || "Organization"}
                className="club-image"
                onError={handleImageError} // Fallback to default image on error
              />
              <h2>{org.name || "No Name Provided"}</h2>
              <p>{org.description || "No Description Available"}</p>
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
                    src={getImageUrl(organization?.profile_image)}
                    alt={reservation.org_name || "Organization"}
                    className="banner-image"
                    onError={handleImageError} // Fallback to default image on error
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
                    <button
                      className="navigate-map-button"
                      onClick={() => navigateToMap(reservation)}
                    >
                      View on Map
                    </button>
                  </p>
                  <p>
                    <strong>Description: </strong>
                    {reservation.description || "No Description Available"}
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
