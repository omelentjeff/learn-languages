import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

/**
 * React component for unauthorized access page.
 *
 * This component is displayed when a user tries to access a page for which they do not have permission.
 * It checks the user's role and allows them to navigate back to the home page.
 *
 * @returns {React.Component} - Unauthorized access page component.
 */
const Unauthorized = () => {
  /**
   * React Router hook for navigation.
   *
   * @type {Function}
   */
  const navigate = useNavigate();

  /**
   * State to store the user's role.
   *
   * @type {string|null}
   */
  const [userRole, setUserRole] = useState(null);

  /**
   * Function to fetch the user's role from the server.
   */
  useEffect(() => {
    const fetchRole = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/users/role`,
          { withCredentials: true }
        );
        setUserRole(response.data.role);
      } catch (error) {
        console.error("Error or unauthorized", error);
        navigate("/");
      }
    };

    fetchRole();
  }, [navigate]);

  /**
   * Function to handle the button click and navigate to the appropriate page based on the user's role.
   */
  const handleButton = () => {
    if (userRole === "teacher") {
      navigate("/teacher");
    } else {
      navigate("/home");
    }
  };

  return (
    <div>
      <h1>Unauthorized Access</h1>
      <p>You do not have permission to view this page.</p>
      <button onClick={handleButton}>Go to home page</button>
    </div>
  );
};

export default Unauthorized;
