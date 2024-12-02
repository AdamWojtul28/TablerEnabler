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
} from "@mui/icons-material";
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import { useLocation, useNavigate } from "react-router-dom";
import FlexBetween from "components/FlexBetween";
import profileImage from "../assets/gator_profile_image.png"; 
import loginImage from "../assets/user_default.png"; 

const navItems = {
  admin: [
    { text: "Home", icon: <HomeOutlined />, path: "/system-admin-home" },
    { text: "Map", icon: <HomeOutlined />, path: "/map" },
    { text: "Calendar List", icon: <CalendarMonthOutlined />, path: "/calendarlist" },
    { text: "Search", icon: <SearchOutlined />, path: "/search" },
  ],
  student: [
    { text: "Map", icon: <HomeOutlined />, path: "/map" },
    { text: "Calendar List", icon: <CalendarMonthOutlined />, path: "/calendarlist" },
    { text: "Search", icon: <SearchOutlined />, path: "/search" },
    { text: "Favorites", icon: <FavoriteBorderOutlined />, path: "/favorites" },
  ],
  officer: [
    { text: "Map", icon: <HomeOutlined />, path: "/map" },
    { text: "Calendar List", icon: <CalendarMonthOutlined />, path: "/calendarlist" },
    { text: "Search", icon: <SearchOutlined />, path: "/search" },
    { text: "Favorites", icon: <FavoriteBorderOutlined />, path: "/favorites" },
    { text: "My Organizations", icon: <MilitaryTechIcon />, path: "/myorgs" },
  ],
};

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
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    setActive(pathname.substring(1));
  }, [pathname]);

  // Sync login status with local storage changes
  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Handle profile click based on login status
  const handleProfileClick = () => {
    if (isLoggedIn) {
      navigate("/congrats"); // Redirect to the "SignedIn" page if logged in
    } else {
      navigate("/login"); // Redirect to login if not logged in
    }
  };

  // Get the role of the user from localStorage
  const role = localStorage.getItem("role") || "student"; // Default to "student" if role is not found

  // Get the navItems based on user role
  const roleNavItems = navItems[role];

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
              {roleNavItems.map(({ text, icon, path }) => {
                const lcText = text.toLowerCase();

                return (
                  <ListItem key={text} disablePadding>
                    <ListItemButton
                      onClick={() => {
                        navigate(path);
                        setActive(lcText);
                      }}
                      sx={{
                        backgroundColor:
                          active === lcText ? theme.palette.secondary[300] : "transparent",
                        color: active === lcText ? theme.palette.primary[600] : theme.palette.secondary[100],
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          ml: "2rem",
                          color: active === lcText ? theme.palette.primary[600] : theme.palette.secondary[200],
                        }}
                      >
                        {icon}
                      </ListItemIcon>
                      <ListItemText primary={text} />
                      {active === lcText && <ChevronRightOutlined sx={{ ml: "auto" }} />}
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Box>

          <Box position="absolute" bottom="2rem" width="100%">
            <Divider sx={{ width: "100%", backgroundColor: theme.palette.secondary[300] }} />
            <FlexBetween textTransform="none" gap="1rem" m="1.5rem 2rem 0 3rem" onClick={handleProfileClick}>
              <Box
                component="img"
                alt={isLoggedIn ? "profile" : "login"}
                src={isLoggedIn ? profileImage : loginImage}
                height="40px"
                width="40px"
                borderRadius="50%"
                sx={{ objectFit: "cover" }}
              />
              <SettingsOutlined
                onClick={() => {
                  if (isLoggedIn && localStorage.getItem("role") === "officer") {
                    navigate("/settingsPage");
                  } else {
                    alert("Settings are only available for logged-in officers.");
                  }
                }}
                sx={{
                  color: theme.palette.secondary[300],
                  fontSize: "25px",
                  cursor: "pointer",
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