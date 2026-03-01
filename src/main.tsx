import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import "./styles/globals.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useAuthStore } from "@/components/auth/authStore";
import { STORAGE_KEYS } from "@/lib/storageKeys";
import { getEncryptedItem } from "@/lib/encryption";
import { getCurrentUser } from "@/lib/api";

// Refresh user info from API on app start if access token exists
const refreshUserInfoFromApi = async () => {
  try {
    const accessToken = await getEncryptedItem(STORAGE_KEYS.ACCESS_TOKEN);
    if (!accessToken) return;
    const userInfo = await getCurrentUser();
    useAuthStore.getState().setUserInfo(userInfo);
  } catch (e) {
    console.warn("Failed to refresh user info from API:", e);
  }
};

// Refresh user info from API on app start (localStorage user info is not used)
refreshUserInfoFromApi();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
