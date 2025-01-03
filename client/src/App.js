import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { useMemo, useState, useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { themeSettings } from "theme";
import Layout from "scenes/layout";
import LiveMap from "scenes/live-map";
import Map from "scenes/map";
import CalendarList from "scenes/calendarList";
import Favorites from "scenes/favorites";
import Search from "scenes/search";
import OrganizationPage from "scenes/organizationPage";
import LoadingScreen from "scenes/loadingScreen";
import Login from "scenes/login";
import Register from "scenes/register";
import AddEvent from "scenes/addEvent";
import Congrats from "scenes/SignedIn";
import MyOrgsPage from "scenes/myOrgsPage";
import EditOrganizationPage from "scenes/myOrgsPage/EditOrganizationPage";
import Navbar from "components/Navbar";
import SystemAdminHome from "scenes/system-admin-home";


function App() {
  const mode = useSelector((state) => state.global.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  // State to check if the user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const role = localStorage.getItem("role"); // Save the role for future use

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token); // Update login status based on token presence
  }, []);

  // ProtectedRoute component with double-alert prevention
  const ProtectedRoute = ({
    isLoggedIn,
    role,
    requiredRole,
    children,
    redirectPath,
    alertMessage,
  }) => {
    const alertShownRef = useRef(false); // Use ref to prevent double alerts in strict mode

    useEffect(() => {
      if (!isLoggedIn || role !== requiredRole) {
        if (!alertShownRef.current) {
          alert(alertMessage); // Show the alert only once
          alertShownRef.current = true; // Mark as shown
        }
      }
    }, [isLoggedIn, role, requiredRole, alertMessage]);

    if (!isLoggedIn || role !== requiredRole) {
      return <Navigate to={redirectPath} replace />;
    }

    return children; // Render protected component if conditions are met
  };

  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />

          {/* Navbar with login state passed as props */}
          <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />

          <Routes>
            <Route element={<Layout />}>
              {/* Redirect to map by default */}
              <Route path="/" element={<Navigate to="/loadingscreen
              " replace />} />

              {/* Public routes accessible to everyone */}
              <Route path="/loadingScreen" element={<LoadingScreen />} />
              <Route path="/live-map" element={<LiveMap />} />
              <Route path="/map" element={<Map />} />
              <Route path="/calendarlist" element={<CalendarList />} />
              <Route path="/search" element={<Search />} />
              <Route
                path="/organization-profile"
                element={<OrganizationPage />}
              />
              <Route
                path="/edit-organization-profile"
                element={<EditOrganizationPage />}
              />
              <Route path="/congrats" element={<Congrats />} />

              {/* Conditional Routes */}
              <Route
                path="/favorites"
                element={isLoggedIn ? <Favorites /> : <Login />}
              />

              <Route
                path="/system-admin-home"
                element={
                  <ProtectedRoute
                    isLoggedIn={isLoggedIn}
                    role={role}
                    requiredRole="admin"
                    redirectPath="/live-map"
                    alertMessage="You do not have privileges to access this page."
                  >
                    <SystemAdminHome />
                  </ProtectedRoute>
                }
              />

              {/* Login and register routes */}
              <Route
                path="/login"
                element={
                  isLoggedIn ? (
                    <Navigate to="/live-map" replace />
                  ) : (
                    <Login onLogin={() => setIsLoggedIn(true)} />
                  )
                }
              />
              <Route
                path="/register"
                element={
                  isLoggedIn ? (
                    <Navigate to="/live-map" replace />
                  ) : (
                    <Register />
                  )
                }
              />

              {/* Restricted route: Only accessible when logged in */}
              <Route
                path="/addEvent"
                element={
                  isLoggedIn ? <AddEvent /> : <Navigate to="/login" replace />
                }
              />

              {/* Settings page */}
              <Route path="/myorgs" element={<MyOrgsPage />}></Route>
            </Route>
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
