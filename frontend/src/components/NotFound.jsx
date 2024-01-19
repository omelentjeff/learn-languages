import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const NotFound = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);

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

  const handleButton = () => {
    if (userRole === "teacher") {
      navigate("/teacher");
    } else {
      navigate("/home");
    }
  };
  return (
    <div>
      <h1>Ooops! Page not found</h1>
      <p>The page you're looking for does not exist.</p>
      <button onClick={handleButton}>Go to home page</button>
    </div>
  );
};

export default NotFound;
