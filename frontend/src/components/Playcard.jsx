import React, { useState } from "react";
import { Link } from "react-router-dom";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

// ...

export default function PlayCard({ languageId, languageName, wordCount }) {
  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
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
      </CardContent>
      <CardActions sx={{ display: "flex", justifyContent: "space-between" }}>
        <Link to={`/${languageName}`}>
          <Button size="medium">Play</Button>
        </Link>
      </CardActions>
    </Card>
  );
}
