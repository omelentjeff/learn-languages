import React from "react";
import { Link } from "react-router-dom";

const Unauthorized = () => (
  <div>
    <h1>Unauthorized Access</h1>
    <p>You do not have permission to view this page.</p>
    <Link to="/home">Go to the Homepage</Link>
  </div>
);

export default Unauthorized;
