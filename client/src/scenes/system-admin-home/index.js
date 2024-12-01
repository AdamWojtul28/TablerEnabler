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
    const org = organizations[index]; // Get the organization details from the state
    const orgName = org.name;
  
    try {
      // Step 1: Update status to "Approved" in pending profiles
      const updateResponse = await fetch(
        `http://localhost:5001/general/pending-organization-profile?name=${encodeURIComponent(orgName)}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "Approved" }),
        }
      );
  
      if (!updateResponse.ok) {
        console.error("Failed to update organization status:", await updateResponse.text());
        alert("Failed to update organization status.");
        return;
      }
  
      console.log(`${orgName} status updated to Approved!`);
  
      // Step 2: Create an actual organization profile
      const createProfileResponse = await fetch(
        `http://localhost:5001/general/organization-profile`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: org.name,
            description: org.description || "",
            profile_image: org.profile_image || null, // Handle optional profile image
            createdAt: new Date().toISOString(), // Ensure the correct format
          }),
        }
      );
  
      if (!createProfileResponse.ok) {
        console.error("Failed to create organization profile:", await createProfileResponse.text());
        alert("Failed to create organization profile.");
        return;
      }
  
      console.log(`${orgName} now has an official organization profile!`);
      alert(`${orgName} approved and organization profile created!`);
  
      // Step 3: Update officers if provided
      if (Array.isArray(org.officers)) {
        for (const officerEntry of org.officers) {
          const [email, position] = officerEntry.split(":");
          try {
            const officerResponse = await fetch(
              `http://localhost:5001/general/student-role-officer`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  email,
                  position,
                  organization: orgName,
                }),
              }
            );
  
            if (!officerResponse.ok) {
              console.error(`Failed to update officer ${email}:`, await officerResponse.text());
            } else {
              console.log(`Officer ${email} updated successfully.`);
            }
          } catch (error) {
            console.error(`Error updating officer ${email}:`, error);
          }
        }
      }
  
      // Refresh the organization list after approval
      refreshOrganizations();
    } catch (error) {
      console.error("Error during approval process:", error);
      alert("An error occurred while approving the organization.");
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
