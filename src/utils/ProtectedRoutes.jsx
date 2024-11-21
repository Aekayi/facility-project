import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";


const ProtectecRoutes = ({ children }) => {
  const accessToken = useSelector((state) => state.auth.accessToken);
  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectecRoutes;
