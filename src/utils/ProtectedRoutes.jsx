import React from "react";
import { Navigate } from "react-router-dom";

const ProtectecRoutes = ({ children }) => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectecRoutes;
