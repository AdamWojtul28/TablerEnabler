import './Map.css';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import { Icon, divIcon, point } from "leaflet";
import MarkerClusterGroup from 'react-leaflet-cluster';


export default function Map() {
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

// create custom icon
const customIcon = new Icon({
  iconUrl: "/icons/side-table.png",
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



  return (
    <MapContainer center={[29.64929896217566, -82.34410532210882]} zoom={21}> 
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
    </MapContainer>
  );
}