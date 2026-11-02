import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { env } from "@/config/env";
import { setTokens, logout } from "@/store/slices/auth.slice";
import { tokenStorage } from "@/lib/token-storage";
import { AUTH_ENDPOINTS } from "@/features/auth/constants/auth.constants";
import type { ApiResponse } from "@/types/api.types";
import type { AuthTokenResponse } from "@/features/auth/types/auth.types";
import type { RootState } from "@/store";

// ── Lightweight Async Mutex (chống race condition khi nhiều API 401 cùng lúc) ──
class SimpleMutex {
  private _isLocked = false;
  private _waiting: (() => void)[] = [];

  isLocked(): boolean {
    return this._isLocked;
  }

  acquire(): Promise<() => void> {
    return new Promise((resolve) => {
      const release = () => {
        if (this._waiting.length > 0) {
          const next = this._waiting.shift();
          next?.();
        } else {
          this._isLocked = false;
        }
      };

      if (this._isLocked) {
        this._waiting.push(() => resolve(release));
      } else {
        this._isLocked = true;
        resolve(release);
      }
    });
  }

  async waitForUnlock(): Promise<void> {
    if (!this._isLocked) return;
    return new Promise((resolve) => {
      this._waiting.push(resolve);
    });
  }
}

const mutex = new SimpleMutex();

// ── Base query: Gắn Bearer token & Multi-tenancy header ───────────────────────
const baseQuery = fetchBaseQuery({
  baseUrl: env.API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth.accessToken || tokenStorage.getAccessToken();

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    if (state.auth.currentCompanyId) {
      headers.set("X-Company-Id", state.auth.currentCompanyId);
    }

    return headers;
  },
});

// ── Re-auth wrapper: Tự động refresh token có Mutex bảo vệ ──────────────────
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // Lấy đường dẫn request để kiểm tra loại trừ
  const requestUrl = typeof args === "string" ? args : args.url;
  const isAuthAuthEndpoint =
    requestUrl.includes(AUTH_ENDPOINTS.LOGIN) ||
    requestUrl.includes(AUTH_ENDPOINTS.REFRESH) ||
    requestUrl.includes(AUTH_ENDPOINTS.ACTIVATE) ||
    requestUrl.includes(AUTH_ENDPOINTS.FORGOT_PASSWORD) ||
    requestUrl.includes(AUTH_ENDPOINTS.RESET_PASSWORD);

  // Nếu không phải auth endpoint, đợi mutex mở khóa trước khi gửi
  if (!isAuthAuthEndpoint) {
    await mutex.waitForUnlock();
  }

  let result = await baseQuery(args, api, extraOptions);

  // Chỉ kích hoạt refresh token khi gặp 401 trên các API nghiệp vụ thông thường
  if (result.error?.status === 401 && !isAuthAuthEndpoint) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();

      try {
        const state = api.getState() as RootState;
        const refreshToken =
          state.auth.refreshToken || tokenStorage.getRefreshToken();

        if (refreshToken) {
          const refreshResult = await baseQuery(
            {
              url: AUTH_ENDPOINTS.REFRESH,
              method: "POST",
              body: { refreshToken },
            },
            api,
            extraOptions
          );

          const payload = refreshResult.data as
            | ApiResponse<AuthTokenResponse>
            | undefined;

          if (payload?.success && payload.data?.accessToken) {
            api.dispatch(
              setTokens({
                accessToken: payload.data.accessToken,
                refreshToken: payload.data.refreshToken,
              })
            );

            // Retry lại request ban đầu với Access Token mới
            result = await baseQuery(args, api, extraOptions);
          } else {
            api.dispatch(logout());
          }
        } else {
          api.dispatch(logout());
        }
      } finally {
        release();
      }
    } else {
      // Đợi request refresh token đang chạy hoàn tất rồi retry
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }

  return result;
};

// ── Root API slice (Tất cả feature API inject vào đây) ───────────────────────
export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "Product",
    "Auth",
    "User",
    "Role",
    "Permission",
    "Company",
    "Region",
    "Branch",
    "CostCenter",
    "JobTitle",
    "JobLevel",
    "Department",
    "DepartmentTree",
  ],
  endpoints: () => ({}),
});
