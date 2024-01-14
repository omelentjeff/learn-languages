// App.jsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Home from "./components/Home";
import TeacherDashboard from "./components/TeacherDashboard";
import EditLanguage from "./components/EditLanguage"; //

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import CategorySelector from "./components/CategorySelector";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
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
            path="/play/:languageName"
            element={<CategorySelector language />}
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
