import React, { useState } from 'react';
import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import { useNavigate } from 'react-router-dom';

const BottomNavbar = ({ isNonMobile }) => {
  const [value, setValue] = useState(0);
  const navigate = useNavigate();
  
  // Get the role from localStorage (or from context/state)
  const role = localStorage.getItem('role'); // Assuming 'role' is stored in localStorage

  // Conditional icons based on user role (admin or student)
  const adminIcons = [
    { label: 'Home', icon: <HomeIcon />, path: '/system-admin-home' },
    { label: 'Map', icon: <MapOutlinedIcon />, path: '/live-map' },
    { label: 'Calendar', icon: <CalendarMonthIcon />, path: '/calendarlist' },
    { label: 'Search', icon: <SearchIcon />, path: '/search' },
  ];

  const studentIcons = [
    { label: 'Map', icon: <MapOutlinedIcon />, path: '/live-map' },
    { label: 'Calendar', icon: <CalendarMonthIcon />, path: '/calendarlist' },
    { label: 'Search', icon: <SearchIcon />, path: '/search' },
    { label: 'Favorites', icon: <FavoriteBorderIcon />, path: '/favorites' },
  ];

  const officerIcons = [
    { label: 'Map', icon: <MapOutlinedIcon />, path: '/live-map' },
    { label: 'Calendar', icon: <CalendarMonthIcon />, path: '/calendarlist' },
    { label: 'Search', icon: <SearchIcon />, path: '/search' },
    { label: 'Favorites', icon: <FavoriteBorderIcon />, path: '/favorites' },
    { label: "My orgs", icon: <MilitaryTechIcon />, path: "/myorgs" }
  ];

  // Select the icons to display based on role
  let iconsToDisplay;
  if(role === 'admin'){
    iconsToDisplay = adminIcons;
  }
  else if(role === 'student'){
    iconsToDisplay = studentIcons;
  }
  else{
    iconsToDisplay = officerIcons;
  }

  return (
    <BottomNavigation
      sx={{
        width: '100%',
        position: 'fixed',
        bottom: 0,
        display: isNonMobile ? "none" : "flex",
      }}
      value={value}
      onChange={(event, newValue) => {
        setValue(newValue);
      }}
    >
      {iconsToDisplay.map((iconData, index) => (
        <BottomNavigationAction
          key={index}
          label={iconData.label}
          icon={iconData.icon}
          onClick={() => {
            navigate(iconData.path);
          }}
        />
      ))}
    </BottomNavigation>
  );
};

export default BottomNavbar;
