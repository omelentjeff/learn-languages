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

/**
 * React component for the teacher's dashboard, displaying a list of languages and allowing language management.
 *
 * This component provides a dashboard for teachers to manage languages,
 * including adding new languages and deleting existing ones.
 *
 * @returns {React.Component} - Teacher's dashboard component.
 */
export default function TeacherDashboard() {
  /**
   * State to store the data for language cards displayed on the dashboard.
   *
   * @type {Array}
   */
  const [cardsData, setCardsData] = useState([]);

  /**
   * State to control the visibility of the "Add Language" dialog.
   *
   * @type {boolean}
   */
  const [openAddLanguage, setOpenAddLanguage] = useState(false);

  /**
   * State to store the name of the new language being added.
   *
   * @type {string}
   */
  const [newLanguage, setNewLanguage] = useState("");

  /**
   * State to track loading state while fetching data.
   *
   * @type {boolean}
   */
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Function to fetch data for language cards from the server.
   */
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

  /**
   * Function to handle the click event for adding a new language.
   */
  const handleAddLanguageClick = () => {
    setOpenAddLanguage(true);
  };

  /**
   * Function to handle the close event of the "Add Language" dialog.
   */
  const handleCloseAddLanguage = () => {
    setOpenAddLanguage(false);
  };

  /**
   * Function to handle the deletion of a language.
   *
   * @param {string} languageId - The ID of the language to delete.
   */
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

  /**
   * Function to handle input change for the new language name.
   *
   * @param {Event} event - The input change event.
   */
  const handleNewLanguageInputChange = (event) => {
    setNewLanguage(event.target.value);
  };

  /**
   * Function to confirm the addition of a new language.
   */
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
    // JSX code for the teacher's dashboard component
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Toolbar />

      <Button
        color="inherit"
        startIcon={<AddIcon />}
        onClick={handleAddLanguageClick}
        sx={{
          marginLeft: "auto",
          marginRight: "auto",
          marginTop: "1rem",
          marginBottom: "1rem",
          maxWidth: "80%",
        }}
      >
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

      <Container maxWidth="lg" sx={{ flexGrow: 1, marginBottom: "2rem" }}>
        <Grid container spacing={3}>
          {cardsData.map((language) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={language.language_id}>
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
      </Container>

      <Copyright sx={{ mt: "auto" }} />
    </Box>
  );
}
