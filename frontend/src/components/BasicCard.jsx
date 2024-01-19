/**
 * @fileoverview This file defines the BasicCard component, which is used
 * in a React application to display information about a language, including options
 * to edit and delete the language. It utilizes Material-UI components for styling
 * and Axios for making HTTP requests.
 */

import React, { useState } from "react";
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
  DialogActions,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";

/**
 * BasicCard component to display language details.
 * This component shows the name of a language, the count of exercises in it, and provides options to edit or delete the language.
 *
 * @param {Object} props - Props for BasicCard component.
 * @param {number} props.languageId - The ID of the language.
 * @param {string} props.languageName - The name of the language.
 * @param {number} props.wordCount - The count of words or exercises in the language.
 * @param {Function} props.onDelete - Function to call when the delete action is confirmed.
 * @returns {ReactElement} A card component displaying language information with edit and delete options.
 */
export default function BasicCard({
  languageId,
  languageName,
  wordCount,
  onDelete,
}) {
  const [openConfirmation, setOpenConfirmation] = useState(false);

  /**
   * Opens the delete confirmation dialog.
   */
  const handleDeleteRow = () => {
    setOpenConfirmation(true);
  };

  /**
   * Handles the confirmation of deletion and triggers the deletion process.
   */
  const handleConfirmation = () => {
    setOpenConfirmation(false);
    onDelete(languageId);
  };

  return (
    // JSX for rendering the card, edit button, delete button, and confirmation dialog

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
          <Button variant="contained" color="primary">
            Edit
          </Button>
        </Link>
        <IconButton onClick={() => handleDeleteRow(onDelete)}>
          <DeleteIcon />
        </IconButton>
      </CardActions>

      <Dialog
        open={openConfirmation}
        onClose={() => setOpenConfirmation(false)}
      >
        <DialogTitle>Delete Exercise</DialogTitle>
        <DialogContent>
          <p>
            Are you sure you want to delete this language and all its
            excercises?
          </p>
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
