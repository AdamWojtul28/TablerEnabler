import React, { useState } from 'react';
import { Box, useMediaQuery } from '@mui/material';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from "components/Navbar";
import BottomNavbar from "components/BottomNavbar";
import Sidebar from 'components/Sidebar';

const Layout = () => {
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  // Add this line to determine if navigation should be hidden
  const hideNavigation = ['/', '/loadingScreen'].includes(location.pathname);

  return (
    <Box display={isNonMobile ? "flex" : "block"} width="100%" height="100%">
      {!hideNavigation && (
        <Sidebar
          isNonMobile={isNonMobile}
          drawerWidth={isNonMobile ? "250px" : "40%"}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
      )}
      <Box flexGrow={1}>
        {!hideNavigation && (
          <Navbar 
            isNonMobile={isNonMobile}
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
          />
        )}
        <Outlet /> {/* This will render the child routes */}
        {!hideNavigation && (
          <BottomNavbar 
            isNonMobile={isNonMobile}
          />
        )}
      </Box>
    </Box>
  );
};

export default Layout;


// import React, { useState} from 'react'
// import { Box, useMediaQuery } from '@mui/material';
// import { Outlet } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import Navbar from "components/Navbar";
// import BottomNavbar from "components/BottomNavbar";
// import Sidebar from 'components/Sidebar';

// const Layout = () => {
//   const isNonMobile = useMediaQuery("(min-width: 600px)");
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   return (
//     <Box display={ isNonMobile ? "flex" : "block" } width="100%" height="100%">
//       <Sidebar
//         isNonMobile={ isNonMobile }
//         drawerWidth= {isNonMobile ? "250px" : "40%"}
//         isSidebarOpen={ isSidebarOpen }
//         setIsSidebarOpen={ setIsSidebarOpen }
//       />
//       <Box>
//           <Navbar 
//             isNonMobile={ isNonMobile }
//             isSidebarOpen={ isSidebarOpen }
//             setIsSidebarOpen={ setIsSidebarOpen }
//           />
//           <BottomNavbar 
//             isNonMobile={ isNonMobile }
//           />
//           <Outlet />  {/*child component of the Layour element for every page; like Map Route for example aka landing page*/}
//       </Box>
//     </Box>
//   )
// }

// export default Layout