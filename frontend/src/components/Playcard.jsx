import React from "react";
import { Link } from "react-router-dom";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box"; // Import the Box component

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
