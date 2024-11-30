// Example EditOrganizationPage.js
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const EditOrganizationPage = () => {
  const { orgId } = useParams();
  const [orgData, setOrgData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        const response = await fetch(`http://localhost:5001/general/organization/${orgId}`);
        const data = await response.json();
        if (response.ok) {
          setOrgData(data.organization);
        } else {
          setError(data.message || 'Failed to fetch organization data');
        }
      } catch (err) {
        console.error("Error fetching organization:", err);
        setError('An error occurred while fetching organization data.');
      }
    };

    fetchOrganization();
  }, [orgId]);

  const handleSave = async () => {
    // Implement save functionality
  };

  if (error) return <p>{error}</p>;
  if (!orgData) return <p>Loading...</p>;

  return (
    <div>
      <h1>Edit Organization: {orgData.name}</h1>
      {/* Implement form to edit organization */}
      <button onClick={handleSave}>Save Changes</button>
    </div>
  );
};

export default EditOrganizationPage;
