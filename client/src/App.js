import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { useMemo } from "react";
import { useSelector } from "react-redux";  // solves the state transfer problem by storing all of the states in a single place called a store
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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

function App() {
  const mode = useSelector((state) => state.global.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]) //createTheme -> pass what materialUI needs


  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}> {/*materialUI setup*/}
          <CssBaseline /> {/*css reset*/}
          <Routes>
            <Route element={<Layout />}>  {/*Any Route withing this component will have Layout component as a parent for example we will have bottom navbar on every page*/}
              <Route path="/" element={<Navigate to="/loadingScreen" replace />} /> {/*if we sign in successfully we will be redirected to main(map view) page*/}
              <Route path="/loadingScreen" element={<LoadingScreen />} />
              <Route path="/map" element={<Map />} />
              <Route path="/calendarlist" element={<CalendarList />} />
              <Route path="/search" element={<Search />} />
              <Route path="/favorites" element={<Favorites />} />



              {/*LOADING SCRENS' SAMPLES NEED HELP WITH CHOOSING ONE */}
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
