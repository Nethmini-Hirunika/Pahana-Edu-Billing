import { Navigate } from "react-router-dom";
import { useAuth } from "../store/AuthContext";

export default function RoleGuard({ allow = [], children }) {
  const { role } = useAuth();
  if (!allow.includes(role)) return <Navigate to="/403" replace />;
  return children;
}