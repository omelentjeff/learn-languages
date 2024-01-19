import React, { useEffect, useState } from "react";
import CheckboxList from "./CheckboxList";
import LoadingSpinner from "./LoadingSpinner";
import Button from "@mui/material/Button";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from "axios";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

const CategorySelector = () => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const { languageName } = useParams();

  const handleSelectCategories = (categories) => {
    setSelectedCategories(categories);
  };

  const handleStartClick = () => {
    console.log("Selected Categories:", selectedCategories);
    navigate(`/play/${languageName}`, {
      state: {
        languageName: languageName,
        selectedCategories: selectedCategories,
      },
    });
  };

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

  useEffect(() => {
    if (languageName) {
      checkLanguageExists();
    }
  }, [languageName, navigate]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      spacing={2}
    >
      <Grid item xs={12} sm={8} md={6} lg={4}>
        <Typography variant="h6" align="center" gutterBottom>
          Choose the categories you want to practice (Leave empty if you want to
          practice all)
        </Typography>
        <CheckboxList onSelectCategories={handleSelectCategories} />
        <Button
          variant="contained"
          color="primary"
          onClick={handleStartClick}
          fullWidth
        >
          START
        </Button>
      </Grid>
    </Grid>
  );
};

export default CategorySelector;
