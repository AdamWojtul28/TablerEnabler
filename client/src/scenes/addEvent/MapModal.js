import './MapModal.css';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import { useState, useEffect } from "react";
import { Icon } from "leaflet";

const customIcon = new Icon({
  iconUrl: "/icons/pin.png",
  iconSize: [35, 35],
  iconAnchor: [17, 35],
  popupAnchor: [0, -35],
});

const tableIcon = new Icon({
  iconUrl: "/icons/side-table.png",
  iconSize: [35, 35],
  iconAnchor: [17, 35],
  popupAnchor: [0, -35],
});

// Custom component to capture map clicks and place a marker
function LocationMarker({ onPositionSelect }) {
  const [position, setPosition] = useState(null);

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition(e.latlng);
      onPositionSelect(e.latlng);
    },
  });

  return position ? <Marker position={position} icon={customIcon} /> : null;
}

export default function MapModal({ onMapClick, onClose, eventDate, startTime, endTime }) {
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false); // Track loading state
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch events only if all required fields are filled
    if (!eventDate || !startTime || !endTime) {
      setEvents([]); // Clear events if inputs are incomplete
      return;
    }

    const fetchEventsForTimeRange = async () => {
      const startDateTime = new Date(`${eventDate}T${startTime}`).toISOString();
      const endDateTime = new Date(`${eventDate}T${endTime}`).toISOString();

      setLoading(true);
      setError(null);
      setEvents([]);

      try {
        const response = await fetch(
          `http://localhost:5001/general/events-during?start_time=${startDateTime}&end_time=${endDateTime}`
        );
        const data = await response.json();

        if (response.ok) {
          setEvents(data || []);
        } else {
          setError(data.error || "Failed to fetch events.");
        }
      } catch (err) {
        setError("Failed to fetch events.");
      } finally {
        setLoading(false);
      }
    };

    fetchEventsForTimeRange();
  }, [eventDate, startTime, endTime]);

  const handleConfirm = () => {
    if (selectedPosition) {
      onMapClick(selectedPosition);
    }
  };

  return (
    <div className="map-modal">
      <div className="map-modal-content">
        <button className="close-button" onClick={onClose}>X</button>

        <MapContainer
          center={[29.64929896217566, -82.34410532210882]}
          zoom={17}
          style={{ height: '400px', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {/* Conditionally display event markers */}
          {eventDate && startTime && endTime && events.map((event) => {
            const [lat, lng] = event.location.split(',').map(Number);
            return (
              <Marker position={[lat, lng]} icon={tableIcon} key={event._id}>
                <Popup>
                  <strong>{event.org_name}</strong><br />
                  {event.description || 'No description'}<br />
                  {new Date(event.start_time).toLocaleTimeString()} - {new Date(event.end_time).toLocaleTimeString()}
                </Popup>
              </Marker>
            );
          })}

          <LocationMarker onPositionSelect={setSelectedPosition} />
        </MapContainer>

        <div className="confirm-section">
          {selectedPosition ? (
            <p className="selected-coordinates">
              Coordinates selected: {selectedPosition.lat}, {selectedPosition.lng}
            </p>
          ) : (
            <p className="no-coordinates">No coordinates selected</p>
          )}

          <button
            className="confirm-button"
            onClick={handleConfirm}
            disabled={!selectedPosition}
          >
            Confirm Coordinates
          </button>
        </div>

        {loading && <p className="loading-message">Loading events...</p>}

        {!loading && events.length === 0 && !error && eventDate && startTime && endTime && (
          <p className="no-events-message-small-map">There's no events found for the selected time.</p>
        )}

        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
}
