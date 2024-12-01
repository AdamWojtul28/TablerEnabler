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
      } catch (err) {
        console.error("Error fetching your organizations:", err);
        setError('An error occurred while fetching your organizations.');
      }
    };

    fetchMyOrganizations();
  }, []);

  const updateLocalStorage = (updatedOrg) => {
    const orgs = JSON.parse(localStorage.getItem('organizations')) || [];
    const updatedOrgs = orgs.map(org => org._id === updatedOrg._id ? updatedOrg : org);
    localStorage.setItem('organizations', JSON.stringify(updatedOrgs));
  };

  
  const handleOrgClick = (org) => {
    setSelectedOrg(org);
    updateLocalStorage(org)
    console.log('This is the org details:', org)
    console.log('This is the selectedOrg details:', selectedOrg)
    console.log('This is the organizations details:', organizations)
  };

  const handleEdit = () => {
    if (selectedOrg) {
      navigate(`/edit-organization-profile/`, { state: { orgName: selectedOrg.name, orgId: selectedOrg._id } });  // Pass orgName and _id as state
    }
  };

  const handleAddEvent = () => {
    if (selectedOrg) {
      navigate(`/addevent/`, { state: { orgName: selectedOrg.name} }); // Pass orgName as state
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
                src={org.profile_image ? `http://localhost:5001${org.profile_image}` : defaultImage}
                alt={org.name}
                className="org-image"
              />
              <h2 className="org-name">{org.name}</h2>
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
