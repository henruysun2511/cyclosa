import type { AuthTokenResponse } from "@/features/auth/types/auth.types";
import {
  AUTH_STORAGE_KEYS,
  AUTH_COOKIE_EXPIRY,
} from "@/features/auth/constants/auth.constants";

// Helper ghi cookie
function setCookie(name: string, value: string, days = 7) {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

// Helper đọc cookie
function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(^|;\\s*)(${name})=([^;]*)`));
  return match && match[3] ? decodeURIComponent(match[3]) : null;
}

// Helper xóa cookie
function removeCookie(name: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
}

export interface StoredSession {
  accessToken: string | null;
  refreshToken: string | null;
  userId: string | null;
  email: string | null;
  roles: string[];
}

export const tokenStorage = {
  saveSession(authData: AuthTokenResponse) {
    if (typeof window === "undefined") return;

    // 1. Lưu Cookie để Next.js Server Components / Middleware đọc được
    setCookie(
      AUTH_STORAGE_KEYS.ACCESS_TOKEN,
      authData.accessToken,
      AUTH_COOKIE_EXPIRY.ACCESS_TOKEN_DAYS
    );
    setCookie(
      AUTH_STORAGE_KEYS.REFRESH_TOKEN,
      authData.refreshToken,
      AUTH_COOKIE_EXPIRY.REFRESH_TOKEN_DAYS
    );

    // 2. Lưu LocalStorage làm nguồn phụ trợ
    localStorage.setItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN, authData.accessToken);
    localStorage.setItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN, authData.refreshToken);
    localStorage.setItem(
      AUTH_STORAGE_KEYS.USER,
      JSON.stringify({
        userId: authData.userId,
        email: authData.email,
        roles: authData.roles,
      })
    );
  },

  updateTokens(accessToken: string, refreshToken?: string) {
    if (typeof window === "undefined") return;

    setCookie(
      AUTH_STORAGE_KEYS.ACCESS_TOKEN,
      accessToken,
      AUTH_COOKIE_EXPIRY.ACCESS_TOKEN_DAYS
    );
    localStorage.setItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN, accessToken);

    if (refreshToken) {
      setCookie(
        AUTH_STORAGE_KEYS.REFRESH_TOKEN,
        refreshToken,
        AUTH_COOKIE_EXPIRY.REFRESH_TOKEN_DAYS
      );
      localStorage.setItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    }
  },

  loadSession(): StoredSession {
    if (typeof window === "undefined") {
      return {
        accessToken: null,
        refreshToken: null,
        userId: null,
        email: null,
        roles: [],
      };
    }

    const accessToken =
      getCookie(AUTH_STORAGE_KEYS.ACCESS_TOKEN) ||
      localStorage.getItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN);
    const refreshToken =
      getCookie(AUTH_STORAGE_KEYS.REFRESH_TOKEN) ||
      localStorage.getItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN);

    let userId: string | null = null;
    let email: string | null = null;
    let roles: string[] = [];

    try {
      const rawUser = localStorage.getItem(AUTH_STORAGE_KEYS.USER);
      if (rawUser) {
        const parsed = JSON.parse(rawUser);
        userId = parsed.userId ?? null;
        email = parsed.email ?? null;
        roles = Array.isArray(parsed.roles) ? parsed.roles : [];
      }
    } catch {
      // Ignored
    }

    return {
      accessToken,
      refreshToken,
      userId,
      email,
      roles,
    };
  },

  clearSession() {
    if (typeof window === "undefined") return;

    removeCookie(AUTH_STORAGE_KEYS.ACCESS_TOKEN);
    removeCookie(AUTH_STORAGE_KEYS.REFRESH_TOKEN);

    localStorage.removeItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(AUTH_STORAGE_KEYS.USER);
  },

  getAccessToken(): string | null {
    if (typeof window === "undefined") return null;
    return (
      getCookie(AUTH_STORAGE_KEYS.ACCESS_TOKEN) ||
      localStorage.getItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN)
    );
  },

  getRefreshToken(): string | null {
    if (typeof window === "undefined") return null;
    return (
      getCookie(AUTH_STORAGE_KEYS.REFRESH_TOKEN) ||
      localStorage.getItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN)
    );
  },
};
