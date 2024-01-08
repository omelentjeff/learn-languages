import React, { useState } from "react";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";

import axios from "axios";

// ...

export default function BasicCard({ languageId, languageName, wordCount }) {
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [wordIdToDelete, setWordIdToDelete] = useState(null);

  const handleDeleteRow = () => {
    setWordIdToDelete(languageId);
    setOpenConfirmation(true);
  };

  const handleConfirmation = async () => {
    setOpenConfirmation(false);

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/languages/${wordIdToDelete}`
      );

      setWordIdToDelete(null);
    } catch (error) {
      console.error("Error deleting row:", error);
    }
  };

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
        <Link to={`/edit/${languageName}`}>
          <Button size="small">Edit</Button>
        </Link>
        <IconButton onClick={handleDeleteRow}>
          <DeleteIcon />
        </IconButton>
      </CardActions>

      <Dialog
        open={openConfirmation}
        onClose={() => setOpenConfirmation(false)}
      >
        <DialogTitle>Delete Exercise</DialogTitle>
        <DialogContent>
          <p>Are you sure you want to delete this exercise?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmation(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmation} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}
