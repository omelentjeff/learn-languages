import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Link as RouterLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Otto Melentjeff
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

export default function SignUp() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showVerifyPassword, setShowVerifyPassword] = React.useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    verifyPassword: "",
    role: "student",
  });
  const navigate = useNavigate();

  const checkPasswordMatch = (password1, password2) => {
    return password1 === password2;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    const data = new FormData(event.currentTarget);

    if (!data.get("username")) {
      setErrorMessage("Please provide a username.");
      return;
    }

    const password = checkPasswordMatch(
      data.get("password"),
      data.get("verifyPassword")
    );

    if (password && data.get("username")) {
      const user = {
        username: data.get("username"),
        password: data.get("password"),
        role: formData.role,
      };

      try {
        setLoading(true);
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/users/signup`,
          user,
          { withCredentials: true }
        );

        console.log("jwt:", response.data.token);
        console.log("Response Headers:", response.headers);

        if (response.status === 200) {
          const decodedToken = jwtDecode(response.data.token);
          const userRole = decodedToken.role;

          if (userRole === "teacher") {
            navigate("/teacher");
          } else {
            navigate("/home");
          }
        } else {
          setErrorMessage("Signup failed. Please check your credentials.");
        }
      } catch (error) {
        console.error("Error during signup:", error);
        if (error.response) {
          console.error("Server response:", error.response);
          if (error.response.data) {
            setErrorMessage(error.response.data);
          } else {
            setErrorMessage(
              "An unexpected error occurred. Please try again later."
            );
          }
        } else {
          setErrorMessage(
            "An unexpected error occurred. Please try again later."
          );
        }
      } finally {
        setLoading(false);
      }
    } else {
      setErrorMessage("Passwords do not match.");
    }
  };

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  return (
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
          Sign up
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                value={formData.username}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete="new-password"
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
                value={formData.password}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="verifyPassword"
                label="Verify Password"
                type={showVerifyPassword ? "text" : "password"}
                id="verifyPassword"
                autoComplete="new-password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          setShowVerifyPassword(!showVerifyPassword)
                        }
                        edge="end"
                      >
                        {showVerifyPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                value={formData.verifyPassword}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.role === "teacher"}
                    onChange={() =>
                      setFormData({
                        ...formData,
                        role:
                          formData.role === "teacher" ? "student" : "teacher",
                      })
                    }
                    color="primary"
                  />
                }
                label="I'm a teacher."
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link component={RouterLink} to="/" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Copyright sx={{ mt: 5 }} />
    </Container>
  );
}
