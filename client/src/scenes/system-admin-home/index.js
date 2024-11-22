import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SystemAdminHome.css";

const SystemAdminHome = () => {
  const [organizations, setOrganizations] = useState([]);
  const [tablingReservations, setTablingReservations] = useState([]);

  // Default data for organizations
  const defaultOrganizations = [
    {
      name: "Coding Club",
      description: "A club for coding enthusiasts.",
      officers: ["Alice Smith", "Bob Johnson"],
      approved: false,
    },
    {
      name: "AI Society",
      description: "Promoting AI knowledge.",
      officers: ["Jane Doe", "John Snow"],
      approved: false,
    },
  ];

  // Default data for tabling reservations
  const defaultReservations = [
    {
      org_name: "Coding Club",
      start_time: new Date().toISOString(),
      end_time: new Date(Date.now() + 3600000).toISOString(),
      location: "Reitz Lawn",
      description: "Recruiting new members",
      createdAt: new Date().toISOString(),
    },
    {
      org_name: "AI Society",
      start_time: new Date().toISOString(),
      end_time: new Date(Date.now() + 7200000).toISOString(),
      location: "Turlington Plaza",
      description: "Showcasing AI projects",
      createdAt: new Date().toISOString(),
    },
  ];

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await fetch(
          "http://localhost:5001/general/organization-profiles"
        ); // Replace with your API endpoint
        const data = await response.json();
        setOrganizations(data);
      } catch (error) {
        console.error("Error fetching organizations:", error);
        setOrganizations(defaultOrganizations); // Use default data on error
      }
    };

    const fetchTablingReservations = async () => {
      try {
        const response = await fetch(
          "http://localhost:5001/general/tabling-reservations"
        ); // Replace with your API endpoint
        const data = await response.json();
        setTablingReservations(data);
      } catch (error) {
        console.error("Error fetching tabling reservations:", error);
        setTablingReservations(defaultReservations); // Use default data on error
      }
    };

    fetchOrganizations();
    fetchTablingReservations();
  }, []);

  const approveOrganization = (index) => {
    const updatedOrganizations = [...organizations];
    updatedOrganizations[index].approved = true;
    setOrganizations(updatedOrganizations);
    // Save changes to server (optional)
  };

  const handleReservationApproval = (index) => {
    const updatedReservations = [...tablingReservations];
    updatedReservations.splice(index, 1); // Remove approved reservation
    setTablingReservations(updatedReservations);
    // Save changes to server (optional)
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
                <td>{org.officers?.join(", ") || "N/A"}</td>
                <td>{org.approved ? "Yes" : "No"}</td>
                <td>
                  {!org.approved && (
                    <button onClick={() => approveOrganization(index)}>
                      Approve
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Approve Tabling Reservations Section */}
      <div className="manage-section">
        <h2>Approve Tabling Reservations</h2>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Organization</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Location</th>
              <th>Description</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {tablingReservations.map((reservation, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{reservation.org_name}</td>
                <td>{new Date(reservation.start_time).toLocaleString()}</td>
                <td>{new Date(reservation.end_time).toLocaleString()}</td>
                <td>{reservation.location}</td>
                <td>{reservation.description || "N/A"}</td>
                <td>
                  <button onClick={() => handleReservationApproval(index)}>
                    Approve
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SystemAdminHome;
