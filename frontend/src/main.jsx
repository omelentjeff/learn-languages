/**
 * @fileoverview This is the entry point file for the React application.
 * It imports the necessary React modules and the root App component,
 * then renders the App component within the 'root' DOM element of the index.html file.
 * React.StrictMode is used for highlighting potential problems in an application.
 */

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

/**
 * Renders the root App component inside the DOM element with the id 'root'.
 * Wraps the App component in React.StrictMode for development environment benefits,
 * such as checking for deprecated APIs and unexpected side effects.
 */
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
