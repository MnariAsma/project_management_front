import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { AuthState } from "./AuthStateInterface";;
import type { User } from "../../../types/types";
import { STORAGE_KEYS } from "../../../constants/constants";
import { storageHelper } from "../../../utils/localStorageHelper";

const storedToken = storageHelper.getItem(STORAGE_KEYS.token);
const storedRefreshToken = storageHelper.getItem(STORAGE_KEYS.refreshToken);
const storedUser = storageHelper.getItem(STORAGE_KEYS.user);

let parsedUser: User | null = null;

if (storedUser) {
  try {
    parsedUser = typeof storedUser === "string" ? JSON.parse(storedUser) : storedUser;
  } catch (e) {
    console.warn("Invalid JSON in localStorage for user:", storedUser);
    storageHelper.removeItem(STORAGE_KEYS.user);
  }
}

const initialState: AuthState = {
  user: parsedUser,
  token: storedToken || null,
  refreshToken: storedRefreshToken || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string; refreshToken: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      storageHelper.setItem(STORAGE_KEYS.token, action.payload.token);
      storageHelper.setItem(STORAGE_KEYS.refreshToken, action.payload.refreshToken);
      storageHelper.setItem(STORAGE_KEYS.user, JSON.stringify(action.payload.user));
    },

    clearCredentials: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      storageHelper.removeItem(STORAGE_KEYS.token);
      storageHelper.removeItem(STORAGE_KEYS.refreshToken);
      storageHelper.removeItem(STORAGE_KEYS.user);
    },
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;
