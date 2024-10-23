import './MapModal.css';
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState } from 'react';
import { Icon } from "leaflet";

const customIcon = new Icon({
    iconUrl: "/icons/pin.png", 
    iconSize: [35, 35], 
    iconAnchor: [17, 35], 
    popupAnchor: [0, -35] 
  });


// Custom component to capture map clicks and place a marker
function LocationMarker({ onPositionSelect }) {
    const [position, setPosition] = useState(null);
  
    // Handle map click event to place marker and set position
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setPosition(e.latlng); // Update the marker position locally
        onPositionSelect(e.latlng); // Pass selected coordinates to parent component
      },
    });
  
    return position === null ? null : (
      <Marker position={position} icon={customIcon} /> // Use custom icon for marker
    );
  }
  
  export default function MapModal({ onMapClick, onClose }) {
    const [selectedPosition, setSelectedPosition] = useState(null);
  
    // Handle "Confirm" button click
    const handleConfirm = () => {
      if (selectedPosition) {
        onMapClick(selectedPosition); // Pass the selected coordinates to the parent component
      }
    };
  
    return (
      <div className="map-modal">
        <div className="map-modal-content">
          <button className="close-button" onClick={onClose}>Close</button>
          
          <MapContainer
            center={[29.64929896217566, -82.34410532210882]} // Default center (you can change this if needed)
            zoom={17}
            style={{ height: '400px', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            
            {/* Pass the selected position to parent when a marker is placed */}
            <LocationMarker onPositionSelect={setSelectedPosition} />
          </MapContainer>
  
          <div className="confirm-section">
            {/* Display coordinates in black if selected */}
            {selectedPosition ? (
              <p className="selected-coordinates">
                Coordinates selected: {selectedPosition.lat}, {selectedPosition.lng}
              </p>
            ) : (
              <p className="no-coordinates">No coordinates selected</p>
            )}
            
            {/* Display confirm button, make it disabled if no position is selected */}
            <button
              className="confirm-button"
              onClick={handleConfirm}
              disabled={!selectedPosition} // Disable button if no position is selected
            >
              Confirm Coordinates
            </button>
          </div>
        </div>
      </div>
    );
  }