/**
 * @fileoverview This file defines the PlayCard component, a React component
 * used in a language learning application. It displays a card with information
 * about a language, including the number of exercises available, and provides
 * a link to play these exercises.
 */
import React from "react";
import { Link } from "react-router-dom";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

/**
 * PlayCard component that displays information about a language and provides
 * a link to start exercises for that language.
 *
 * @param {Object} props - Props for PlayCard component.
 * @param {number} props.languageId - The unique ID of the language.
 * @param {string} props.languageName - The name of the language.
 * @param {number} props.wordCount - The number of exercises available for the language.
 * @returns {ReactElement} A card component displaying language information with a play button.
 */
export default function PlayCard({ languageId, languageName, wordCount }) {
  return (
    <Card sx={{ minWidth: 275, paddingBottom: 2 }}>
      <CardContent>
        <Box sx={{ textAlign: "center" }}>
          {" "}
          <Typography
            component="h2"
            variant="h4"
            color="text.secondary"
            gutterBottom
            sx={{ fontWeight: "bold" }}
          >
            {languageName}
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            Exercises: {wordCount}
          </Typography>
        </Box>
      </CardContent>
      <CardActions sx={{ display: "flex", justifyContent: "center" }}>
        <Link to={`/${languageName}`}>
          <Button variant="contained" color="primary">
            PLAY
          </Button>
        </Link>
      </CardActions>
    </Card>
  );
}
