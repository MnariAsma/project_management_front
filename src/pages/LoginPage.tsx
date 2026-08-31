import { Navigate } from "react-router-dom";
import { useAuth } from "../modules/auth/hooks/useAuth";
import { DASHBOARD } from "../routes/routes";
import LoginComponent from "../modules/auth/Components/loginComponents/Login";

export default function LoginPage() {
  const { token } = useAuth();

  if (token) {
    return <Navigate to={DASHBOARD} replace />;
  }

  return (
    <div className="login-page">
      <LoginComponent />
    </div>
  );
}
