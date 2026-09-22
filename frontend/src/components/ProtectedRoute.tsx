import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../services/auth";

export function ProtectedRoute() {
  const { token } = useAuth();
  if (!token) return <Navigate to="/admin/login" replace />;
  return <Outlet />;
}
