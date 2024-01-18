import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

function RoleProtection(WrappedComponent, allowedRoles) {
  return function (props) {
    const [userRole, setUserRole] = useState(null);
    const [isChecking, setIsChecking] = useState(true);

    const fetchRole = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/users/role`,
          { withCredentials: true }
        );
        setUserRole(response.data.role);
        setIsChecking(false);
      } catch (err) {
        setUserRole(null);
        setIsChecking(false);
        console.error("Unauthorized");
      }
    };

    useEffect(() => {
      fetchRole();
    }, []);

    if (isChecking) {
      return <div>Loading...</div>;
    }

    if (!userRole || !allowedRoles.includes(userRole)) {
      return <Navigate to="/unauthorized" />;
    }

    return <WrappedComponent {...props} />;
  };
}

export default RoleProtection;
