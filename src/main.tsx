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
import { type MeOut } from "@/lib/api";

// Load user info from localStorage on app start (only from localStorage, not API)
// This follows the pattern: check global state first, if not found, load from localStorage
const loadUserInfoFromStorage = async () => {
  try {
    // Check if already in global state (shouldn't happen on initial load, but safe check)
    const currentUserInfo = useAuthStore.getState().userInfo;
    if (currentUserInfo) {
      return; // Already loaded, skip
    }

    // Load from localStorage
    const userInfoStr = await getEncryptedItem(STORAGE_KEYS.USER_INFO);
    if (userInfoStr) {
      const parsed = JSON.parse(userInfoStr);
      
      // Check if it's MeOut type (has first_name or email, but not just name)
      if (parsed && typeof parsed === "object" && parsed.email) {
        // If it has first_name or doesn't have name, it's MeOut type
        if (parsed.first_name !== undefined || !parsed.name) {
          // It's MeOut type, restore to userInfo (this will also set user)
          useAuthStore.getState().setUserInfo(parsed as MeOut);
        } else {
          // Legacy User type (has name), convert to MeOut format for compatibility
          // This handles old data format
          const userInfo: MeOut = {
            id: "",
            email: parsed.email,
            first_name: parsed.name.split(" ")[0] || null,
            last_name: parsed.name.split(" ").slice(1).join(" ") || null,
            birthday: null,
            address: null,
            receive_marketing_message: false,
            role: "user",
            is_email_verified: true,
            invite_code: null,
            is_member: false,
          };
          useAuthStore.getState().setUserInfo(userInfo);
        }
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

// Load user info from localStorage before rendering
loadUserInfoFromStorage();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
