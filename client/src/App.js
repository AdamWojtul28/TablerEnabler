import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { useMemo, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { themeSettings } from "theme";
import Layout from "scenes/layout";
import Map from "scenes/map";
import CalendarList from "scenes/calendarList";
import Favorites from "scenes/favorites";
import Search from "scenes/search";
import LoadingScreen from "scenes/loadingScreen";
import LoadingScreen1 from "scenes/loadingScreen1";
import LoadingScreen2 from "scenes/loadingScreen2";
import LoadingScreen3 from "scenes/loadingScreen3";
import LoadingScreen4 from "scenes/loadingScreen4";
import LoadingScreen5 from "scenes/loadingScreen5";
import Login from "scenes/login";
import Register from "scenes/register";
import AddEvent from "scenes/addEvent";
import Congrats from "scenes/SignedIn";
import Navbar from "components/Navbar";

function App() {
  const mode = useSelector((state) => state.global.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  // State to check if the user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  // Check localStorage for token on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token); // Update login status based on token presence
  }, []);

  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />

          {/* Navbar with login state passed as props */}
          <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />

          <Routes>
            <Route element={<Layout />}>

              {/* Redirect to map if logged in, otherwise go to loading screen */}
              <Route path="/" element={<Navigate to={isLoggedIn ? "/map" : "/loadingScreen"} replace />} />
              
              {/* Public loading screen route */}
              <Route path="/loadingScreen" element={<LoadingScreen />} />
              
              {/* Conditional routes based on login status */}
              <Route path="/map" element={isLoggedIn ? <Map /> : <Navigate to="/login" replace />} />
              <Route path="/calendarlist" element={isLoggedIn ? <CalendarList /> : <Navigate to="/login" replace />} />
              <Route path="/search" element={isLoggedIn ? <Search /> : <Navigate to="/login" replace />} />
              <Route path="/favorites" element={isLoggedIn ? <Favorites /> : <Navigate to="/login" replace />} />
              <Route path="/addEvent" element={isLoggedIn ? <AddEvent /> : <Navigate to="/login" replace />} />
              <Route path="/congrats" element={isLoggedIn ? <Congrats /> : <Navigate to="/login" replace />} />

              {/* Public routes with conditional redirect for logged-in users */}
              <Route path="/login" element={isLoggedIn ? <Navigate to="/map" replace /> : <Login onLogin={() => setIsLoggedIn(true)} />} />
              <Route path="/register" element={isLoggedIn ? <Navigate to="/map" replace /> : <Register />} />

              {/* Loading screens */}
              <Route path="/loadingScreen1" element={<LoadingScreen1 />} />
              <Route path="/loadingScreen2" element={<LoadingScreen2 />} />
              <Route path="/loadingScreen3" element={<LoadingScreen3 />} />
              <Route path="/loadingScreen4" element={<LoadingScreen4 />} />
              <Route path="/loadingScreen5" element={<LoadingScreen5 />} />
            </Route>
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
