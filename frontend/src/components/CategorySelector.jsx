import React, { useEffect, useState } from "react";
import CheckboxList from "./CheckboxList";
import LoadingSpinner from "./LoadingSpinner";
import Button from "@mui/material/Button";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from "axios";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const CategorySelector = () => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const { languageName } = useParams();

  const [languageChoice, setLanguageChoice] = useState("Finnish");

  const handleLanguageChange = (language) => {
    setLanguageChoice(language);
  };

  const handleSelectCategories = (categories) => {
    setSelectedCategories(categories);
  };

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
