import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

/**
 * React component for user login and authentication.
 *
 * This component provides a user interface for users to enter their
 * username and password to authenticate and access the application.
 *
 * @returns {React.Component} - Sign-in form component.
 */
function SignIn() {
  /**
   * State to control the visibility of the password input.
   *
   * @type {boolean}
   */
  const [showPassword, setShowPassword] = useState(false);

  /**
   * State to track loading state during form submission.
   *
   * @type {boolean}
   */
  const [loading, setLoading] = useState(false);

  /**
   * State to store form data, including username and password.
   *
   * @type {Object}
   * @property {string} username - The user's username.
   * @property {string} password - The user's password.
   */
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  /**
   * State to store error messages related to login.
   *
   * @type {string}
   */
  const [errorMessage, setErrorMessage] = useState("");

  /**
   * React Router hook for navigation.
   *
   * @type {Function}
   */
  const navigate = useNavigate();

  /**
   * Function to handle form submission and initiate user authentication.
   *
   * @param {Event} event - The form submission event.
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setLoading(true);

    const data = new FormData(event.currentTarget);

    if (data.get("username") && data.get("password")) {
      const user = {
        username: data.get("username"),
        password: data.get("password"),
      };

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/users/login`,
          user,
          { withCredentials: true }
        );

        if (response.status === 200) {
          const decodedToken = jwtDecode(response.data.token);
          const userRole = decodedToken.role;

          if (userRole === "teacher") {
            navigate("/teacher");
          } else {
            navigate("/home");
          }
        } else {
          setErrorMessage("Login failed. Please check your credentials.");
        }
      } catch (error) {
        console.error("Login error:", error);
        if (error.response && error.response.data) {
          setErrorMessage(error.response.data);
        } else {
          setErrorMessage("An error occurred during login");
        }

        setErrorMessage("Invalid username or password");

        setFormData({
          username: "",
          password: "",
        });
      } finally {
        setLoading(false);
      }
    } else {
      setErrorMessage("Please provide both username and password");
      setLoading(false);
    }
  };

  /**
   * Function to handle input change and update the form data state.
   *
   * @param {Event} event - The input change event.
   */
  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  return (
    // JSX code for the sign-in form component
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {errorMessage && (
          <Typography color="error" variant="body2" mb={2} align="center">
            {errorMessage}
          </Typography>
        )}
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            value={formData.username}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="password"
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Sign In"
            )}
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link component={RouterLink} to="/signup" variant="body2">
                Don't have an account? Sign Up
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}

export default SignIn;
