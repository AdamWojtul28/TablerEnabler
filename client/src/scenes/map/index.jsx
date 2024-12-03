// Map.js
import './Map.css';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Icon, divIcon, point } from "leaflet";
import MarkerClusterGroup from 'react-leaflet-cluster'; // Ensure correct import
import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';


// Define the backend URL
const BACKEND_URL = 'http://localhost:5001'; // Update if necessary

// Custom component to handle map centering
function SetMapCenter({ locationToCenter }) {
  const map = useMap();

  // If locationToCenter is available, update the center of the map
  useEffect(() => {
    if (locationToCenter) {
      map.setView(locationToCenter, 17);
    }
  }, [locationToCenter, map]);

  return null;
}

export default function Map() {
  const location = useLocation();
  const [userLocation, setUserLocation] = useState(null);
  const [events, setEvents] = useState([]);  // Store live events
  const [orgProfiles, setOrgProfiles] = useState({}); // Store organization profiles
  const [error, setError] = useState(null);
  const [noEventsMessage, setNoEventsMessage] = useState(''); // Message if no events
  const [defaultLocation, setDefaultLocation] = useState([29.64929896217566, -82.34410532210882]); // Message if no events
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [locationToCenter, setLocationToCenter] = useState(null); // Location to center the map around
  const [relevantEventId, setRelevantEventId] = useState(null);


  // Create custom icons

  const customIcon = new Icon({
    iconUrl: "/icons/side-table.png",
    iconSize: [35, 35],
  });

  const pinIcon = new Icon({
    iconUrl: "/icons/pin.png",
    iconSize: [45, 45],
  });

  const userIcon = new Icon({
    iconUrl: "/icons/user.png",
    iconSize: [35, 35],
  });

  const createClusterCustomIcon = (cluster) => new divIcon({
    html: `<span class="cluster-icon">${cluster.getChildCount()}</span>`,
    iconSize: point(40, 40, true),
  });

  const markersRef = useRef({});
  const popupOpenedRef = useRef({});
  const clusterGroupRef = useRef();

  useEffect(() => {
    // Parse query parameters from the URL
    const params = new URLSearchParams(location.search);
  
    const extractedStartTime = params.get('startTime');
    const extractedEndTime = params.get('endTime');
  
    if (extractedStartTime && extractedEndTime) {
      setStartTime(extractedStartTime);
      setEndTime(extractedEndTime);
    } else {
      console.error("Missing startTime or endTime in URL parameters.");
      setNoEventsMessage("Please provide valid start and end times in the URL.");
    }
  }, [location.search]);
  
  useEffect(() => {
    // Fetch live events only when startTime and endTime are both set
    if (startTime && endTime) {
      const fetchLiveEvents = async () => {
        try {
          console.log(`Fetching events for startTime: ${startTime}, endTime: ${endTime}`);
          const response = await fetch(
            `${BACKEND_URL}/general/tabling-reservations-specific?start_time=${encodeURIComponent(
              startTime
            )}&end_time=${encodeURIComponent(endTime)}`
          );
  
          const data = await response.json();
          console.log("Fetched live events:", data);
  
          if (data.length > 0) {
            setEvents(data);
            setNoEventsMessage(''); // Clear previous message
          } else {
            setEvents([]); // Ensure no stale data
            setNoEventsMessage('No events during this time period found.');
          }
        } catch (err) {
          console.error("Error fetching events:", err);
          setError('Failed to fetch events.');
        }
      };
  
      fetchLiveEvents();
    }
  }, [startTime, endTime]);
  
  useEffect(() => {
    // Fetch organization profiles only when events are available
    const fetchOrganizationProfiles = async () => {
      try {
        const orgNamesSet = new Set(events.map(event => event.org_name));
        const orgNamesArray = Array.from(orgNamesSet);
  
        if (orgNamesArray.length > 0) {
          const response = await fetch(
            `${BACKEND_URL}/general/organization-profiles?orgNames=${encodeURIComponent(
              JSON.stringify(orgNamesArray)
            )}`
          );
          const data = await response.json();
  
          console.log("Fetched organization profiles:", data);
  
          if (response.ok) {
            const orgProfileMap = {};
            data.forEach(org => {
              orgProfileMap[org.name] = org;
            });
            setOrgProfiles(orgProfileMap);
          } else {
            console.error(data.error || 'Failed to fetch organization profiles');
          }
        }
      } catch (err) {
        console.error('Failed to fetch organization profiles', err);
      }
    };
  
    if (events.length > 0) {
      fetchOrganizationProfiles();
    }
  }, [events]);

  useEffect(() => {
    // Center the map around the event that matches the URL parameters
    if (startTime && endTime && events.length > 0) {
      const matchedEvent = events.find(event => {
        return (
          event.start_time === startTime &&
          event.end_time === endTime &&
          event.org_name === new URLSearchParams(location.search).get('name') &&
          event.location === new URLSearchParams(location.search).get('location') &&
          event.description === new URLSearchParams(location.search).get('description')
        );
      });

      if (matchedEvent) {
        const [lat, lng] = matchedEvent.location.split(',').map(Number);
        if (!isNaN(lat) && !isNaN(lng)) {
          setLocationToCenter([lat, lng]);
          setRelevantEventId(matchedEvent._id);
        }
      }
    }
  }, [startTime, endTime, events, location.search]);
  
  useEffect(() => {
    // Open all popups by default after events are loaded
    events.forEach(event => {
      const marker = markersRef.current[event._id];
      if (marker) {
        console.log(`Opening popup for event ${event._id}`);
        marker.openPopup();
        popupOpenedRef.current[event._id] = true; // Mark as opened
      }
    });
  }, [events]);  // Triggered when events are loaded
  

  // Handler to open a popup
  const handleOpenPopup = (id) => {
    const marker = markersRef.current[id];
    if (marker) {
      marker.openPopup();
      popupOpenedRef.current[id] = true; // Mark as opened
    }
  };

  // Center the map and open the popup for the relevant event
  useEffect(() => {
    if (events.length > 0 && locationToCenter) {
      const matchedEvent = events.find(event => {
        const [lat, lng] = event.location.split(',').map(Number);
        return lat === locationToCenter[0] && lng === locationToCenter[1];
      });

      if (matchedEvent) {
        // Ensure marker is rendered before opening popup
        const marker = markersRef.current[matchedEvent._id];
        if (marker && !popupOpenedRef.current[matchedEvent._id]) {
          setTimeout(() => {
            marker.openPopup(); // Open popup only for this event
            popupOpenedRef.current[matchedEvent._id] = true;
          }, 1000); // Adjust delay if needed
        }
      }
    }
  }, [events, locationToCenter]); // Depend on events and locationToCenter to trigger

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

  const handleMapZoomEnd = () => {
    events.forEach(event => {
      const marker = markersRef.current[event._id];
      if (marker) {
        // Check if marker is within bounds
        if (marker.getBounds().contains(marker.getLatLng())) {
          // Open the popup if it isn't already opened
          if (!popupOpenedRef.current[event._id]) {
            marker.openPopup();
            popupOpenedRef.current[event._id] = true;
          }
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
                  if (locationToCenter) {
                    // Check if this event is the one to center and open popup
                    if (event.location === locationToCenter.join(',')) {
                      const marker = markersRef.current[event._id];
                      if (marker && !popupOpenedRef.current[event._id]) {
                        marker.openPopup();
                        popupOpenedRef.current[event._id] = true;
                      }
                    }
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

      <SetMapCenter locationToCenter={locationToCenter} />

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