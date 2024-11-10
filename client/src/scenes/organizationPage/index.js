import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./OrganizationPage.css";

const OrganizationPage = () => {
  const [organization, setOrganization] = useState(null);
  const [socialMedia, setSocialMedia] = useState([]);
  const location = useLocation();

  // Extract the 'name' query parameter from the URL
  const queryParams = new URLSearchParams(location.search);
  const orgName = queryParams.get("name");

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
      } catch (error) {
        console.error("Error fetching organization:", error);
      }
    };

    const fetchSocialMedia = async () => {
      try {
        const response = await fetch(
          `http://localhost:5001/general/organization-socials?org_name=${encodeURIComponent(
            orgName
          )}`
        );
        const socialData = await response.json();
        setSocialMedia(socialData);
      } catch (error) {
        console.error("Error fetching social media:", error);
      }
    };

    if (orgName) {
      fetchOrganization();
      fetchSocialMedia();
    }
  }, [orgName]);

  if (!organization) {
    return <div>Loading...</div>;
  }

  return (
    <div className="organization-page">
      <h1>{organization.name}</h1>
      {/* Smooth grey box wrapping the purpose and description */}
      <div className="smooth-grey-box">
        <div className="left-section">
          <h2>Organization Purpose:</h2>
          <p>{organization.description}</p>
        </div>
        <div className="right-section">
          <img
            src={organization.profile_image || "default-image-url.jpg"}
            alt={organization.name}
            className="organization-image"
          />
        </div>

        <h2>Tabling Calendar Placeholder:</h2>
        <p>Event dates</p>

        <h2>Contact Information</h2>
        {/* Social media section */}
        <div className="social-media-section">
          <h2>Follow Us</h2>
          <div className="social-media-links">
            {socialMedia.map((social) => (
              <a
                key={social.application_name}
                href={social.application_link}
                target="_blank"
                rel="noopener noreferrer"
                className="social-media-link"
              >
                <img
                  src={`/icons/${social.application_name}-icon.png`} // Assumes local icons for each platform
                  alt={`/icons/${social.application_link} icon`}
                  className="social-media-icon"
                />
                <span>{social.platform}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationPage;
