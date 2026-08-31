import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { authApi } from "../modules/auth/Apis/AuthApi";
import authReducer from "../modules/auth/slices/authSlice";
import toastReducer from "../slices/toast/toastSlice";
import { projectApi } from "../modules/projects/Apis/projectApi";
import { githubApi } from "../modules/github/Apis/githubApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    toast: toastReducer,
    [authApi.reducerPath]: authApi.reducer,
    [projectApi.reducerPath]: projectApi.reducer,
    [githubApi.reducerPath]: githubApi.reducer,


  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(projectApi.middleware)
      .concat(githubApi.middleware),

});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
setupListeners(store.dispatch);
