import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../hooks/reduxHooks";
import { LOGIN } from "./routes";

export default function ProtectedRoute() {
  const token = useAppSelector((state) => state.auth.token);

  if (!token) {
    return <Navigate to={LOGIN} replace />;
  }

  return <Outlet />;
}
