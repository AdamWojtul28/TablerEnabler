import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./EditOrganizationPage.css";
import defaultImage from "../../../assets/organization-default.png";

const EditOrganizationPage = () => {
  const [organization, setOrganization] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const location = useLocation();
  const { orgName } = location.state || {};

  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        const response = await fetch(
          `http://localhost:5001/general/organization-profile?name=${encodeURIComponent(
            orgName
          )}`
        );
        const data = await response.json();
        setOrganization(data);
        setName(data.name);
        setDescription(data.description);
      } catch (error) {
        console.error("Error fetching organization:", error);
        setError("Error loading organization data.");
      }
    };

    fetchOrganization();
  }, [orgName]);

  const handleNameChange = async () => {
    try {
      const response = await fetch("http://localhost:5001/update-organization-name", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentName: orgName, newName: name }),
      });
      if (response.ok) {
        setMessage("Name updated successfully!");
        setError("");
      } else {
        throw new Error("Failed to update name.");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDescriptionChange = async () => {
    try {
      const response = await fetch("http://localhost:5001/update-organization-description", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: orgName, description }),
      });
      if (response.ok) {
        setMessage("Description updated successfully!");
        setError("");
      } else {
        throw new Error("Failed to update description.");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async () => {
    const formData = new FormData();
    formData.append("profile_image", profileImage);
    formData.append("name", orgName);

    try {
      const response = await fetch("http://localhost:5001/update-organization-image", {
        method: "PUT",
        body: formData,
      });
      if (response.ok) {
        setMessage("Image updated successfully!");
        setError("");
      } else {
        throw new Error("Failed to update image.");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  if (!organization) {
    return <div>Loading...</div>;
  }

  return (
    <div className="edit-organization-page">
      <div className="organization-header">
        <h1>Edit Organization</h1>
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
      </div>
      <div className="form-group">
        <label htmlFor="name">Organization Name:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button onClick={handleNameChange}>Update Name</button>
      </div>
      <div className="form-group">
        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button onClick={handleDescriptionChange}>Update Description</button>
      </div>
      <div className="form-group">
        <label>Profile Image:</label>
        <img
          src={previewImage || (organization.profile_image ? `http://localhost:5001${organization.profile_image}` : defaultImage)}
          alt={name || "Default Organization"}
          className="organization-image"
        />
        <input type="file" onChange={handleImageChange} />
        <button onClick={handleImageUpload}>Upload New Image</button>
      </div>
    </div>
  );
};

export default EditOrganizationPage;
