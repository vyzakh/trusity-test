import { configureStore } from "@reduxjs/toolkit";

// import { LoginResponse } from "../../../features/auth/services/types";
// import { storage } from "../../utils/storage";

// import authSlice from "./features/authSlice";
// import layoutSlice from "./features/layoutSlice";
// import signUpSlice from "./features/signUpSlice";

// const getStoredAuthData = (): Omit<LoginResponse["login"], "message"> & {
//   isSessionExpired: boolean;
// } => {
//   const rememberMe = localStorage.getItem("remember-me") === "true";
//   const storageType = rememberMe ? "local" : "session";

//   const userInfo = storage[storageType].get("user-info") ?? null;
//   const accessToken = storage[storageType].get("access-token") ?? null;
//   const tenant = storage[storageType].get("tenant") ?? null;

//   return {
//     user: userInfo ? userInfo : { email: "", first_name: "", last_name: "" },
//     accessToken,
//     tenant,
//     isSessionExpired: false,
//   };
// };

// const preloadedAuthData = getStoredAuthData();

export const store = configureStore({
  reducer: {
    // layout: layoutSlice,
    // auth: authSlice,
    // signUp: signUpSlice,
  },
  // preloadedState: {
  //   auth: preloadedAuthData,
  // },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
