/**
 * Google OAuth 认证工具
 * 
 * 使用 Google Identity Services (GIS) 进行 OAuth 认证
 * 参考: https://developers.google.com/identity/gsi/web
 */

import { thirdPartyConfig } from "./env";


/**
 * Google 凭据响应
 */
export interface GoogleCredentialResponse {
  credential: string; // JWT ID token
  select_by: string;
}

/**
 * Google 错误响应
 */
export interface GoogleErrorResponse {
  type: string;
  message: string;
}

/**
 * 检查 Google OAuth 脚本是否已加载
 */
function isGoogleScriptLoaded(): boolean {
  return typeof window !== "undefined" && "google" in window && "accounts" in (window as any).google;
}

/**
 * 加载 Google Identity Services 脚本
 */
export function loadGoogleScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (isGoogleScriptLoaded()) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      // 等待一小段时间确保 Google 对象完全初始化
      setTimeout(() => {
        if (isGoogleScriptLoaded()) {
          resolve();
        } else {
          reject(new Error("Google Identity Services script loaded but not initialized"));
        }
      }, 100);
    };
    script.onerror = () => {
      reject(new Error("Failed to load Google Identity Services script"));
    };
    document.head.appendChild(script);
  });
}

/**
 * 初始化 Google OAuth
 */
export async function initializeGoogleAuth(
  callback: (response: GoogleCredentialResponse) => void,
  _errorCallback?: (error: GoogleErrorResponse) => void
): Promise<void> {
  const clientId = thirdPartyConfig.googleClientId;
  
  if (!clientId) {
    throw new Error("Google Client ID is not configured. Please set VITE_GOOGLE_CLIENT_ID environment variable.");
  }

  // 加载 Google 脚本
  await loadGoogleScript();

  // 初始化 Google Identity Services
  if (!isGoogleScriptLoaded()) {
    throw new Error("Google Identity Services is not available");
  }

  const google = (window as any).google;
  
  // 获取当前页面的 origin（用于调试）
  const currentOrigin = window.location.origin;
  console.log("[Google Auth] Initializing with Client ID:", clientId);
  console.log("[Google Auth] Current origin:", currentOrigin);
  
  try {
    google.accounts.id.initialize({
      client_id: clientId,
      callback: callback,
      auto_select: false,
      cancel_on_tap_outside: true,
      // 启用 FedCM 以消除警告并确保未来兼容性
      use_fedcm_for_prompt: true,
      // 注意：Google Identity Services 默认会请求 OpenID Connect 的基本信息，包括 email
      // ID token 中会包含 email 字段（如果用户授权）
    });
    console.log("[Google Auth] Initialized successfully with FedCM enabled");
  } catch (error) {
    console.error("[Google Auth] Initialization error:", error);
    throw error;
  }
}

/**
 * 触发 Google 登录弹窗
 * 注意：此方法已更新以兼容 FedCM
 * 建议使用 renderButton 方法而不是 prompt，以获得更好的 FedCM 兼容性
 */
export function promptGoogleLogin(): void {
  if (!isGoogleScriptLoaded()) {
    throw new Error("Google Identity Services is not loaded. Call initializeGoogleAuth first.");
  }

  const google = (window as any).google;
  
  // 使用 FedCM 兼容的方式处理通知
  // 注意：即使启用了 use_fedcm_for_prompts，仍然建议使用 renderButton 而不是 prompt
  google.accounts.id.prompt((notification: any) => {
    // FedCM 兼容：使用 getNotDisplayedReason 和 getSkippedReason 替代旧方法
    // 这些方法在 FedCM 模式下可用
    if (typeof notification.getNotDisplayedReason === "function") {
      const notDisplayedReason = notification.getNotDisplayedReason();
      if (notDisplayedReason) {
        console.log("[Google Auth] Prompt not displayed:", notDisplayedReason);
      }
    }
    
    if (typeof notification.getSkippedReason === "function") {
      const skippedReason = notification.getSkippedReason();
      if (skippedReason) {
        console.log("[Google Auth] Prompt skipped:", skippedReason);
      }
    }
    
    // 注意：不再使用已弃用的 isNotDisplayed() 和 isSkippedMoment() 方法
  });
}

/**
 * 使用 One Tap 登录（自动弹出）
 */
export function renderGoogleButton(
  elementId: string,
  _callback: (response: GoogleCredentialResponse) => void,
  _errorCallback?: (error: GoogleErrorResponse) => void
): void {
  if (!isGoogleScriptLoaded()) {
    throw new Error("Google Identity Services is not loaded. Call initializeGoogleAuth first.");
  }

  const google = (window as any).google;
  const clientId = thirdPartyConfig.googleClientId;

  if (!clientId) {
    throw new Error("Google Client ID is not configured");
  }

  google.accounts.id.renderButton(
    document.getElementById(elementId),
    {
      type: "standard",
      theme: "outline",
      size: "large",
      text: "signin_with",
      shape: "rectangular",
      logo_alignment: "left",
    }
  );
}

/**
 * 解码 Google ID Token 获取用户信息
 */
export function decodeGoogleIdToken(idToken: string): {
  sub: string; // Google user ID
  email: string;
  email_verified: boolean;
  name?: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
  birthdate?: string; // Format: YYYY-MM-DD (if available)
} {
  try {
    // JWT token 格式: header.payload.signature
    const parts = idToken.split(".");
    if (parts.length !== 3) {
      throw new Error("Invalid ID token format");
    }

    // 解码 payload (base64url)
    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decoded);
  } catch (error) {
    throw new Error(`Failed to decode Google ID token: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}
