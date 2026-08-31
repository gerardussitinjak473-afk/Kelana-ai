const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"
).replace(/\/$/, "");

const TOKEN_KEY = "kelana_access_token";
const TOKEN_COOKIE = "kelana_token";
export const AUTH_CHANGED_EVENT = "kelana-auth-changed";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export function getAuthToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function hasAuthToken() {
  return Boolean(getAuthToken());
}

export function storeAuthToken(token: string, expiresIn: number) {
  window.localStorage.setItem(TOKEN_KEY, token);
  document.cookie = `${TOKEN_COOKIE}=${encodeURIComponent(token)}; Path=/; Max-Age=${expiresIn}; SameSite=Lax`;
  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
}

export function clearAuthToken() {
  if (typeof window !== "undefined") {
    const hadToken = Boolean(window.localStorage.getItem(TOKEN_KEY));
    window.localStorage.removeItem(TOKEN_KEY);
    document.cookie = `${TOKEN_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
    if (hadToken) window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
  }
}

type RequestOptions = {
  auth?: boolean;
};

export async function requestJson<T>(
  path: string,
  init: RequestInit = {},
  options: RequestOptions = {},
): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (options.auth) {
    const token = getAuthToken();
    if (!token) {
      throw new ApiError("Silakan login untuk melanjutkan.", 401);
    }
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    cache: "no-store",
    headers,
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    if (response.status === 401 && options.auth) clearAuthToken();
    throw new ApiError(
      payload?.detail || `Request failed (${response.status})`,
      response.status,
    );
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}
