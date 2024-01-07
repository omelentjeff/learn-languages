import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import LogoutIcon from "@mui/icons-material/Logout";
import Hidden from "@mui/material/Hidden";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";

import BasicCard from "./BasicCard";
import AddLanguageForm from "./AddLanguageForm";
import axios from "axios";

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

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: "100%",
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

export default function TeacherDashboard() {
  const [cardsData, setCardsData] = useState([]);
  const [openAddLanguage, setOpenAddLanguage] = useState(false);

  const handleAddLanguageClick = () => {
    setOpenAddLanguage(true);
  };

  const handleCloseAddLanguage = () => {
    setOpenAddLanguage(false);
  };

  const addLanguageToState = (newLanguage) => {
    setCardsData((prevData) => [...prevData, newLanguage]);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/languages`
        );
        setCardsData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="absolute">
        <Toolbar
          sx={{
            pr: "24px",
          }}
        >
          <Typography
            component="h1"
            variant="h5"
            color="inherit"
            noWrap
            sx={{ flexGrow: 1, textAlign: "center" }}
          >
            Teacher Dashboard
          </Typography>

          <IconButton color="inherit">
            <Hidden smDown>
              <Typography
                variant="body1"
                color="inherit"
                sx={{ marginRight: 1 }}
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
        <Button
          color="inherit"
          startIcon={<AddIcon />}
          onClick={handleAddLanguageClick}
          sx={{
            marginLeft: "auto",
            marginRight: "auto",
            marginTop: "1rem",
            display: "flex",
            alignItems: "center",
          }}
        >
          {" "}
          Add Language
        </Button>
        <AddLanguageForm
          open={openAddLanguage}
          handleClose={handleCloseAddLanguage}
          addLanguageToState={addLanguageToState}
        />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Grid container spacing={3}>
            {cardsData.map((language) => (
              <Grid item xs={4} md={4} lg={3} key={language.language_id}>
                <BasicCard
                  key={language.language_id}
                  languageId={language.language_id}
                  languageName={language.language_name}
                  wordCount={language.wordCount}
                />
              </Grid>
            ))}
          </Grid>
          <Copyright sx={{ mt: 20 }} />
        </Container>
      </Box>
    </Box>
  );
}
