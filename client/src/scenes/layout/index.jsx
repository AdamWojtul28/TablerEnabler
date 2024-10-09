import React, { useState} from 'react'
import { Box, useMediaQuery } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from "components/Navbar";

const Layout = () => {
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