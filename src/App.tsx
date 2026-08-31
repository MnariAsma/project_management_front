import { Routes, Route } from "react-router-dom";
import { LOGIN, AUTH_CALLBACK, NOTFOUND } from "./routes/routes";
import ProtectedRoute from "./routes/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import AuthCallbackPage from "./pages/AuthCallbackPage";
import AppLayout from "./components/Layout/AppLayout";
import ToastContainer from "./components/Toast/ToastContainer";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path={LOGIN} element={<LoginPage />} />
        <Route path={AUTH_CALLBACK} element={<AuthCallbackPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>

          </Route>
        </Route>

        <Route path={NOTFOUND} element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;
