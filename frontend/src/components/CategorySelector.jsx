/**
 * @fileoverview This file defines the CategorySelector component, which is used
 * in a React application for selecting categories and language choices before starting
 * an exercise. It uses Material-UI components for the UI, Axios for HTTP requests, and
 * React Router for navigation.
 */

import React, { useEffect, useState } from "react";
import CheckboxList from "./CheckboxList";
import LoadingSpinner from "./LoadingSpinner";
import Button from "@mui/material/Button";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

/**
 * CategorySelector component for selecting categories and language before starting an exercise.
 * It allows users to select categories and the language in which they want to answer during the exercise.
 *
 * @returns {ReactElement} A component for selecting categories and language choice.
 */
const CategorySelector = () => {
  /**
   * State to store selected categories.
   *
   * @type {Array}
   */
  const [selectedCategories, setSelectedCategories] = useState([]);

  /**
   * State to track loading state.
   *
   * @type {boolean}
   */
  const [isLoading, setIsLoading] = useState(true);

  /**
   * React Router hook for navigation.
   *
   * @type {Function}
   */
  const navigate = useNavigate();

  /**
   * React Router hook for accessing route parameters.
   *
   * @type {Object}
   * @property {string} languageName - The name of the language obtained from the route parameters.
   */
  const { languageName } = useParams();

  /**
   * State to store the language choice with an initial value of "Finnish".
   *
   * @type {string}
   */
  const [languageChoice, setLanguageChoice] = useState("Finnish");

  /**
   * Handles the change of language choice.
   *
   * @param {string} language - The language to set as the choice.
   */
  const handleLanguageChange = (language) => {
    setLanguageChoice(language);
  };

  /**
   * Handles the selection of categories.
   *
   * @param {Array<string>} categories - The selected categories.
   */
  const handleSelectCategories = (categories) => {
    setSelectedCategories(categories);
  };

  /**
   * Handles the click event for starting the exercise.
   * Navigates to the exercise page with the selected language and categories.
   */
  const handleStartClick = () => {
    console.log("Selected Categories:", selectedCategories);
    navigate(`/play/${languageName}`, {
      state: {
        languageName: languageName,
        selectedCategories: selectedCategories,
        languageChoice: languageChoice,
      },
    });
  };

  /**
   * Checks if the selected language exists. If not, navigates to the not found page.
   */
  const checkLanguageExists = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/languages/${languageName}`,
        { withCredentials: true }
      );

      if (response.status === 200) {
        console.log("Language exists");
      }
    } catch (err) {
      if (err.response && err.response.status === 404) {
        navigate("*");
      } else {
        console.log("Error checking language existence", err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // useEffect to check language existence on component mount
  useEffect(() => {
    if (languageName) {
      checkLanguageExists();
    }
  }, [languageName, navigate]);

  // Conditional rendering based on loading state
  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    // JSX for rendering the category selection UI
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      spacing={2}
      sx={{ margin: 0, padding: 0 }}
    >
      <Grid item xs={12} sm={8} md={6} lg={4}>
        <Typography sx={{ mb: 4 }} variant="h6" align="center" gutterBottom>
          Choose the categories you want to practice (Leave empty if you want to
          practice all)
        </Typography>

        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Typography sx={{ mb: 2 }} variant="body1">
            Select which language to answer:
          </Typography>
          <Button
            variant={languageChoice === "Finnish" ? "contained" : "outlined"}
            color="primary"
            onClick={() => handleLanguageChange("Finnish")}
          >
            Finnish
          </Button>
          <Button
            variant={languageChoice !== "Finnish" ? "contained" : "outlined"}
            color="primary"
            onClick={() => handleLanguageChange(languageName)}
          >
            {languageName}
          </Button>
        </Box>

        <CheckboxList onSelectCategories={handleSelectCategories} />

        <Button
          variant="contained"
          color="primary"
          onClick={handleStartClick}
          sx={{ maxWidth: "80%", mt: 6, display: "block", marginX: "auto" }}
        >
          START
        </Button>
      </Grid>
    </Grid>
  );
};

export default CategorySelector;
