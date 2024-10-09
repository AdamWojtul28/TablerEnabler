import React, { useState} from 'react'
import { Box, useMediaQuery } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from "components/Navbar";
import Bottombar from "components/Bottombar";

const Layout = () => {
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  
  return (
    <Box width="100%" height="100%">
        <Box>
            <Navbar />
            <Outlet />  {/*child component of the Layour element for every page; like Map Route for example aka landing page*/}
        </Box>
    </Box>
  )
}

export default Layout