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
  const [error, setError] = useState(null);
  const defaultLocation = [29.64929896217566, -82.34410532210882]; // Default location to centure tower/turlington


  // const campusBounds = [
  //   [29.627133117112223, -82.3726255534409],
  //   [29.65207112438173, -82.37241437639003],
  //   [29.652187508431723, -82.33946962691431],
  //   [29.641246819512386, -82.33953658778722],
  // ];

  
  // constant markers
  const markers = [
    {
    geocode: [29.648996, -82.343920],
    popUp: "This is table 1"
    },

    {
      geocode: [29.648694813957594, -82.34553381746278],
      popUp: "This is table 2"
      }
    ,

    {
      geocode: [29.65031186514168, -82.34272315054949],
      popUp: "This is table 3"
      }
  ];


    // Create floating icons for the cluster when the user is outside the campus
    const floatingIcons = [
      { geocode: [29.638, -82.350], popUp: "Floating icon 1" },
      { geocode: [29.640, -82.348], popUp: "Floating icon 2" },
      { geocode: [29.644, -82.342], popUp: "Floating icon 3" },
    ];


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



  return (
    <MapContainer 
      center={defaultLocation} 
      zoom={17}
      minZoom={2.5}  // Minimum zoom level to prevent excessive zooming out
      maxZoom={18} // Maximum zoom level to restrict excessive zooming in
      maxBounds={bounds} // Restrict panning beyond the world map
      maxBoundsViscosity={1.0} // Makes sure the map sticks to bounds
      > 
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    
    />
    <MarkerClusterGroup 
      chunkedLoading
      iconCreateFunction={createClusterCustomIcon}
    >
      
    {markers.map(marker => (
      <Marker position={marker.geocode} icon={customIcon}>
        <Popup>{marker.popUp}</Popup>
      </Marker>
    ))

    }
    </MarkerClusterGroup>

     {/* Show user location marker if location is available */}
     {userLocation && (
        <Marker position={[userLocation.latitude, userLocation.longitude]} icon={userIcon}>
          <Popup>You are here</Popup>
        </Marker>
      )}
      <SetMapCenter userLocation={userLocation} />

    </MapContainer>
  );
}

