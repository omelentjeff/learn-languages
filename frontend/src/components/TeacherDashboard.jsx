import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";

import LoadingSpinner from "./LoadingSpinner";

import BasicCard from "./BasicCard";
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

export default function TeacherDashboard() {
  const [cardsData, setCardsData] = useState([]);
  const [openAddLanguage, setOpenAddLanguage] = useState(false);
  const [newLanguage, setNewLanguage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/languages`,
        { withCredentials: true }
      );
      setCardsData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddLanguageClick = () => {
    setOpenAddLanguage(true);
  };

  const handleCloseAddLanguage = () => {
    setOpenAddLanguage(false);
  };

  const handleDeleteLanguage = async (languageId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/languages/${languageId}`,
        { withCredentials: true }
      );

      setCardsData((prevData) =>
        prevData.filter((language) => language.language_id !== languageId)
      );
    } catch (error) {
      console.error("Error deleting language:", error);
    }
  };

  const handleNewLanguageInputChange = (event) => {
    setNewLanguage(event.target.value);
  };

  const handleConfirmNewLanguage = async () => {
    try {
      console.log("Adding new language...", newLanguage);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/languages/`,
        { language: newLanguage },
        { withCredentials: true }
      );

      console.log("New language added:", response.data);

      fetchData();
      handleCloseAddLanguage();
    } catch (error) {
      console.error("Error adding new category:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Box sx={{ display: "flex" }}>
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

        <Dialog open={openAddLanguage} onClose={handleCloseAddLanguage}>
          <DialogTitle>Add New Language</DialogTitle>
          <DialogContent>
            <TextField
              label="Language Name"
              fullWidth
              name="newLanguage"
              value={newLanguage}
              onChange={handleNewLanguageInputChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseAddLanguage}>Cancel</Button>
            <Button onClick={handleConfirmNewLanguage} color="primary">
              Add Language
            </Button>
          </DialogActions>
        </Dialog>

        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Grid container spacing={3}>
            {cardsData.map((language) => (
              <Grid item xs={4} md={4} lg={3} key={language.language_id}>
                <BasicCard
                  key={language.language_id}
                  languageId={language.language_id}
                  languageName={language.language_name}
                  wordCount={language.wordCount}
                  onDelete={() => handleDeleteLanguage(language.language_id)}
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
