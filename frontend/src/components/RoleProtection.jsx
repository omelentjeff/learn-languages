import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

/**
 * Higher-order component for protecting routes based on user roles.
 *
 * This component checks the user's role using an authenticated API call and
 * ensures that the user is authenticated and has the required role to access
 * the wrapped component. If the user does not meet the criteria, it performs
 * navigation accordingly.
 *
 * @param {React.Component} WrappedComponent - The component to render if the user meets the criteria.
 * @param {string[]} allowedRoles - An array of role names that are allowed to access the component.
 * @returns {React.Component} - A new component that handles role-based protection.
 */
function RoleProtection(WrappedComponent, allowedRoles) {
  /**
   * @param {Object} props - The props passed to the wrapped component.
   * @returns {React.Component} - The wrapped component, a loading message, a redirection to the home page, or an unauthorized access page.
   */
  return function (props) {
    /**
     * State to store the user's role.
     *
     * @type {string|null}
     */
    const [userRole, setUserRole] = useState(null);

    /**
     * State to track if the user is authenticated.
     *
     * @type {boolean}
     */
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    /**
     * State to track if the authentication check is in progress.
     *
     * @type {boolean}
     */
    const [isChecking, setIsChecking] = useState(true);

    /**
     * Function to fetch the user's role from the server.
     */
    const fetchRole = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/users/role`,
          { withCredentials: true }
        );
        setUserRole(response.data.role);
        setIsAuthenticated(true);
        setIsChecking(false);
      } catch (err) {
        setIsAuthenticated(false);
        setIsChecking(false);
        console.error("Error or unauthorized", err);
      }
    };

    useEffect(() => {
      fetchRole();
    }, []);

    /**
     * Render loading message while checking authentication,
     * redirect to the home page if not authenticated, or
     * redirect to the unauthorized page if the user does not have the allowed role.
     *
     * @returns {React.Component} - Loading message, redirection, or the wrapped component with props.
     */
    if (isChecking) {
      return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
      return <Navigate to="/" />;
    }

    if (!allowedRoles.includes(userRole)) {
      return <Navigate to="/unauthorized" />;
    }

    return <WrappedComponent {...props} />;
  };
}

export default RoleProtection;
