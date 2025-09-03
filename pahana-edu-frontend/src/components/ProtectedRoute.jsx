import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../store/AuthContext";

const norm = (r) => String(r || "").toUpperCase().replace(/^ROLE_/, "");

export default function ProtectedRoute({ roles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;

  // If no roles specified, only require login
  if (!roles || (Array.isArray(roles) && roles.length === 0)) return <Outlet />;

  // Collect all possible role names from the user
  const userRoles = [
    user.role,
    ...(user.roles || []),
    ...(user.authorities?.map((a) => a.authority) || []),
  ].map(norm);

  // Allow synonyms (USER ≈ CUSTOMER, STAFF ≈ ADMIN)
  const wanted = (Array.isArray(roles) ? roles : [roles])
    .map(norm)
    .flatMap((r) => (r === "CUSTOMER" ? ["CUSTOMER", "USER"] : r === "ADMIN" ? ["ADMIN", "STAFF"] : [r]));

  const ok = wanted.some((r) => userRoles.includes(r));
  return ok ? <Outlet /> : <Navigate to="/404" replace />;
}


