// MyOrgsPage.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./MyOrgsPage.css"; // Create this CSS file for styling
import defaultImage from "../../assets/organization-default.png";

const BACKEND_URL = 'http://localhost:5001'; // Update if necessary

const MyOrgsPage = () => {
  const [organizations, setOrganizations] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyOrganizations = async () => {
      try {
        // Option 1: Fetch from localStorage
        const orgs = JSON.parse(localStorage.getItem('organizations'));
        if (orgs && Array.isArray(orgs)) {
          setOrganizations(orgs);
        } else {
          setOrganizations([]);
        }

        // Option 2: Fetch from API (Uncomment if you have an endpoint)
        /*
        const token = localStorage.getItem('token'); // Assuming you use token-based auth
        const response = await fetch(`${BACKEND_URL}/officer/my-organizations`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setOrganizations(data.organizations);
        } else {
          const errorData = await response.json();
          setError(errorData.message || 'Failed to fetch your organizations');
        }
        */
      } catch (err) {
        console.error("Error fetching your organizations:", err);
        setError('An error occurred while fetching your organizations.');
      }
    };

    fetchMyOrganizations();
  }, []);

  const handleOrgClick = (org) => {
    setSelectedOrg(org);
  };

  const handleEdit = () => {
    if (selectedOrg) {
      navigate(`/edit-organization/${selectedOrg._id}`); // Ensure this route exists
    }
  };

  const handleAddEvent = () => {
    if (selectedOrg) {
      navigate(`/addevent/`, { state: { orgName: selectedOrg.name } }); // Pass orgName as state
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
            >
              <img
                src={org.profile_image ? `${BACKEND_URL}${org.profile_image}` : defaultImage}
                alt={org.name}
                className="org-image"
              />
              <h2>{org.name}</h2>
              <p>{org.description}</p>
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
