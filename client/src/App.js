import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { useMemo } from "react";
import { useSelector } from "react-redux";  // solves the state transfer problem by storing all of the states in a single place called a store
import { BrowserRouter, Routes } from "react-router-dom";
import { themeSettings } from "theme";

function App() {
  const mode = useSelector((state) => state.global.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode])


  return (
    <div className="app">
      <h1>Ready for development my MOKOKOS</h1>
      <p>materialUI with custom light/dark mode switch is set up, I will work on color palette under theme.js in client/src in a bit</p>
      <img src="https://i.redd.it/jzugmg96wyg81.gif" alt="Funny GIF" />
      <BrowserRouter>
        <ThemeProvider theme={theme}> {/*materialUI setup*/}
          <CssBaseline />
          <Routes>
            
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
