/**
 * Cloudflare Pages Function to proxy image requests
 * This function proxies /media/* requests to the API server
 * to avoid CORS issues and enable proper caching
 */

// API 服务器地址（默认值）
const DEFAULT_API_BASE_URL = "https://api.mutopia.ca";

interface Env {
  API_BASE_URL?: string;
}

export async function onRequest(context: {
  request: Request;
  params: { path?: string[] };
  env: Env;
}): Promise<Response> {
  const { request, params, env } = context;
  
  // 处理 OPTIONS 请求（CORS preflight）
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Max-Age": "86400",
      },
    });
  }
  
  // 获取 API 基础 URL（优先使用环境变量）
  const apiBaseUrl = env.API_BASE_URL || DEFAULT_API_BASE_URL;
  
  // 构建目标 URL
  // 对于 catch-all 路由 [[path]]，params.path 是一个字符串数组
  const pathSegments = params.path || [];
  const path = pathSegments.length > 0 ? pathSegments.join("/") : "";
  
  // 构建完整的目标 URL
  // 如果 path 为空，则只使用 /media，否则使用 /media/{path}
  const mediaPath = path ? `/media/${path}` : "/media";
  const targetUrl = `${apiBaseUrl}${mediaPath}`;
  
  // 获取原始请求的查询参数
  const url = new URL(request.url);
  const searchParams = url.search;
  const fullTargetUrl = searchParams ? `${targetUrl}${searchParams}` : targetUrl;
  
  // 调试日志（仅在开发环境或需要时启用）
  // console.log(`[Media Proxy] Proxying ${request.method} ${request.url} -> ${fullTargetUrl}`);
  
  // 创建新的请求，保留原始请求的方法和头部
  const requestHeaders = new Headers();
  
  // 复制原始请求的头部，但移除可能导致问题的头部
  request.headers.forEach((value, key) => {
    const lowerKey = key.toLowerCase();
    // 移除可能导致问题的头部
    if (!["host", "connection", "cache-control", "pragma", "cf-"].some(prefix => lowerKey.startsWith(prefix))) {
      requestHeaders.set(key, value);
    }
  });
  
  const proxyRequest = new Request(fullTargetUrl, {
    method: request.method,
    headers: requestHeaders,
    body: request.method !== "GET" && request.method !== "HEAD" ? request.body : undefined,
  });
  
  try {
    // 转发请求到 API 服务器
    const response = await fetch(proxyRequest);
    
    // 创建响应，添加 CORS 头以支持跨域
    const headers = new Headers(response.headers);
    
    // 添加 CORS 头
    headers.set("Access-Control-Allow-Origin", "*");
    headers.set("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
    headers.set("Access-Control-Allow-Headers", "Content-Type");
    
    // 确保缓存头正确传递（服务器返回的缓存头会被保留）
    // 如果服务器没有返回缓存头，不添加默认值，让浏览器使用默认行为
    
    // 返回响应
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: headers,
    });
  } catch (error) {
    // 处理错误
    console.error("Proxy error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to proxy request", message: String(error) }),
      {
        status: 502,
        statusText: "Bad Gateway",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
}
