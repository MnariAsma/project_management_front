import { useAppDispatch, useAppSelector } from "../../../hooks/reduxHooks";
import { useLogoutMutation } from "../Apis/AuthApi";
import { clearCredentials, setCredentials } from "../slices/authSlice";
import { GITHUB_REDIRECT_ENDPOINT } from "../constants/authEndpoints";
import { API_BASE_URL } from "../../../constants/api";
import type { User } from "../../../types/types";

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, token, refreshToken } = useAppSelector((state) => state.auth);

  const [logoutApi, { isLoading: isLoggingOut }] = useLogoutMutation();

  const handleGithubLogin = () => {
    window.location.href = `${API_BASE_URL}${GITHUB_REDIRECT_ENDPOINT}`;
  };

  const handleGithubCallback = (
    accessToken: string,
    refreshTokenValue: string,
    userData: User
  ) => {
    dispatch(
      setCredentials({
        user: userData,
        token: accessToken,
        refreshToken: refreshTokenValue,
      })
    );
  };

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
    } catch {
      // ignore logout api failure if token expired
    } finally {
      dispatch(clearCredentials());
    }
  };

  return {
    user,
    token,
    refreshToken,
    handleGithubLogin,
    handleGithubCallback,
    handleLogout,
    isLoggingOut,
  };
};
