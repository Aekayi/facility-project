import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectecRoutes = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectecRoutes;
