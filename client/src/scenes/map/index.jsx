import './Map.css';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import { Icon, divIcon, point } from "leaflet";
import MarkerClusterGroup from 'react-leaflet-cluster';


export default function App() {
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

// ***************** Max's  code below *****************************
// import React from 'react'

// const Map = () => {
//   return (
//     <div>
//       <div style={{fontWeight: 'bold', fontSize: '32px'}}>Map page goes here</div>
//       <br></br><br></br><br></br><br></br>
//       <div>Ready for development my MOKOKOS</div><br></br>

//       <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
//         <li>Done: Need to disable top nav bar for smaller screens and vice versa bottom nav bar for bigger screens</li>
//         <li>Menu item icon from top nav bar is clickable now</li>
//         <li>Sidebar is created and functional with ListItems leading to their corresponding url thru substring parsing</li>
//         <li style={{ marginLeft: '20px' }}>User info section at the bottom of Sidebar is NOT clickable as of now</li>
//         <li>TopNavbar and Sidebar are visible only on 600px+ screen width</li>
//         <li>BottomNavbar is visible only on 600px- screen width</li>
//         <li>Add 6 different loading page options (NEED HELP CHOOSING BETWEEN THEM - I can modify them based on ur inputs! )</li>
//       </ul>

//       <br></br>
//       <br></br>

//       <img src="https://i.redd.it/jzugmg96wyg81.gif" alt="Mokoko GIF" />

//     </div>
//   )
// }

// export default Map