import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import axios from "axios";

const AddLanguageForm = ({ open, handleClose, addLanguageToState }) => {
  const [languageName, setLanguageName] = useState("");

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
