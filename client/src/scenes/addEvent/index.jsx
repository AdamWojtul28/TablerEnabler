import { useState } from "react";
import './AddEvent.css';
import MapModal from './MapModal'; // Import the map modal component (we will create this next)

export default function AddEvent() {
  const [orgName, setOrgName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showMapModal, setShowMapModal] = useState(false); // To toggle the map modal

  const handleMapClick = (coords) => {
    setLocation(`${coords.lat}, ${coords.lng}`); // Set location from map click
    setShowMapModal(false); // Close modal after selection
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const eventDetails = {
      org_name: orgName,
      start_time: new Date(startTime).toISOString(),
      end_time: new Date(endTime).toISOString(),
      location,
      description,
    };

    try {
      const response = await fetch("http://localhost:5001/general/tabling-reservation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventDetails),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Event added successfully!");
        setError("");
        setOrgName("");
        setStartTime("");
        setEndTime("");
        setLocation("");
        setDescription("");
      } else {
        setError(data.error || "Failed to add event.");
        setMessage("");
      }
    } catch (err) {
      setError("Error: Could not connect to the server.");
      setMessage("");
    }
  };

  return (
    <div className="add-event-container">
      <div className="add-event-form">
        <h1>Add New Event</h1>
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="orgName">Organization Name:</label>
            <input
              type="text"
              id="orgName"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="startTime">Start Time:</label>
            <input
              type="datetime-local"
              id="startTime"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="endTime">End Time:</label>
            <input
              type="datetime-local"
              id="endTime"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">Location (latitude, longitude):</label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., 29.648996, -82.343920"
              required
            />
            <button className="select-map-button" type="button" onClick={() => setShowMapModal(true)}>
              Select on Map
            </button>

          </div>

          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the event (optional)"
            />
          </div>

          <button className="add-event-button" type="submit">Add Event</button>
        </form>

        {/* Show map modal if triggered */}
        {showMapModal && <MapModal onMapClick={handleMapClick} onClose={() => setShowMapModal(false)} />}
      </div>
    </div>
  );
}
