import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LoadingSpinner from "./LoadingSpinner";

const RedirectIfAuthenticated = (Component) => {
  return (props) => {
    const navigate = useNavigate();
    const [userRole, setUserRole] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
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

    // Redirect based on the role
    useEffect(() => {
      if (!isLoading) {
        if (userRole === "student") {
          navigate("/home");
        } else if (userRole === "teacher") {
          navigate("/teacher");
        }
      }
    }, [userRole, isLoading, navigate]);

    if (isLoading) {
      return <LoadingSpinner />;
    }
    return <Component {...props} />;
  };
};

export default RedirectIfAuthenticated;
