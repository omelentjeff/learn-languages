import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

function RoleProtection(WrappedComponent, allowedRoles) {
  return function (props) {
    const [userRole, setUserRole] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isChecking, setIsChecking] = useState(true);

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
