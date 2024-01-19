import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Home from "./components/Home";
import ExcercisePage from "./components/ExcercisePage";
import TeacherDashboard from "./components/TeacherDashboard";
import EditLanguage from "./components/EditLanguage";
import RoleProtection from "./components/RoleProtection";
import Unauthorized from "./components/Unauthorized";
import NotFound from "./components/NotFound";
import Layout from "./components/Layout";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import CategorySelector from "./components/CategorySelector";
import RedirectIfAuthenticated from "./components/RedirectIfAuthenticated";

import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import IconButton from "@mui/material/IconButton";

// TODO: AUTH, PROTECTED ROUTES, LOGOUT, PICK WHICH LANGUAGE TO PLAY, MOBILE FRIENDLY, BETTER UI

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [modeText, setModeText] = useState("dark");

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    setModeText(darkMode ? "dark" : "light");
  };

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
    },
  });

  const TeacherDashboardProtected = RoleProtection(TeacherDashboard, [
    "teacher",
  ]);
  const EditLanguageProtected = RoleProtection(EditLanguage, ["teacher"]);
  const HomePageProtected = RoleProtection(Home, ["student"]);
  const CategorySelectorProtected = RoleProtection(CategorySelector, [
    "student",
  ]);
  const ExercisePageProtected = RoleProtection(ExcercisePage, ["student"]);

  const SignInProtected = RedirectIfAuthenticated(SignIn);
  const SignUpProtected = RedirectIfAuthenticated(SignUp);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/signup" element={<SignUpProtected />} />
          <Route path="/" element={<SignInProtected />} />
          <Route
            path="/home"
            element={
              <Layout>
                <HomePageProtected />
              </Layout>
            }
          />
          <Route
            path="/teacher"
            element={
              <Layout>
                <TeacherDashboardProtected />
              </Layout>
            }
          />
          <Route
            path="/edit/:languageName"
            element={
              <Layout>
                <EditLanguageProtected language />
              </Layout>
            }
          />
          <Route
            path="/:languageName"
            element={
              <Layout>
                <CategorySelectorProtected language />
              </Layout>
            }
          />
          <Route
            path="/play/:language"
            element={
              <Layout>
                <ExercisePageProtected />
              </Layout>
            }
          />
          <Route
            path="/unauthorized"
            element={
              <Layout>
                <Unauthorized />
              </Layout>
            }
          />
          <Route path="*" element={<NotFound />} />{" "}
        </Routes>
      </Router>

      <Grid
        container
        alignItems="center"
        justifyContent="flex-end"
        style={{
          position: "fixed",
          bottom: 10,
          right: 10,
          maxWidth: "fit-content",
        }}
      >
        <Grid item>
          <Typography color={darkMode ? "textSecondary" : "textPrimary"}>
            {modeText === "dark" ? "Dark Mode" : "Light Mode"}
          </Typography>
        </Grid>
        <Grid item>
          <IconButton sx={{ ml: 1 }} color="inherit" onClick={toggleDarkMode}>
            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

export default App;
