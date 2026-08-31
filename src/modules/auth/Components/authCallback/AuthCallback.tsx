import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { DASHBOARD, LOGIN } from "../../../../routes/routes";
import { useAppDispatch } from "../../../../hooks/reduxHooks";
import { addToast } from "../../../../slices/toast/toastSlice";
import type { User } from "../../../../types/types";

export default function AuthCallbackComponent() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { handleGithubCallback } = useAuth();
  const processed = useRef(false);

  useEffect(() => {
    if (processed.current) return;
    processed.current = true;

    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");
    const userParam = params.get("user");

    if (!accessToken || !refreshToken || !userParam) {
      console.error("[AuthCallback] Missing OAuth callback params.");
      dispatch(
        addToast({
          message: "Failed to authenticate with GitHub. Missing credentials.",
          type: "error",
        })
      );
      navigate(LOGIN, { replace: true });
      return;
    }

    let user: User;
    try {
      user = JSON.parse(atob(userParam));
    } catch {
      console.error("[AuthCallback] Failed to decode user param.");
      dispatch(
        addToast({
          message: "Failed to parse user data from GitHub callback.",
          type: "error",
        })
      );
      navigate(LOGIN, { replace: true });
      return;
    }

    handleGithubCallback(accessToken, refreshToken, user);
    dispatch(
      addToast({
        message: `Welcome back, ${user.name}! Successfully authenticated.`,
        type: "success",
      })
    );
    navigate(DASHBOARD, { replace: true });
  }, [handleGithubCallback, navigate, dispatch]);

  return (
    <div className="callback-page">
      <div className="callback-spinner" aria-label="Completing sign in…">
        <svg className="spinner-svg" viewBox="0 0 50 50" aria-hidden="true">
          <circle
            className="spinner-path"
            cx="25"
            cy="25"
            r="20"
            fill="none"
            strokeWidth="4"
          />
        </svg>
        <p>Completing GitHub authentication…</p>
      </div>
    </div>
  );
}
