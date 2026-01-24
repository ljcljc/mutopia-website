// HTTP client utility - 封装的 fetch 请求工具

/// <reference lib="dom" />

import {
  saveEncryptedItem,
  getEncryptedItem,
  removeEncryptedItem,
} from "./encryption";
import { STORAGE_KEYS } from "./storageKeys";
import { useAuthStore } from "@/components/auth/authStore";

// 在开发环境使用代理路径，生产环境使用相对路径（通过 Cloudflare Workers 代理）
// 如果部署在 Cloudflare Pages，默认使用相对路径，通过 Worker 代理解决 CORS
// 如果需要直接调用 API，设置 VITE_API_BASE_URL 环境变量
const API_BASE_URL = import.meta.env.DEV
  ? "" // 开发环境使用相对路径，通过 Vite 代理
  : import.meta.env.VITE_API_BASE_URL || ""; // 生产环境默认使用相对路径（通过 Worker 代理）
const DEBUG = import.meta.env.VITE_DEBUG === "true" || import.meta.env.DEV;

// Debug logger helper
const debugLog = (...args: unknown[]): void => {
  if (DEBUG) {
    console.log("[HTTP Debug]", ...args);
  }
};

// 请求配置接口
export interface RequestConfig extends globalThis.RequestInit {
  timeout?: number; // 超时时间（毫秒）
  retry?: number; // 重试次数
  retryDelay?: number; // 重试延迟（毫秒）
  skipAuth?: boolean; // 跳过认证（用于登录等接口）
}

// 响应接口
export interface HttpResponse<T = unknown> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
}

// HTTP 错误类
export class HttpError extends Error {
  status: number;
  statusText: string;
  data?: unknown;

  constructor(
    message: string,
    status: number,
    statusText: string,
    data?: unknown
  ) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.statusText = statusText;
    this.data = data;
  }
}

// 获取认证 token（从 localStorage 或其他存储，已加密）
export const getAuthToken = async (): Promise<string | null> => {
  try {
    return await getEncryptedItem(STORAGE_KEYS.ACCESS_TOKEN);
  } catch {
    return null;
  }
};

// 设置认证 token（加密存储）
export const setAuthToken = async (token: string | null): Promise<void> => {
  try {
    if (token) {
      await saveEncryptedItem(STORAGE_KEYS.ACCESS_TOKEN, token);
    } else {
      removeEncryptedItem(STORAGE_KEYS.ACCESS_TOKEN);
    }
  } catch (error) {
    console.warn("Failed to set auth token:", error);
  }
};

// 获取刷新 token（用于 token 刷新功能，已加密）
export const getRefreshToken = async (): Promise<string | null> => {
  try {
    return await getEncryptedItem(STORAGE_KEYS.REFRESH_TOKEN);
  } catch {
    return null;
  }
};

// 设置刷新 token（加密存储）
export const setRefreshToken = async (token: string | null): Promise<void> => {
  try {
    if (token) {
      await saveEncryptedItem(STORAGE_KEYS.REFRESH_TOKEN, token);
    } else {
      removeEncryptedItem(STORAGE_KEYS.REFRESH_TOKEN);
    }
  } catch (error) {
    console.warn("Failed to set refresh token:", error);
  }
};

// 清除所有 tokens
export const clearAuthTokens = async (): Promise<void> => {
  await setAuthToken(null);
  await setRefreshToken(null);
};

// 解析响应数据
type ParsedResponse = unknown | string | Blob | null;

const parseResponse = async (response: Response): Promise<ParsedResponse> => {
  const contentType = response.headers.get("content-type");

  if (contentType?.includes("application/json")) {
    try {
      return (await response.json()) as unknown;
    } catch (error) {
      debugLog("Failed to parse JSON response:", error);
      return null;
    }
  }

  if (contentType?.includes("text/")) {
    return await response.text();
  }

  // 对于其他类型，返回 blob
  return await response.blob();
};

// 错误响应数据接口
interface ErrorResponseData {
  detail?: string;
  message?: string;
  error?: string;
  [key: string]: unknown;
}

// 处理错误响应
const handleErrorResponse = async (response: Response): Promise<HttpError> => {
  let errorMessage = `API error: ${response.status} ${response.statusText}`;
  let errorData: unknown = null;

  try {
    const parsed = await parseResponse(response);
    if (parsed && typeof parsed === "object") {
      errorData = parsed;
      const errorObj = parsed as ErrorResponseData;
      // 优先使用 error 字段，然后是 detail，最后是 message
      if (errorObj.error || errorObj.detail || errorObj.message) {
        errorMessage = errorObj.error || errorObj.detail || errorObj.message || errorMessage;
      }
    }
  } catch {
    // 如果无法解析错误响应，使用默认消息
  }

  return new HttpError(
    errorMessage,
    response.status,
    response.statusText,
    errorData
  );
};

