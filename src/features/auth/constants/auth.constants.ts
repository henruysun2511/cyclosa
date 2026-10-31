export const AUTH_STORAGE_KEYS = {
  ACCESS_TOKEN: "cyclosa_access_token",
  REFRESH_TOKEN: "cyclosa_refresh_token",
  USER: "cyclosa_auth_user",
  REMEMBER_ACCOUNT: "cyclosa_remember_account",
} as const;

export const AUTH_COOKIE_EXPIRY = {
  ACCESS_TOKEN_DAYS: 1,
  REFRESH_TOKEN_DAYS: 7,
} as const;

export const AUTH_ROUTES = {
  LOGIN: "/login",
  DEFAULT_AFTER_LOGIN: "/products",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  ACTIVATE: "/activate",
} as const;

export const AUTH_ENDPOINTS = {
  LOGIN: "/auth/login",
  REFRESH: "/auth/refresh",
  LOGOUT: "/auth/logout",
  ME: "/auth/me",
  ACTIVATE: "/auth/activate",
  FORGOT_PASSWORD: "/auth/forgot-password",
  RESET_PASSWORD: "/auth/reset-password",
  CHANGE_PASSWORD: "/auth/change-password",
} as const;

export const USER_STATUS_LABELS = {
  ACTIVE: "Đang hoạt động",
  PENDING_ACTIVATION: "Chờ kích hoạt",
  LOCKED: "Đã khóa",
  DEACTIVATED: "Đã hủy kích hoạt",
} as const;

export const USER_STATUS_VARIANTS = {
  ACTIVE: "default",
  PENDING_ACTIVATION: "outline",
  LOCKED: "destructive",
  DEACTIVATED: "secondary",
} as const;
