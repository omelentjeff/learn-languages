/**
 * @fileoverview This file defines the Home component, which serves as the main page
 * of a language learning application. It displays a collection of PlayCard components,
 * each representing a different language available for practice. The component fetches
 * language data from a server and uses Material-UI components for layout and styling.
 */
import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import axios from "axios";
import PlayCard from "./Playcard";
import LoadingSpinner from "./LoadingSpinner";

/**
 * Home component that displays available languages for exercises.
 *
 * @returns {ReactElement} The home page of the application, displaying a grid of language cards.
 */
export default function Home() {
  /**
   * State to store data for cards.
   *
   * @type {Array}
   */
  const [cardsData, setCardsData] = useState([]);

  /**
   * State to track loading state.
   *
   * @type {boolean}
   */
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Fetches data for the language cards from the server.
   * On success, sets the fetched data to the cardsData state.
   * On failure, logs an error to the console.
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

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Loading spinner while data is being fetched
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Main content rendering
  return (
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

      <Container maxWidth="lg" sx={{ mt: 2, mb: 2 }}>
        <Grid container spacing={3}>
          {cardsData.map((language) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={language.language_id}>
              <PlayCard
                key={language.language_id}
                languageId={language.language_id}
                languageName={language.language_name}
                wordCount={language.wordCount}
              />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