// 核心请求函数
const request = async <T = unknown>(
  url: string,
  config: RequestConfig = {}
): Promise<HttpResponse<T>> => {
  const {
    timeout = 30000, // 默认 30 秒超时
    retry = 0, // 默认不重试
    retryDelay = 1000, // 默认重试延迟 1 秒
    skipAuth = false,
    headers = {},
    ...fetchConfig
  } = config;

  // 构建完整 URL
  const fullUrl = url.startsWith("http") ? url : `${API_BASE_URL}${url}`;

  // 构建基础请求头（不包含 token，token 在 makeRequest 中动态获取）
  const baseHeaders: Record<string, string> = {
    ...(headers as Record<string, string>),
  };

  // 如果不是 FormData，默认设置 Content-Type 为 application/json
  if (!(fetchConfig.body instanceof FormData)) {
    if (!baseHeaders["Content-Type"]) {
      baseHeaders["Content-Type"] = "application/json";
    }
  } else {
    // FormData 会自动设置 Content-Type 和 boundary，不要手动设置
    delete baseHeaders["Content-Type"];
  }

  // 请求函数
  const makeRequest = async (): Promise<Response> => {
    // 动态构建请求头，每次都获取最新的 token
    const requestHeaders: Record<string, string> = { ...baseHeaders };
    
    // 动态添加认证 token（如果需要）
    if (!skipAuth) {
      const token = await getAuthToken();
      if (token) {
        requestHeaders["Authorization"] = `Bearer ${token}`;
      }
    }

    debugLog("Request:", {
      method: config.method || "GET",
      url: fullUrl,
      headers: requestHeaders,
      body: fetchConfig.body,
    });

    // 在生产环境也记录关键请求信息（用于调试连接问题）
    if (import.meta.env.PROD && url.includes("/api/auth/social/login")) {
      console.log("[HTTP] Social login request:", {
        method: config.method || "GET",
        url: fullUrl,
        hasBody: !!fetchConfig.body,
      });
    }

    const controller = new AbortController();
    const timeoutId =
      timeout > 0 ? setTimeout(() => controller.abort(), timeout) : null;

    try {
      const response = await fetch(fullUrl, {
        ...fetchConfig,
        headers: requestHeaders,
        signal: controller.signal,
      });

      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      return response;
    } catch (error) {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      // 处理超时错误
      if (error instanceof Error && error.name === "AbortError") {
        throw new HttpError(
          `Request timeout after ${timeout}ms`,
          408,
          "Request Timeout"
        );
      }

      // 处理网络错误
      if (error instanceof TypeError) {
        // 检查是否是连接关闭错误
        const errorMessage = error.message.toLowerCase();
        if (
          errorMessage.includes("fetch") ||
          errorMessage.includes("failed to fetch") ||
          errorMessage.includes("networkerror") ||
          errorMessage.includes("connection")
        ) {
          throw new HttpError(
            "Network error: Unable to connect to the server. Please check your internet connection and try again.",
            0,
            "Network Error"
          );
        }
      }

      // 处理其他类型的网络错误（如连接被关闭）
      if (error instanceof Error) {
        const errorMessage = error.message.toLowerCase();
        if (
          errorMessage.includes("connection") ||
          errorMessage.includes("closed") ||
          errorMessage.includes("aborted")
        ) {
          throw new HttpError(
            "Connection error: The server closed the connection. Please try again.",
            0,
            "Connection Error"
          );
        }
      }

      throw error;
    }
  };

  // 重试逻辑
  let lastError: unknown;
  for (let attempt = 0; attempt <= retry; attempt++) {
    try {
      if (attempt > 0) {
        debugLog(`Retrying request (attempt ${attempt}/${retry})...`);
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
      }

      const response = await makeRequest();

      debugLog("Response:", {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
      });

      // 处理 HTTP 错误状态
      if (!response.ok) {
        const error = await handleErrorResponse(response);

        // 401 未授权 - 尝试刷新 token
        if (response.status === 401 && !skipAuth && attempt === 0) {
          debugLog("Unauthorized, attempting token refresh...");
          try {
            const refreshed = await refreshAccessToken();
            if (refreshed) {
              debugLog("Token refreshed successfully, retrying request...");
              // 重试请求（不增加 attempt 计数，因为这是 token 刷新后的重试）
              const retryResponse = await makeRequest();
              if (!retryResponse.ok) {
                throw await handleErrorResponse(retryResponse);
              }
              // 解析重试后的响应
              const retryData = await parseResponse(retryResponse);
              debugLog("Response data (after token refresh):", retryData);
              return {
                data: retryData as T,
                status: retryResponse.status,
                statusText: retryResponse.statusText,
                headers: retryResponse.headers,
              };
            } else {
              // 没有 refresh token 或刷新失败，主动退出登录
              debugLog("No refresh token or refresh failed, logging out...");
              await performLogout();
              throw new HttpError(
                "Session expired. Please login again.",
                401,
                "Unauthorized"
              );
            }
          } catch (refreshError) {
            debugLog("Token refresh failed:", refreshError);
            // Token 刷新失败，主动退出登录
            await performLogout();
            throw new HttpError(
              "Session expired. Please login again.",
              401,
              "Unauthorized"
            );
          }
        }

        throw error;
      }

      // 解析成功响应
      const data = await parseResponse(response);
      debugLog("Response data:", data);

      return {
        data: data as T,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      };
    } catch (error) {
      lastError = error;

      // 如果是网络错误或超时，可以重试
      if (
        error instanceof HttpError &&
        (error.status === 0 || error.status === 408) &&
        attempt < retry
      ) {
        debugLog(`Request failed, will retry:`, error.message);
        continue;
      }

      // 其他错误直接抛出
      throw error;
    }
  }

  // 所有重试都失败
  throw lastError;
};

