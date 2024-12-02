import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Search.css"; // Assuming you already have CSS for styling
import defaultImage from "../../assets/organization-default.png";

const Search = () => {
  const [organizations, setOrganizations] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // Search term state

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await fetch(
          "http://localhost:5001/general/organization-profiles"
        ); // Replace with your API endpoint
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // Optional: Validate data structure
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

    fetchOrganizations();
  }, []);

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

  return (
    <div className="search-page">
      <h1>Clubs and Organizations</h1>

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
                src={
                  org.profile_image
                    ? `http://localhost:5001${org.profile_image}`
                    : defaultImage
                }
                alt={org.name || "Organization"}
                className="club-image"
              />
              <h2>{org.name || "No Name Provided"}</h2>
              <p>{org.description || "No Description Available"}</p>
            </Link>
          ))
        ) : (
          <p>No organizations found</p>
        )}
      </div>
    </div>
  );
};

export default Search;
