import React, { useState } from 'react'
import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useTheme } from '@emotion/react';
import FlexBetween from 'components/FlexBetween';
import { useLocation, useNavigate } from 'react-router-dom';
import calendar from "scenes/calendarList"

const BottomNavbar = () => {
    const [value, setValue] = useState(0);
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const theme = useTheme();
  return (
    <BottomNavigation 
        sx={{width: '100%', position: 'fixed', bottom: 0}}
        value={value}
        onChange={(event, newValue) => {
            setValue(newValue)
            }}
        // showLabels   // show labels under icons at all times
    >
        <BottomNavigationAction label='Map' icon={ <MapOutlinedIcon />} 
            onClick={() => {
                navigate('/map');
            }}
            
        />
        <BottomNavigationAction label='Calendar' icon={ <CalendarMonthIcon />}
            onClick={() => {
                navigate('/calendar');
            }}
        />
        <BottomNavigationAction label='Search' icon={ <SearchIcon />}
            onClick={() => {
                navigate('/search');
            }}
        />
        <BottomNavigationAction label='Favorites' icon={ <FavoriteBorderIcon />}
            onClick={() => {
                navigate('/favorites');
            }}
        />
    </BottomNavigation>
    
  )
}

export default BottomNavbar
