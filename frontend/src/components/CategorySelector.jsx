import React from "react";
import CheckboxList from "./CheckboxList";

const CenteredCheckboxList = () => {
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
      <h2>Choose the categories</h2>
      <CheckboxList />
    </div>
  );
};

export default CenteredCheckboxList;
