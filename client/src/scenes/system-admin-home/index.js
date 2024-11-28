import React, { useState, useEffect } from "react";
import "./SystemAdminHome.css";

const SystemAdminHome = () => {
  const [organizations, setOrganizations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [comment, setComment] = useState("");
  const [selectedOrgIndex, setSelectedOrgIndex] = useState(null);

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await fetch(
          "http://localhost:5001/general/pending-organization-profiles"
        );
        const data = await response.json();
        console.log("Fetched organizations:", data); // Debug fetched data
        setOrganizations(data);
      } catch (error) {
        console.error("Error fetching organizations:", error);
      }
    };
  
    fetchOrganizations();
  }, []);
  


  const refreshOrganizations = async () => {
    try {
      const response = await fetch(
        "http://localhost:5001/general/pending-organization-profiles"
      );
      const data = await response.json();
      setOrganizations(data); // Ensure this updates with the latest data
    } catch (error) {
      console.error("Error refreshing organizations:", error);
    }
  };
  

  const approveOrganization = async (index) => {
    const org = organizations[index];
    const orgName = org.name;
  
    try {
      // Update pending organization profile status to "Approved"
      const response = await fetch(
        `http://localhost:5001/general/pending-organization-profile?name=${encodeURIComponent(
          orgName
        )}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: "Approved",
          }),
        }
      );
  
      if (response.ok) {
        // Update the local state immediately
        setOrganizations((prevOrgs) =>
          prevOrgs.map((o, i) =>
            i === index ? { ...o, status: "Approved" } : o
          )
        );
  
        alert(`${orgName} status updated!`);
  
        // Update officer roles in the database
        if (Array.isArray(org.officers)) {
          console.log("Officers to update:", org.officers);
          for (const officerEmail of org.officers) {
            console.log(`Updating role for officer: ${officerEmail}`);
            try {
              // Update the officer role in the database
              const roleResponse = await fetch(
                `http://localhost:5001/general/student-role`,
                {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    email: officerEmail, // Email of the officer
                    role: "officer", // New role for the officer
                  }),
                }
              );
  
              if (!roleResponse.ok) {
                console.error(`Failed to update role for ${officerEmail}`);
              } else {
                console.log(`Role updated for ${officerEmail}`);
              }
            } catch (error) {
              console.error(`Error updating role for ${officerEmail}:`, error);
            }
          }
        } else {
          console.warn("No officers provided for this organization.");
        }
  
        // Refresh organizations to sync data
        refreshOrganizations();
      } else {
        alert("Failed to update organization status.");
      }
    } catch (error) {
      console.error("Error updating organization status:", error);
      alert("An error occurred while updating the organization.");
    }
  
    try {
      // Create official organization profile
      const profileResponse = await fetch(
        `http://localhost:5001/general/organization-profile`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: org.name,
            description: org.description,
            profile_image: org.profile_image || null, // Ensure profile image is optional
            createdAt: new Date().toISOString(),
          }),
        }
      );
  
      if (profileResponse.ok) {
        alert(`${orgName} now has an official organization profile!`);
      } else {
        alert("Failed to create organization profile.");
      }
    } catch (error) {
      console.error("Error creating organization profile:", error);
      alert("An error occurred while creating the organization profile.");
    }
  };
  
  
  
  

  const handleRemoveClick = async (index) => {
    setSelectedOrgIndex(index);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setComment("");
  };

  const handleRemoveSubmit = async () => {
    const orgName = organizations[selectedOrgIndex].name;
  
    try {
      const response = await fetch(
        `http://localhost:5001/general/pending-organization-profile?name=${encodeURIComponent(
          orgName
        )}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: "Rejected",
            adminComments: comment,
          }),
        }
      );
  
      if (response.ok) {
        // Update the local state immediately
        setOrganizations((prevOrgs) =>
          prevOrgs.map((org, i) =>
            i === selectedOrgIndex ? { ...org, status: "Rejected" } : org
          )
        );
        alert(`${orgName} status updated!`);
      } else {
        alert("Failed to update status");
      }
    } catch (error) {
      console.error("No such organization:", error);
      alert("An error occurred.");
    }
  
    setShowModal(false);
    setComment("");
  };
  

  return (
    <div className="system-admin-home">
      <h1>System Admin Panel</h1>

      {/* Approve Organizations Section */}
      <div className="manage-section">
        <h2>Approve Organizations</h2>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Description</th>
              <th>Officers</th>
              <th>Approved</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {organizations.map((org, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{org.name}</td>
                <td>{org.description}</td>
                <td>{org.officer?.join(", ") || "N/A"}</td>
                <td>{org.status}</td>
                <td>
                  {org.status === "Pending" && (
                    <>
                      <button
                        style={{ marginRight: "10px" }}
                        onClick={() => approveOrganization(index)}
                      >
                        Approve
                      </button>
                      <button onClick={() => handleRemoveClick(index)}>
                        Remove
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={handleModalClose}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>
              Please provide feedback about why this organization was rejected
            </h2>
            <textarea
              placeholder="Enter your comments here..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <div>
              <button onClick={handleRemoveSubmit}>Submit</button>
              <button onClick={handleModalClose}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemAdminHome;
