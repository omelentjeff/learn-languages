import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LoadingSpinner from "./LoadingSpinner";

/**
 * Higher-order component for redirecting users based on their authentication status.
 *
 * This component checks the user's role using an authenticated API call and
 * redirects them to different routes based on their role.
 *
 * @param {React.Component} Component - The component to render if the user is authenticated.
 * @returns {React.Component} - A new component that handles authentication redirection.
 */
const RedirectIfAuthenticated = (Component) => {
  /**
   * @param {Object} props - The props passed to the wrapped component.
   * @returns {React.Component} - The wrapped component or a loading spinner while checking authentication.
   */
  return (props) => {
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
     * State to track loading state while checking authentication.
     *
     * @type {boolean}
     */
    const [isLoading, setIsLoading] = useState(true);

    /**
     * Effect to check user authentication status on component mount.
     */
    useEffect(() => {
      /**
       * Function to asynchronously check authentication status and update the user's role.
       */
      const checkAuthentication = async () => {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/users/role`,
            { withCredentials: true }
          );

          if (response.data && response.data.role) {
            setUserRole(response.data.role);
          } else {
            setUserRole(null);
          }
        } catch (err) {
          console.error("Error authenticating user", err);
        } finally {
          setIsLoading(false);
        }
      };

      checkAuthentication();
    }, [navigate]);

    /**
     * Effect to redirect users based on their role when loading is complete.
     */
    useEffect(() => {
      if (!isLoading) {
        if (userRole === "student") {
          navigate("/home");
        } else if (userRole === "teacher") {
          navigate("/teacher");
        }
      }
    }, [userRole, isLoading, navigate]);

    /**
     * Render the loading spinner while checking authentication or the wrapped component.
     *
     * @returns {React.Component} - LoadingSpinner component or the wrapped component with props.
     */
    if (isLoading) {
      return <LoadingSpinner />;
    }
    return <Component {...props} />;
  };
};

export default RedirectIfAuthenticated;
