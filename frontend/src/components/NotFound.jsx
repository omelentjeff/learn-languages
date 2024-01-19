/**
 * @fileoverview This file defines the NotFound component, a React component
 * displayed when a user navigates to a route that does not exist in the application.
 * This component checks the user's role and provides a button to redirect them
 * to the appropriate home page based on their role.
 */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

/**
 * NotFound component that is displayed when a user navigates to an undefined route.
 * This component fetches the user's role to determine the appropriate redirection
 * path and provides a button for navigation.
 *
 * @returns {ReactElement} A component displaying a not-found message and a redirection button.
 */
const NotFound = () => {
  /**
   * React Router hook for navigation.
   *
   * @type {Function}
   */
  const navigate = useNavigate();

  /**
   * State to store the user's role, initially set to null.
   *
   * @type {string|null}
   */
  const [userRole, setUserRole] = useState(null);

  /**
   * Fetches the user's role on component mount. Redirects to the base route
   * ('/') in case of an error or unauthorized access.
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
   * Handles the click event on the button, redirecting to either the teacher's
   * or the standard home page based on the user's role.
   */
  const handleButton = () => {
    if (userRole === "teacher") {
      navigate("/teacher");
    } else {
      navigate("/home");
    }
  };
  return (
    // JSX rendering for the NotFound page
    <div>
      <h1>Ooops! Page not found</h1>
      <p>The page you're looking for does not exist.</p>
      <button onClick={handleButton}>Go to home page</button>
    </div>
  );
};

export default NotFound;
