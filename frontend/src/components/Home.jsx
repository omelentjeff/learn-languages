import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import axios from "axios";
import PlayCard from "./Playcard";
import LoadingSpinner from "./LoadingSpinner";

export default function Home() {
  const [cardsData, setCardsData] = useState([]);
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

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

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
