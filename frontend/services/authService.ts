import {
  clearAuthToken,
  requestJson,
  storeAuthToken,
} from "@/services/apiClient";
import type { LoginResponse, RegisterInput, User } from "@/types/auth";

export function registerAccount(data: RegisterInput) {
  return requestJson<User>("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function loginAccount(email: string, password: string) {
  return requestJson<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function getCurrentUser() {
  return requestJson<User>("/auth/me", {}, { auth: true });
}

export function saveLogin(response: LoginResponse) {
  storeAuthToken(response.access_token, response.expires_in);
}

export function clearLogin() {
  clearAuthToken();
}
