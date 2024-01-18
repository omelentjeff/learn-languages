import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => (
  <div>
    <h1>Ooops! Page not found</h1>
    <p>The page you're looking for does not exist.</p>
    <Link to="/home">Go to the Homepage</Link>
  </div>
);

export default NotFound;
