import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Home from "./components/Home";
import ExcercisePage from "./components/ExcercisePage";
import TeacherDashboard from "./components/TeacherDashboard";
import EditLanguage from "./components/EditLanguage"; //

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import CategorySelector from "./components/CategorySelector";

import Switch from "@mui/material/Switch";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

// TODO: AUTH, PROTECTED ROUTES, LOGOUT, PICK WHICH LANGUAGE TO PLAY, MOBILE FRIENDLY, BETTER UI

function App() {
  const [darkMode, setDarkMode] = useState(true);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/" element={<SignIn />} />
          <Route path="/home" element={<Home />} />
          <Route path="/teacher" element={<TeacherDashboard />} />
          <Route
            path="/edit/:languageName"
            element={<EditLanguage language />}
          />
          <Route
            path="/:languageName"
            element={<CategorySelector language />}
          />
          <Route path="/play/:language" element={<ExcercisePage />} />
        </Routes>
      </Router>

      <Grid
        component="label"
        container
        alignItems="center"
        justifyContent="flex-end"
        style={{ position: "fixed", bottom: 16, right: 16 }}
      >
        <Grid item>
          <Typography color={darkMode ? "textSecondary" : "textPrimary"}>
            Dark Mode
          </Typography>
        </Grid>
        <Grid item>
          <Switch
            checked={darkMode}
            onChange={toggleDarkMode}
            color="primary"
          />
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

export default App;
