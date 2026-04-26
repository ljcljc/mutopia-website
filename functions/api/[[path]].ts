/**
 * Cloudflare Pages Function to proxy API requests.
 *
 * Production builds call /api/* on the same origin. This function forwards
 * those requests to the upstream API server so browsers do not make a
 * cross-origin request to api.mutopia.ca.
 */

const DEFAULT_API_BASE_URL = "https://api.mutopia.ca";

interface Env {
  API_BASE_URL?: string;
}

const HOP_BY_HOP_HEADERS = new Set([
  "connection",
  "host",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
]);

function getCorsHeaders(request: Request): Record<string, string> {
  const origin = request.headers.get("Origin");

  return {
    "Access-Control-Allow-Origin": origin || "*",
    "Access-Control-Allow-Methods": "GET, HEAD, POST, PUT, PATCH, DELETE, OPTIONS",
    "Access-Control-Allow-Headers":
      request.headers.get("Access-Control-Request-Headers") ||
      "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin, Access-Control-Request-Headers",
  };
}

function copyProxyHeaders(headers: Headers): Headers {
  const proxyHeaders = new Headers();

  headers.forEach((value, key) => {
    if (!HOP_BY_HOP_HEADERS.has(key.toLowerCase())) {
      proxyHeaders.set(key, value);
    }
  });

  return proxyHeaders;
}

export async function onRequest(context: {
  request: Request;
  params: { path?: string[] };
  env: Env;
}): Promise<Response> {
  const { request, params, env } = context;

  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: getCorsHeaders(request),
    });
  }

  const apiBaseUrl = env.API_BASE_URL || DEFAULT_API_BASE_URL;
  const path = params.path?.join("/") || "";
  const requestUrl = new URL(request.url);
  const targetUrl = new URL(`/api/${path}${requestUrl.search}`, apiBaseUrl);

  const proxyRequest = new Request(targetUrl, {
    method: request.method,
    headers: copyProxyHeaders(request.headers),
    body:
      request.method === "GET" || request.method === "HEAD"
        ? undefined
        : request.body,
  });

  try {
    const response = await fetch(proxyRequest);
    const responseHeaders = copyProxyHeaders(response.headers);
    const corsHeaders = getCorsHeaders(request);

    Object.entries(corsHeaders).forEach(([key, value]) => {
      responseHeaders.set(key, value);
    });

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("API proxy error:", error);

    return new Response(
      JSON.stringify({
        error: "Failed to proxy API request",
        message: String(error),
      }),
      {
        status: 502,
        statusText: "Bad Gateway",
        headers: {
          "Content-Type": "application/json",
          ...getCorsHeaders(request),
        },
      }
    );
  }
}
