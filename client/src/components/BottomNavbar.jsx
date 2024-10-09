import React, { useState } from 'react'
import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

const BottomNavbar = () => {
    const [value, setValue] = useState(0)
  return (
    <BottomNavigation 
        sx={{width: '100%', position: 'absolute', bottom: 0}}
        value={value}
        onChange={(event, newValue) => {
            setValue(newValue)
            }}
        // showLabels   // show labels under icons at all times
    >
        <BottomNavigationAction label='Map' icon={ <MapOutlinedIcon />} />
        <BottomNavigationAction label='Calendar' icon={ <CalendarMonthIcon />} />
        <BottomNavigationAction label='Search' icon={ <SearchIcon />} />
        <BottomNavigationAction label='Favorites' icon={ <FavoriteBorderIcon />} />
    </BottomNavigation>
    
  )
}

export default BottomNavbar
