// Map.js
import './Map.css';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Icon, divIcon, point } from "leaflet";
import MarkerClusterGroup from 'react-leaflet-cluster'; // Ensure correct import
import { useState, useEffect, useRef } from 'react';

// Define the backend URL
const BACKEND_URL = 'http://localhost:5001'; // Update if necessary

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
  const [orgProfiles, setOrgProfiles] = useState({}); // Store organization profiles
  const [error, setError] = useState(null);
  const [noEventsMessage, setNoEventsMessage] = useState(''); // Message if no events
  const defaultLocation = [29.64929896217566, -82.34410532210882]; // Default location

  // Create custom icons
  const customIcon = new Icon({
    iconUrl: "/icons/side-table.png",
    iconSize: [35, 35] // size of the icon
  });

  const userIcon = new Icon({
    iconUrl: "/icons/user.png",
    iconSize: [35, 35] // size of the icon
  });

  const createClusterCustomIcon = (cluster) => {
    return new divIcon({
      html: `<span class="cluster-icon">${cluster.getChildCount()}</span>`,
      iconSize: point(40, 40, true),
    });
  };

  // Refs to manage markers
  const markersRef = useRef({});
  const popupOpenedRef = useRef({}); // Track which popups have been opened

  // Reference to the MarkerClusterGroup
  const clusterGroupRef = useRef();

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
        const response = await fetch(`${BACKEND_URL}/general/live-tabling-events`);
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

  // Fetch organization profiles based on events
  useEffect(() => {
    const fetchOrganizationProfiles = async () => {
      try {
        // Extract unique organization names from events
        const orgNamesSet = new Set(events.map(event => event.org_name));
        const orgNamesArray = Array.from(orgNamesSet);

        // If no organizations, skip fetching
        if (orgNamesArray.length === 0) {
          setOrgProfiles({});
          return;
        }

        // Prepare query parameter
        const orgNamesParam = JSON.stringify(orgNamesArray);

        const response = await fetch(`${BACKEND_URL}/general/organization-profiles?orgNames=${encodeURIComponent(orgNamesParam)}`);
        const data = await response.json();

        if (response.ok) {
          // Create a mapping from org_name to profile
          const orgProfileMap = {};
          data.forEach(org => {
            orgProfileMap[org.name] = org;
          });
          setOrgProfiles(orgProfileMap);
        } else {
          console.error(data.error || 'Failed to fetch organization profiles');
        }
      } catch (err) {
        console.error('Failed to fetch organization profiles', err);
      }
    };

    if (events.length > 0) {
      fetchOrganizationProfiles();
    }
  }, [events]);

  // Open all popups by default after events are loaded
  useEffect(() => {
    events.forEach(event => {
      const marker = markersRef.current[event._id];
      if (marker) {
        marker.openPopup();
        popupOpenedRef.current[event._id] = true; // Mark as opened
      }
    });
  }, [events]);

  // Handler to open a popup
  const handleOpenPopup = (id) => {
    const marker = markersRef.current[id];
    if (marker) {
      marker.openPopup();
      popupOpenedRef.current[id] = true; // Mark as opened
    }
  };

  // Handler for cluster clicks
  const handleClusterClick = (cluster) => {
    console.log('Cluster object:', cluster); // Debugging
    if (cluster && typeof cluster.getAllChildMarkers === 'function') {
      const markers = cluster.getAllChildMarkers();
      markers.forEach(marker => {
        if (marker && marker.openPopup) {
          // Introduce a slight delay to ensure markers are rendered
          setTimeout(() => {
            marker.openPopup();
            // Mark the popup as opened
            const markerId = Object.keys(markersRef.current).find(
              key => markersRef.current[key] === marker
            );
            if (markerId) {
              popupOpenedRef.current[markerId] = true;
            }
          }, 100); // 100ms delay
        }
      });
    } else {
      console.error('Invalid cluster object:', cluster);
    }
  };

  // Attach cluster event listeners
  useEffect(() => {
    const clusterGroup = clusterGroupRef.current;
    if (!clusterGroup) return;

    // Attach 'clusterclick' event listener
    clusterGroup.on('clusterclick', (e) => handleClusterClick(e.layer));

    // Cleanup on unmount
    return () => {
      clusterGroup.off('clusterclick', (e) => handleClusterClick(e.layer));
    };
  }, [clusterGroupRef, events]);

  // Handler for map zoom end to open popups for markers that are now visible individually
  const handleMapZoomEnd = () => {
    events.forEach(event => {
      const marker = markersRef.current[event._id];
      if (marker) {
        // Check if the marker is currently on the map (i.e., not clustered)
        if (marker._map && !popupOpenedRef.current[event._id]) {
          marker.openPopup();
          popupOpenedRef.current[event._id] = true; // Mark as opened
        }
      }
    });
  };

  return (
    <MapContainer
      center={defaultLocation}
      zoom={17}
      minZoom={2.5}
      maxZoom={18}
      maxBoundsViscosity={1.0}
      whenCreated={(mapInstance) => {
        mapInstance.on('zoomend', handleMapZoomEnd);
      }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MarkerClusterGroup
        chunkedLoading
        className="custom-marker-cluster"
        iconCreateFunction={createClusterCustomIcon}
        ref={clusterGroupRef}
        onClusterclick={(e) => handleClusterClick(e.layer)} // Pass the cluster instance
      >
        {events.map((event) => {
          const [lat, lng] = event.location.split(',').map(Number); // Parse location string into lat/lng

          // Validate latitude and longitude
          if (isNaN(lat) || isNaN(lng)) {
            console.error(`Invalid location for event ${event._id}: ${event.location}`);
            return null; // Skip rendering this marker
          }

          // Ensure event has a unique _id
          if (!event._id) {
            console.error(`Event is missing _id: ${JSON.stringify(event)}`);
            return null;
          }

          // Get the organization's profile using org_name
          const orgProfile = orgProfiles[event.org_name];

          return (
            <Marker
              position={[lat, lng]}
              icon={customIcon}
              key={event._id}
              ref={(el) => { markersRef.current[event._id] = el; }}
              eventHandlers={{
                add: () => {
                  // This event is triggered when the marker is added to the map
                  // Only open the popup if it hasn't been opened yet
                  if (!popupOpenedRef.current[event._id]) {
                    handleOpenPopup(event._id);
                  }
                },
                click: () => handleOpenPopup(event._id),
              }}
            >
              <Popup
                autoClose={false}
                closeOnClick={false}
              >
                <div className="popup-content">
                  {/* Leaflet's default close button is present */}
                  <strong>{event.org_name}</strong><br />
                  {event.description || 'No description'}<br />
                  {new Date(event.start_time).toLocaleTimeString()} - {new Date(event.end_time).toLocaleTimeString()}<br />
                  {/* Display image if available */}
                  {orgProfile && orgProfile.profile_image && (
                    <img
                      src={`${BACKEND_URL}${orgProfile.profile_image}`}
                      alt={event.org_name}
                      width="100"
                      style={{ marginTop: '5px' }}
                    />
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MarkerClusterGroup>

      {/* Show user location marker if location is available */}
      {userLocation && (
        <Marker position={[userLocation.latitude, userLocation.longitude]} icon={userIcon}>
          <Popup
            autoClose={false}
            closeOnClick={false}
          >
            You are here
          </Popup>
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
