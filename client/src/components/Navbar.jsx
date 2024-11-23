import React, { useState, useEffect } from 'react';
import { 
    LightModeOutlined,
    DarkModeOutlined,
    Menu as MenuIcon,
    Search,
    SettingsOutlined,
    LogoutOutlined
} from '@mui/icons-material';
import FlexBetween from 'components/FlexBetween';
import { useDispatch } from 'react-redux';
import { setMode } from 'state';
import profileImage from "../assets/gator_profile_image.png"; 
import { AppBar, Box, Button, IconButton, InputBase, Toolbar, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import loginImage from "../assets/user_default.png"; 


const Navbar = ({ 
    isNonMobile,
    isSidebarOpen,
    setIsSidebarOpen,
}) => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const navigate = useNavigate();

    // State to check if the user is logged in
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

    useEffect(() => {
        // Check for token presence immediately after mounting
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);

        // Listen for storage changes to update the login state in real-time
        const handleStorageChange = () => {
            setIsLoggedIn(!!localStorage.getItem('token'));
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    // Logout function
    const handleLogout = () => {
        localStorage.removeItem('token'); // Remove token from local storage
        setIsLoggedIn(false); // Immediately update state
        navigate('/login'); // Redirect to login page
        window.location.reload();
    };

    // Handle profile click based on login status
    const handleProfileClick = () => {
        if (isLoggedIn) {
            navigate('/congrats'); // Redirect to the "SignedIn" page if logged in
        } else {
            navigate('/login'); // Redirect to login if not logged in
        }
    };

    return (
        <AppBar
            sx={{
                position: "static",
                background: "none",
                boxShadow: "none",
                display: isNonMobile ? "flex" : "none",
            }}
        >
            <Toolbar sx={{ justifyContent: "space-between" }}>
                {/* LEFT SIDE: Menu icon + search bar */}
                <FlexBetween>
                    <IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                        <MenuIcon />
                    </IconButton>
                </FlexBetween>

                {/* RIGHT SIDE: Dark/light mode + settings + user profile */}
                <FlexBetween gap="1.5rem">
                    <IconButton onClick={() => dispatch(setMode())}>
                        {theme.palette.mode === "dark" ? (
                            <DarkModeOutlined sx={{ fontSize: "25px"}} />
                        ) : (
                            <LightModeOutlined sx={{ fontSize: "25px"}} />
                        )}
                    </IconButton>
                    
                    <IconButton>
                        <SettingsOutlined sx={{ fontSize: "25px" }} />
                    </IconButton>

                    {/* Profile Button */}
                    <Button
                        onClick={handleProfileClick}
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            textTransform: "none",
                            gap: "1rem",
                        }}
                    >
                        <Box
                            component="img"
                            alt="profile"
                            src={isLoggedIn ? profileImage : loginImage} // Conditionally render image
                            height="32px"
                            width="32px"
                            borderRadius="50%"
                            sx={{ objectFit: "cover" }}
                        />
                    </Button>

                    {/* Display Logout button if logged in */}
                    {isLoggedIn && (
                        <IconButton onClick={handleLogout}>
                            <LogoutOutlined sx={{ fontSize: "25px" }} />
                        </IconButton>
                    )}
                </FlexBetween>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;