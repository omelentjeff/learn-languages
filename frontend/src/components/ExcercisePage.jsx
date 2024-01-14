import React from "react";
import { useLocation } from "react-router-dom";

const ExcercisePage = () => {
  const { state } = useLocation();
  const { languageName, selectedCategories } = state;

  return (
    <div>
      <h1>Exercise Page for {languageName}</h1>
      <p>Selected Categories: {selectedCategories.join(", ")}</p>
    </div>
  );
};

export default ExcercisePage;
