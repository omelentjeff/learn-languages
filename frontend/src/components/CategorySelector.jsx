import React, { useEffect, useState } from "react";
import CheckboxList from "./CheckboxList";
import Button from "@mui/material/Button";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import Layout from "./Layout";
import axios from "axios";

const CategorySelector = () => {
  const [selectedCategories, setSelectedCategories] = useState([]);
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
    }
  };

  useEffect(() => {
    if (languageName) {
      checkLanguageExists();
    }
  }, [languageName, navigate]);

  return (
    <Layout>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
        }}
      >
        <h2>Choose the categories you want to practice</h2>
        <CheckboxList onSelectCategories={handleSelectCategories} />
        <Button color="primary" onClick={handleStartClick}>
          START
        </Button>
      </div>
    </Layout>
  );
};

export default CategorySelector;
