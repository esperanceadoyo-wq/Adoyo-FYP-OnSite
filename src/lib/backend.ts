const DEFAULT_BACKEND_URL = "http://127.0.0.1:5001";

export function getBackendUrl() {
  return (process.env.BACKEND_API_URL || DEFAULT_BACKEND_URL).replace(/\/$/, "");
}

export async function proxyBackendRequest(
  path: string,
  init: RequestInit = {},
  request?: Request,
) {
  const headers = new Headers(init.headers);
  const cookie = request?.headers.get("cookie");

  if (cookie) {
    headers.set("cookie", cookie);
  }

  if (init.body && !headers.has("content-type")) {
    headers.set("content-type", "application/json");
  }

  const backendResponse = await fetch(`${getBackendUrl()}${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });

  const body = await backendResponse.text();
  const responseHeaders = new Headers({
    "content-type":
      backendResponse.headers.get("content-type") || "application/json",
  });
  const setCookie = backendResponse.headers.get("set-cookie");

  if (setCookie) {
    responseHeaders.set("set-cookie", setCookie);
  }

  return new Response(body, {
    headers: responseHeaders,
    status: backendResponse.status,
  });
}
