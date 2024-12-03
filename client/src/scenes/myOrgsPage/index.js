// MyOrgsPage.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./MyOrgsPage.css"; // Ensure this CSS file exists and is correctly styled
import defaultImage from "../../assets/organization-default.png";

const BACKEND_URL = 'http://localhost:5001'; // Update if necessary

const MyOrgsPage = () => {
  const [organizations, setOrganizations] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const getStoredOrganizations = () => {
    try {
      const storedOrgs = JSON.parse(localStorage.getItem('organizations')) || [];
      return storedOrgs;
    } catch (err) {
      console.error("Error parsing organizations from localStorage:", err);
      return [];
    }
  };

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const storedOrgs = getStoredOrganizations();
        if (storedOrgs.length === 0) {
          setOrganizations([]);
          return;
        }

        // Choose to filter by name or _id
        const orgNames = storedOrgs.map(org => org.name); // or use org._id
        const orgNamesQuery = encodeURIComponent(JSON.stringify(orgNames));

        const response = await fetch(
          `${BACKEND_URL}/general/organization-profiles?orgNames=${orgNamesQuery}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setOrganizations(data);
      } catch (error) {
        console.error("Error fetching organizations:", error);
        setError('Failed to fetch organizations. Please try again later.');
      }
    };
    fetchOrganizations();
  }, []);

  const updateLocalStorage = (updatedOrg) => {
    try {
      const orgs = JSON.parse(localStorage.getItem('organizations')) || [];
      const updatedOrgs = orgs.map(org => org._id === updatedOrg._id ? updatedOrg : org);
      localStorage.setItem('organizations', JSON.stringify(updatedOrgs));
    } catch (err) {
      console.error("Error updating localStorage:", err);
    }
  };

  const handleOrgClick = (org) => {
    setSelectedOrg(org);
    updateLocalStorage(org);
    console.log('Selected Organization:', org);
    // Note: setSelectedOrg is asynchronous. If you need to act upon selectedOrg after setting it,
    // consider using useEffect to watch for changes in selectedOrg.
  };

  const handleEdit = () => {
    if (selectedOrg) {
      navigate(`/edit-organization-profile/`, { state: { orgName: selectedOrg.name, orgId: selectedOrg._id } });
    }
  };

  const handleAddEvent = () => {
    if (selectedOrg) {
      navigate(`/addevent/`, { state: { orgName: selectedOrg.name } });
    }
  };

  return (
    <div className="my-orgs-page">
      <h1>My Organizations</h1>

      {error && <p className="error-message">{error}</p>}

      {organizations.length > 0 ? (
        <div className="org-grid">
          {organizations.map((org) => (
            <div
              key={org._id}
              className={`org-card ${selectedOrg && selectedOrg._id === org._id ? 'selected' : ''}`}
              onClick={() => handleOrgClick(org)}
              role="button" // Makes the div accessible as a button
              tabIndex={0} // Allows keyboard navigation
              onKeyPress={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleOrgClick(org);
                }
              }}
            >
              <img
                src={org.profile_image ? `${BACKEND_URL}${org.profile_image}` : defaultImage}
                alt={org.name || "Organization"}
                className="org-image"
                onError={(e) => { e.target.src = defaultImage; }}
              />
              <h2 className="org-name">{org.name}</h2>
              {/* Conditional Rendering of Description */}
              {org.description && (
                <p className="org-description">{org.description}</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>You are not a member of any organizations.</p>
      )}

      {selectedOrg && (
        <div className="action-buttons">
          <button onClick={handleEdit} className="edit-button">Edit</button>
          <button onClick={handleAddEvent} className="add-event-button">Add Event</button>
        </div>
      )}
    </div>
  );
};

export default MyOrgsPage;