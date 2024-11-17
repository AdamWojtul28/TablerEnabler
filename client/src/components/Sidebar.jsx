import React, { useEffect, useState } from "react";
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
} from "@mui/material";
import {
  SettingsOutlined,
  ChevronLeft,
  ChevronRightOutlined,
  HomeOutlined,
  SearchOutlined,
  FavoriteBorderOutlined,
  CalendarMonthOutlined,
  EventAvailableOutlined
} from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import FlexBetween from "components/FlexBetween";
import profileImage from "../assets/gator_profile_image.png"; 
import loginImage from "../assets/user_default.png"; 


const navItems = [
  {
    text: "Map",
    icon: <HomeOutlined />,
  },
  {
    text: "Top Features",
    icon: null,
  },
  {
    text: "Calendar List",
    icon: <CalendarMonthOutlined />,
  },
  {
    text: "Search",
    icon: <SearchOutlined />,
  },
  {
    text: "Favorites",
    icon: <FavoriteBorderOutlined />,
  },
  {
    text: "Add Event",
    icon: <EventAvailableOutlined />,
  }
  
];

const user = JSON.parse(localStorage.getItem('user'));
const userName = user?.name;
const userStatus = user?.status;

const Sidebar = ({
  drawerWidth,
  isSidebarOpen,
  setIsSidebarOpen,
  isNonMobile,

}) => {
  const { pathname } = useLocation();
  const [active, setActive] = useState("");
  const navigate = useNavigate();
  const theme = useTheme();

  // State to track if user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    setActive(pathname.substring(1));
  }, [pathname]);

  // Sync login status with local storage changes
  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem('token'));
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Handle profile click based on login status
  const handleProfileClick = () => {
    if (isLoggedIn) {
      navigate('/congrats'); // Redirect to the "SignedIn" page if logged in
    } else {
      navigate('/login'); // Redirect to login if not logged in
    }
  };

  return (
    <Box component="nav" display={isNonMobile ? "flex" : "none"}>
      {isSidebarOpen && (
        <Drawer
          open={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          variant="persistent"
          anchor="left"
          sx={{
            width: drawerWidth,
            "& .MuiDrawer-paper": {
              color: theme.palette.secondary[200],
              backgroundColor: theme.palette.background.alt,
              boxSizing: "border-box",
              borderWidth: isNonMobile ? 0 : "2px",
              width: drawerWidth,
            },
          }}
        >
          <Box width="100%">
            <Box m="1.5rem 2rem 2rem 3rem">
              <FlexBetween color={theme.palette.secondary.main}>
                <Box display="flex" alignItems="center" gap="0.5rem">
                  <Typography variant="h4" fontWeight="bold">
                    TablerEnabler
                  </Typography>
                </Box>
                {!isNonMobile && (
                  <IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                    <ChevronLeft />
                  </IconButton>
                )}
              </FlexBetween>
            </Box>
            <List>
  {navItems.map(({ text, icon }) => {
    // Check for conditional display of "Add Event"
    if (text === "Add Event" && (!isLoggedIn || localStorage.getItem('role') !== 'organization')) {
      return null; // Do not render "Add Event" if not logged in or not an organization
    }

    if (!icon) {
      return (
        <Typography
          key={text}
          sx={{
            m: "2.25rem 0 1rem 3rem",
            color: theme.palette.mode === "dark"
              ? theme.palette.common.white
              : theme.palette.common.black,
            display: "flex",
            alignItems: "center",
          }}
        >
          {text}
        </Typography>
      );
    }

    const lcText = text.toLowerCase();

    return (
      <ListItem key={text} disablePadding>
        <ListItemButton
          onClick={() => {
            if (lcText === 'add event') {
              // Navigate to Add Event if logged in and role is organization
              if (isLoggedIn && localStorage.getItem('role') === 'organization') {
                navigate('/addEvent');
              } else {
                navigate('/login'); // Redirect to login otherwise
              }
            } else if (lcText === 'calendar list') {
              navigate('/calendarlist');
            } else {
              navigate(`/${lcText}`);
            }
            setActive(lcText);
          }}
          sx={{
            backgroundColor:
              active === lcText
                ? theme.palette.secondary[300]
                : "transparent",
            color:
              active === lcText
                ? theme.palette.primary[600]
                : theme.palette.secondary[100],
          }}
        >
          <ListItemIcon
            sx={{
              ml: "2rem",
              color:
                active === lcText
                  ? theme.palette.primary[600]
                  : theme.palette.secondary[200],
            }}
          >
            {icon}
          </ListItemIcon>
          <ListItemText primary={text} />
          {active === lcText && (
            <ChevronRightOutlined sx={{ ml: "auto" }} />
          )}
        </ListItemButton>
      </ListItem>
    );
  })}
</List>
          </Box>



          <Box position="absolute" bottom="2rem">
            <Divider />
            <FlexBetween
              textTransform="none"
              gap="1rem"
              m="1.5rem 2rem 0 3rem"
              // onClick={handleProfileClick}
            >
              <Box
                component="img"
                alt={isLoggedIn ? "profile" : "login"}
                src={isLoggedIn ? profileImage : loginImage}
                height="40px"
                width="40px"
                borderRadius="50%"
                sx={{ objectFit: "cover" }}
              />
              <Box textAlign="left">
                <Typography
                  fontWeight="bold"
                  fontSize="0.9rem"
                  sx={{ color: theme.palette.secondary[100] }}
                >
                  {isLoggedIn ? userName : "Login"}
                </Typography>
                <Typography
                  fontSize="0.8rem"
                  sx={{ color: theme.palette.secondary[200] }}
                >
                  {isLoggedIn ? userStatus : "" }
                </Typography>
              </Box>
              <SettingsOutlined
                onClick={() => {
                  if (isLoggedIn && localStorage.getItem('role') === 'organization') {
                    navigate('/settingsPage');
                  } else {
                    alert("Settings are only available for logged-in organizations.");
                  }
                }}
                sx={{
                  color: theme.palette.secondary[300],
                  fontSize: "25px",
                  cursor: "pointer"
                }}
              />
            </FlexBetween>
          </Box>
        </Drawer>
      )}
    </Box>
  );
};

export default Sidebar;