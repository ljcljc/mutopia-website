import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import "./styles/globals.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useAuthStore } from "@/components/auth/authStore";
import { STORAGE_KEYS } from "@/lib/storageKeys";
import { getEncryptedItem, removeEncryptedItem } from "@/lib/encryption";

// Load user info from encrypted localStorage on app start
const loadUserInfo = async () => {
  try {
    const userInfoStr = await getEncryptedItem(STORAGE_KEYS.USER_INFO);
    if (userInfoStr) {
      const userInfo = JSON.parse(userInfoStr);
      // Validate that the stored user info has required fields
      if (userInfo && typeof userInfo === "object" && userInfo.name && userInfo.email) {
        useAuthStore.getState().setUser({
          name: userInfo.name,
          email: userInfo.email,
          avatar: userInfo.avatar,
        });
      }
    }
  } catch (e) {
    console.warn("Failed to load user info from localStorage:", e);
    // Clear invalid data
    try {
      removeEncryptedItem(STORAGE_KEYS.USER_INFO);
    } catch (clearError) {
      console.warn("Failed to clear invalid user info from localStorage:", clearError);
    }
  }
};

// Load user info before rendering
loadUserInfo();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
