/**
 * Facebook OAuth 认证工具
 * 
 * 使用 Facebook JavaScript SDK 进行 OAuth 认证
 * 参考: https://developers.facebook.com/docs/facebook-login/web
 */

import { thirdPartyConfig } from "./env";

/**
 * Facebook 登录响应
 */
export interface FacebookAuthResponse {
  authResponse: {
    accessToken: string;
    expiresIn: number;
    signedRequest: string;
    userID: string;
  };
  status: "connected" | "not_authorized" | "unknown";
}

/**
 * Facebook 用户信息
 */
export interface FacebookUserInfo {
  id: string;
  name: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  birthday?: string; // Format: MM/DD/YYYY or YYYY-MM-DD
  picture?: {
    data: {
      url: string;
    };
  };
}

/**
 * 检查 Facebook SDK 是否已加载
 */
function isFacebookSDKLoaded(): boolean {
  return typeof window !== "undefined" && "FB" in window;
}

/**
 * 加载 Facebook SDK 脚本
 */
export function loadFacebookScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (isFacebookSDKLoaded()) {
      resolve();
      return;
    }

    const appId = thirdPartyConfig.facebookAppId;
    if (!appId) {
      reject(new Error("Facebook App ID is not configured. Please set VITE_FACEBOOK_APP_ID environment variable."));
      return;
    }

    // 创建 script 标签加载 Facebook SDK
    const script = document.createElement("script");
    script.src = "https://connect.facebook.net/en_US/sdk.js";
    script.async = true;
    script.defer = true;
    script.crossOrigin = "anonymous";
    
    script.onload = () => {
      // 等待一小段时间确保 FB 对象完全初始化
      setTimeout(() => {
        if (isFacebookSDKLoaded()) {
          resolve();
        } else {
          reject(new Error("Facebook SDK script loaded but not initialized"));
        }
      }, 100);
    };
    
    script.onerror = () => {
      reject(new Error("Failed to load Facebook SDK script"));
    };
    
    document.head.appendChild(script);
  });
}

/**
 * 初始化 Facebook SDK
 */
export async function initializeFacebookAuth(): Promise<void> {
  const appId = thirdPartyConfig.facebookAppId;
  
  if (!appId) {
    throw new Error("Facebook App ID is not configured. Please set VITE_FACEBOOK_APP_ID environment variable.");
  }

  // 加载 Facebook SDK 脚本
  await loadFacebookScript();

  // 初始化 Facebook SDK
  if (!isFacebookSDKLoaded()) {
    throw new Error("Facebook SDK is not available");
  }

  const FB = (window as any).FB;
  
  FB.init({
    appId: appId,
    cookie: true,
    xfbml: true,
    version: "v18.0", // 使用最新的 API 版本
  });

  console.log("[Facebook Auth] Initialized successfully");
}

/**
 * 获取 Facebook 登录状态
 */
export function getFacebookLoginStatus(): Promise<FacebookAuthResponse | null> {
  return new Promise((resolve) => {
    if (!isFacebookSDKLoaded()) {
      resolve(null);
      return;
    }

    const FB = (window as any).FB;
    FB.getLoginStatus((response: FacebookAuthResponse) => {
      resolve(response);
    });
  });
}

/**
 * 触发 Facebook 登录
 */
export function loginWithFacebook(): Promise<FacebookAuthResponse> {
  return new Promise((resolve, reject) => {
    if (!isFacebookSDKLoaded()) {
      reject(new Error("Facebook SDK is not loaded. Call initializeFacebookAuth first."));
      return;
    }

    const FB = (window as any).FB;
    
    FB.login(
      (response: FacebookAuthResponse) => {
        if (response.status === "connected") {
          resolve(response);
        } else if (response.status === "not_authorized") {
          // 应用未激活或用户未授权
          reject(new Error("App not active. Please check Facebook app settings or contact support."));
        } else {
          // 用户取消登录或其他错误
          reject(new Error("Facebook login was cancelled or failed."));
        }
      },
      {
        scope: "email,public_profile,user_birthday", // 请求的权限（包括生日）
      }
    );
  });
}

/**
 * 获取 Facebook 用户信息
 */
export function getFacebookUserInfo(accessToken: string): Promise<FacebookUserInfo> {
  return new Promise((resolve, reject) => {
    if (!isFacebookSDKLoaded()) {
      reject(new Error("Facebook SDK is not loaded."));
      return;
    }

    const FB = (window as any).FB;
    
    FB.api(
      "/me",
      {
        fields: "id,name,email,first_name,last_name,birthday,picture",
        access_token: accessToken,
      },
      (response: FacebookUserInfo | { error?: { message: string } }) => {
        if ((response as any).error) {
          reject(new Error((response as any).error.message || "Failed to get Facebook user info"));
        } else {
          resolve(response as FacebookUserInfo);
        }
      }
    );
  });
}

/**
 * 登出 Facebook
 */
export function logoutFromFacebook(): Promise<void> {
  return new Promise((resolve) => {
    if (!isFacebookSDKLoaded()) {
      resolve();
      return;
    }

    const FB = (window as any).FB;
    FB.logout(() => {
      resolve();
    });
  });
}