// HTTP 方法封装
export const http = {
  /**
   * GET 请求
   */
  get: <T = unknown>(
    url: string,
    config?: RequestConfig
  ): Promise<HttpResponse<T>> => {
    return request<T>(url, { ...config, method: "GET" });
  },

  /**
   * POST 请求
   */
  post: <T = unknown>(
    url: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<HttpResponse<T>> => {
    // 如果是 FormData，直接使用；否则序列化为 JSON
    const body = data instanceof FormData ? data : (data ? JSON.stringify(data) : undefined);
    return request<T>(url, {
      ...config,
      method: "POST",
      body,
    });
  },

  /**
   * PUT 请求
   */
  put: <T = unknown>(
    url: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<HttpResponse<T>> => {
    return request<T>(url, {
      ...config,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  /**
   * PATCH 请求
   */
  patch: <T = unknown>(
    url: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<HttpResponse<T>> => {
    return request<T>(url, {
      ...config,
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  /**
   * DELETE 请求
   */
  delete: <T = unknown>(
    url: string,
    config?: RequestConfig
  ): Promise<HttpResponse<T>> => {
    return request<T>(url, { ...config, method: "DELETE" });
  },

  /**
   * 通用请求方法
   */
  request: <T = unknown>(
    url: string,
    config?: RequestConfig
  ): Promise<HttpResponse<T>> => {
    return request<T>(url, config);
  },
};

// 执行退出登录操作
const performLogout = async (): Promise<void> => {
  try {
    // 清除所有 token
    await clearAuthTokens();
    
    // 清除用户状态（通过 Zustand store，可以在非 React 组件中使用）
    await useAuthStore.getState().logout();
    
    // 导航到首页（使用 window.location 强制刷新页面）
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  } catch (error) {
    debugLog("Error during logout:", error);
    // 即使出错也尝试清除 token 和跳转
    await clearAuthTokens();
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  }
};

// Token 刷新函数
let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

/**
 * 刷新访问令牌
 * @returns Promise<boolean> 是否刷新成功
 */
const refreshAccessToken = async (): Promise<boolean> => {
  // 如果正在刷新，等待当前刷新完成
  if (isRefreshing && refreshPromise) {
    return await refreshPromise;
  }

  const refreshToken = await getRefreshToken();
  if (!refreshToken) {
    debugLog("No refresh token available");
    // 没有 refresh token，直接返回 false，由调用方处理退出登录
    return false;
  }

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      debugLog("Refreshing access token...");

      const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (!response.ok) {
        debugLog("Token refresh failed:", response.status, response.statusText);
        clearAuthTokens();
        return false;
      }

      interface TokenRefreshResponse {
        access: string;
        refresh: string;
      }

      const data = (await response.json()) as TokenRefreshResponse;

      if (data.access && data.refresh) {
        await setAuthToken(data.access);
        await setRefreshToken(data.refresh);
        debugLog("Token refreshed successfully");
        return true;
      }

      debugLog("Invalid token refresh response");
      clearAuthTokens();
      return false;
    } catch (error) {
      debugLog("Token refresh error:", error);
      clearAuthTokens();
      return false;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return await refreshPromise;
};

// 导出 token 刷新函数（供外部使用）
export { refreshAccessToken };
