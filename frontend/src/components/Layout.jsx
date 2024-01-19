/**
 * @fileoverview This file defines the Layout component, a React component used
 * for providing a consistent layout across different pages of a language learning
 * application. It includes an AppBar for navigation and handles the user's role-based
 * display and logout functionality.
 */
import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import { Link } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import HomeIcon from "@mui/icons-material/Home";
import Hidden from "@mui/material/Hidden";
import { useNavigate } from "react-router-dom";
import axios from "axios";

/**
 * Custom styled AppBar component using Material-UI's AppBar.
 *
 * This styled component enhances the MuiAppBar with additional styling to control its width, margin, and transitions
 * based on the 'open' state, which is typically linked to the state of a side drawer or menu in the layout.
 *
 * @param {Object} theme - The theme object provided by Material-UI's ThemeProvider.
 * @param {boolean} open - A boolean value indicating whether the associated drawer is open.
 * @returns {ReactElement} A styled AppBar component with custom transitions and width adjustments.
 */
const drawerWidth = 240;
const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1, // Ensures AppBar is above the drawer
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth, // Adjust marginLeft when drawer is open
    width: `calc(100% - ${drawerWidth}px)`, // Adjust width when drawer is open
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

/**
 * Layout component that provides a consistent AppBar and layout for pages.
 * It fetches and displays the user's role and provides logout functionality.
 *
 * @param {Object} props - Props for Layout component.
 * @param {ReactNode} props.children - Children components to render inside the layout.
 * @returns {ReactElement} The layout wrapper for the application's pages.
 */
export default function Layout({ children }) {
  /**
   * React Router hook for navigation.
   *
   * @type {Function}
   */
  const navigate = useNavigate();

  /**
   * State to store the user's role, initially set to null.
   *
   * @type {string|null}
   */
  const [userRole, setUserRole] = useState(null);

  /**
   * Fetches the user's role on component mount and handles redirection on unauthorized access.
   */
  useEffect(() => {
    const fetchRole = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/users/role`,
          { withCredentials: true }
        );
        setUserRole(response.data.role);
      } catch (error) {
        console.error("Error or unauthorized", error);
        navigate("/");
      }
    };

    fetchRole();
  }, [navigate]);

  /**
   * Handles the logout process and navigates to the home page on success.
   */
  const handleLogout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/logout`,
        {},
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Error logging out:", error);
    }

    navigate("/");
  };

  // User checking and conditional variables according to role
  const isTeacher = userRole === "teacher";
  const title = isTeacher ? "Teacher Dashboard" : "Learn Languages!";
  const homeLink = isTeacher ? "/teacher" : "/home";

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="absolute">
        <Toolbar
          sx={{
            pr: "24px",
          }}
        >
          {" "}
          <Link to={homeLink}>
            <IconButton color="white">
              <Hidden smDown></Hidden>
              <Badge color="secondary">
                <HomeIcon />
              </Badge>
            </IconButton>
          </Link>
          <Typography
            component="h1"
            variant="h5"
            color="inherit"
            noWrap
            sx={{ flexGrow: 1, textAlign: "center" }}
          >
            {title}
          </Typography>
          <IconButton color="white" onClick={handleLogout}>
            <Hidden smDown>
              <Typography
                variant="body1"
                color="inherit"
                sx={{
                  marginRight: 1,
                  color: "white",
                }}
              >
                Log Out
              </Typography>
            </Hidden>
            <Badge color="secondary">
              <LogoutIcon />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box
        component="main"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? theme.palette.grey[100]
              : theme.palette.grey[900],
          flexGrow: 1,
          height: "100vh",
          overflow: "auto",
        }}
      >
        <Toolbar />
        {/* Content */}
        {children}
      </Box>
    </Box>
  );
}
