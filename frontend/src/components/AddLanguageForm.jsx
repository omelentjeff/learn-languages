/**
 * @fileoverview This file defines the AddLanguageForm component, which is used
 * in a React application to add a new language. The component consists of a dialog
 * with an input field for entering a language name and buttons for submitting or canceling.
 * It uses Material-UI for styling and Axios for making HTTP requests to the API.
 */

import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import axios from "axios";

/**
 * AddLanguageForm component for adding a new language to the system.
 *
 * @param {Object} props - Props for AddLanguageForm component.
 * @param {boolean} props.open - State to control the opening of the dialog.
 * @param {Function} props.handleClose - Function to close the dialog.
 * @param {Function} props.addLanguageToState - Function to add the new language to the application state.
 * @returns {ReactElement} A dialog component with input and buttons.
 */
const AddLanguageForm = ({ open, handleClose, addLanguageToState }) => {
  /**
   * State to store the name of the language.
   *
   * @type {string}
   */
  const [languageName, setLanguageName] = useState("");

  /**
   * Makes an API request to add a new language.
   *
   * @param {Object} language - Language object containing the language name to be added.
   */
  const addLanguage = async (language) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/languages`,
        { withCredentials: true },
        language
      );

      const newLanguage = { ...response.data, wordCount: 0 };
      console.log("from addLanguage:", response.data);

      addLanguageToState(newLanguage);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  /**
   * Handles the addition of a new language when the 'Add Language' button is clicked.
   */
  const handleAddLanguage = async () => {
    try {
      await addLanguage({ language: languageName });
      handleClose();
    } catch (error) {
      console.error("Error adding language:", error);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add New Language</DialogTitle>
      <DialogContent>
        <DialogContentText>Enter language name:</DialogContentText>
        <input
          type="text"
          value={languageName}
          onChange={(e) => setLanguageName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleAddLanguage} color="primary">
          Add Language
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddLanguageForm;
