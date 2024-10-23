import './Map.css';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polygon } from "react-leaflet"
import { Icon, divIcon, point, LatLngBounds } from "leaflet";
import MarkerClusterGroup from 'react-leaflet-cluster';
import { useState, useEffect } from 'react';


// Custom component to handle map centering
function SetMapCenter({ userLocation }) {
  const map = useMap();

  // If userLocation is available, update the center of the map
  useEffect(() => {
    if (userLocation) {
      map.setView([userLocation.latitude, userLocation.longitude], 17);
    }
  }, [userLocation, map]);

  return null;
}

export default function Map() {
  const [userLocation, setUserLocation] = useState(null);
  const [events, setEvents] = useState([]);  // Store live events
  const [error, setError] = useState(null);
  const [noEventsMessage, setNoEventsMessage] = useState(''); // Message if no events
  const defaultLocation = [29.64929896217566, -82.34410532210882]; // Default location to centure tower/turlington


 
  // create custom icon
  const customIcon = new Icon({
    iconUrl: "/icons/side-table.png",
    iconSize: [35, 35] // size of the icon
  });


const userIcon = new Icon({
  iconUrl: "/icons/user.png",
  iconSize: [35, 35] // size of the icon
});


// custom cluster icon
const createClusterCustomIcon = function (cluster) {
  return new divIcon({
    html: `<span class="cluster-icon">${cluster.getChildCount()}</span>`,
    className: "custom-marker-cluster",
    iconSize: point(40, 40, true)
  });
};


  // Set the map bounds to prevent seeing duplicated Earths
  const bounds = new LatLngBounds(
    [-90, -180], // Southwest corner of the world
    [90, 180]    // Northeast corner of the world
  );


  

    // Fetch user location when component mounts
    useEffect(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            });
          },
          (error) => {
            setError(error.message);
          }
        );
      } else {
        setError('Geolocation is not supported by this browser.');
      }
    }, []);


  // Fetch live tabling events from the backend
  useEffect(() => {
    const fetchLiveEvents = async () => {
      try {
        const response = await fetch('http://localhost:5001/general/live-tabling-events');  // Corrected backend URL
        const data = await response.json();
  
        if (response.ok) {
          if (data.events.length === 0) {
            setNoEventsMessage('No live events happening right now');
          } else {
            setEvents(data.events);
          }
        } else {
          setError(data.error || 'Failed to fetch live events');
        }
      } catch (err) {
        setError('Failed to fetch live events');
      }
    };
  
    fetchLiveEvents();
  }, []);



  return (
    <MapContainer
      center={defaultLocation}
      zoom={17}
      minZoom={2.5}
      maxZoom={18}
      maxBounds={bounds}
      maxBoundsViscosity={1.0}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MarkerClusterGroup chunkedLoading>
        {events.map((event) => {
          const [lat, lng] = event.location.split(',').map(Number);  // Parse location string into lat/lng
          return (
            <Marker position={[lat, lng]} icon={customIcon} key={event._id}>
              <Popup>
                <strong>{event.org_name}</strong><br />
                {event.description || 'No description'}<br />
                {new Date(event.start_time).toLocaleTimeString()} - {new Date(event.end_time).toLocaleTimeString()}
              </Popup>
            </Marker>
          );
        })}
      </MarkerClusterGroup>

      {/* Show user location marker if location is available */}
      {userLocation && (
        <Marker position={[userLocation.latitude, userLocation.longitude]} icon={userIcon}>
          <Popup>You are here</Popup>
        </Marker>
      )}

      <SetMapCenter userLocation={userLocation} />

      {/* Show message if there are no live events */}
      {noEventsMessage && (
        <div className="no-events-message">
          {noEventsMessage}
        </div>
      )}

      {/* Show error message */}
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
    </MapContainer>
  );
}

