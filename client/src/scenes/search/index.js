import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Search.css"; // Assuming you already have CSS for styling

const Search = () => {
  const [organizations, setOrganizations] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // Search term state

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await fetch(
          "http://localhost:5001/general/organization-profiles"
        ); // Replace with your API endpoint
        const data = await response.json();
        setOrganizations(data); // Set the organizations data
      } catch (error) {
        console.error("Error fetching organizations:", error);
      }
    };

    fetchOrganizations();
  }, []);

  // Filter organizations based on the search term
  const filteredOrganizations = organizations.filter(
    (org) =>
      org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                src={org.profile_image || "default-image-url.jpg"}
                alt={org.name}
                className="club-image"
              />
              <h2>{org.name}</h2>
              <p>{org.description}</p>
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
