import { baseApi } from "@/store/base-api-rtk";
import type { ApiResponse } from "@/types/api.types";
import { AUTH_ENDPOINTS } from "../constants/auth.constants";
import type {
  LoginRequest,
  RefreshTokenRequest,
  AuthTokenResponse,
  UserProfileResponse,
  UpdateProfileRequest,
  ActivateAccountRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
} from "../types/auth.types";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<ApiResponse<AuthTokenResponse>, LoginRequest>({
      query: (credentials) => ({
        url: AUTH_ENDPOINTS.LOGIN,
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Auth"],
    }),

    getMe: builder.query<ApiResponse<UserProfileResponse>, void>({
      query: () => AUTH_ENDPOINTS.ME,
      providesTags: ["Auth", "User"],
    }),

    updateMe: builder.mutation<ApiResponse<UserProfileResponse>, UpdateProfileRequest>({
      query: (body) => ({
        url: AUTH_ENDPOINTS.ME,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Auth", "User"],
    }),

    refreshToken: builder.mutation<ApiResponse<AuthTokenResponse>, RefreshTokenRequest>({
      query: (body) => ({
        url: AUTH_ENDPOINTS.REFRESH,
        method: "POST",
        body,
      }),
    }),

    logout: builder.mutation<ApiResponse<void>, void>({
      query: () => ({
        url: AUTH_ENDPOINTS.LOGOUT,
        method: "POST",
      }),
      invalidatesTags: ["Auth", "User"],
    }),

    activateAccount: builder.mutation<ApiResponse<AuthTokenResponse>, ActivateAccountRequest>({
      query: (body) => ({
        url: AUTH_ENDPOINTS.ACTIVATE,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Auth", "User"],
    }),

    forgotPassword: builder.mutation<ApiResponse<void>, ForgotPasswordRequest>({
      query: (body) => ({
        url: AUTH_ENDPOINTS.FORGOT_PASSWORD,
        method: "POST",
        body,
      }),
    }),

    resetPassword: builder.mutation<ApiResponse<void>, ResetPasswordRequest>({
      query: (body) => ({
        url: AUTH_ENDPOINTS.RESET_PASSWORD,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Auth"],
    }),

    changePassword: builder.mutation<ApiResponse<void>, ChangePasswordRequest>({
      query: (body) => ({
        url: AUTH_ENDPOINTS.CHANGE_PASSWORD,
        method: "PUT",
        body,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useLoginMutation,
  useGetMeQuery,
  useLazyGetMeQuery,
  useUpdateMeMutation,
  useRefreshTokenMutation,
  useLogoutMutation,
  useActivateAccountMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
} = authApi;
