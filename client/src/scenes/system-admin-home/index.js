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
        setOrganizations(data);
      } catch (error) {
        console.error("Error fetching organizations:", error);
      }
    };

    fetchOrganizations();
  }, organizations);

  const approveOrganization = async (index) => {
    const updatedOrganizations = [...organizations];
    updatedOrganizations[index].status = "Approved";
    alert(JSON.stringify(updatedOrganizations[index]));
    setOrganizations(updatedOrganizations);

    let orgName = updatedOrganizations[index].name;

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
            status: "Approved",
          }),
        }
      );
      if (response.ok) {
        alert(`${orgName} status updated!`);
      } else {
        alert("Failed to update status");
      }
    } catch (error) {
      console.error("No such organization:", error);
      alert("An error occurred.");
    }

    try {
      const response = await fetch(
        `http://localhost:5001/general/organization-profile`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: updatedOrganizations[index].name,
            description: updatedOrganizations[index].description,
            profile_image: updatedOrganizations[index].profile_image,
            createdAt: Date.now,
          }),
        }
      );
      if (response.ok) {
        alert(`${orgName} now has an official organization profile!`);
      } else {
        alert("Failed to make profile");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred.");
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
    const updatedOrganizations = [...organizations];
    setOrganizations(updatedOrganizations);
    setShowModal(false);

    let orgName = updatedOrganizations[selectedOrgIndex].name;

    alert(orgName);

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
        alert(`${orgName} status updated!`);
      } else {
        alert("Failed to update status");
      }
    } catch (error) {
      console.error("No such organization:", error);
      alert("An error occurred.");
    }
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
