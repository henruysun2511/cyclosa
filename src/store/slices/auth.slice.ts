import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  AuthTokenResponse,
  UserProfileResponse,
} from "@/features/auth/types/auth.types";
import type { DataScope } from "@/features/authorization/constants/permission.constants";
import { tokenStorage } from "@/lib/token-storage";

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  roles: string[];
  permissions?: string[];
  dataScopes?: Partial<Record<string, DataScope>>;
  status?: string;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  currentCompanyId: string | null;
}

// Đọc session lưu trữ phía client (nếu có)
const stored = tokenStorage.loadSession();

const initialState: AuthState = {
  user:
    stored.userId && stored.email
      ? {
          id: stored.userId,
          email: stored.email,
          roles: stored.roles,
        }
      : null,
  isAuthenticated: Boolean(stored.accessToken),
  isInitialized: false, // Bắt đầu là false, sẽ chuyển true sau khi AuthInitializer chạy xong
  accessToken: stored.accessToken,
  refreshToken: stored.refreshToken,
  currentCompanyId: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setInitialized(state, action: PayloadAction<boolean>) {
      state.isInitialized = action.payload;
    },

    setCredentials(state, action: PayloadAction<AuthTokenResponse>) {
      const data = action.payload;
      state.user = {
        id: data.userId,
        email: data.email,
        roles: data.roles || [],
      };
      state.isAuthenticated = true;
      state.isInitialized = true;
      state.accessToken = data.accessToken;
      state.refreshToken = data.refreshToken;

      tokenStorage.saveSession(data);
    },

    setUserProfile(state, action: PayloadAction<UserProfileResponse>) {
      const profile = action.payload;
      if (state.user) {
        state.user.id = profile.id;
        state.user.email = profile.email;
        state.user.roles = profile.roles || [];
        state.user.status = profile.status;
      } else {
        state.user = {
          id: profile.id,
          email: profile.email,
          roles: profile.roles || [],
          status: profile.status,
        };
      }
      state.isAuthenticated = true;
      state.isInitialized = true;
    },

    setTokens(
      state,
      action: PayloadAction<{ accessToken: string; refreshToken?: string }>
    ) {
      state.accessToken = action.payload.accessToken;
      if (action.payload.refreshToken) {
        state.refreshToken = action.payload.refreshToken;
      }
      state.isAuthenticated = true;

      tokenStorage.updateTokens(
        action.payload.accessToken,
        action.payload.refreshToken
      );
    },

    setCurrentCompanyId(state, action: PayloadAction<string | null>) {
      state.currentCompanyId = action.payload;
    },

    setPermissions(state, action: PayloadAction<string[]>) {
      if (state.user) {
        state.user.permissions = action.payload;
      }
    },

    setUserAuthorization(
      state,
      action: PayloadAction<{
        permissions: string[];
        dataScopes?: Partial<Record<string, DataScope>>;
      }>
    ) {
      if (state.user) {
        state.user.permissions = action.payload.permissions;
        if (action.payload.dataScopes) {
          state.user.dataScopes = action.payload.dataScopes;
        }
      }
    },

    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.isInitialized = true;
      state.accessToken = null;
      state.refreshToken = null;
      state.currentCompanyId = null;

      tokenStorage.clearSession();
    },

    updateUser(state, action: PayloadAction<Partial<AuthUser>>) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
});

export const {
  setInitialized,
  setCredentials,
  setUserProfile,
  setTokens,
  setCurrentCompanyId,
  setPermissions,
  setUserAuthorization,
  logout,
  updateUser,
} = authSlice.actions;
