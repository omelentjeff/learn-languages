import React, { useState } from "react";
import CheckboxList from "./CheckboxList";
import Button from "@mui/material/Button";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

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

  return (
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
  );
};

export default CategorySelector;
