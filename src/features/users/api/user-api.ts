import { baseApi } from "@/store/base-api-rtk";
import type { ApiResponse, PageData } from "@/types/api.types";
import { USER_ENDPOINTS } from "../constants/user.constants";
import type {
  UserResponse,
  UserDetailResponse,
  UserFilterParams,
  CreateUserPayload,
  UserRoleAssignmentResponse,
  AssignUserRolePayload,
  EffectivePermissionResponse,
} from "../types/user.types";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 1. Lấy danh sách người dùng có phân trang & tìm kiếm
    getUsers: builder.query<ApiResponse<PageData<UserResponse>>, UserFilterParams | void>({
      query: (params) => ({
        url: USER_ENDPOINTS.USERS,
        params: params || undefined,
      }),
      providesTags: (result) =>
        result?.data?.items
          ? [
              ...result.data.items.map(({ id }) => ({ type: "User" as const, id })),
              { type: "User", id: "LIST" },
            ]
          : [{ type: "User", id: "LIST" }],
    }),

    // 2. Lấy thông tin chi tiết người dùng
    getUserById: builder.query<ApiResponse<UserDetailResponse>, string>({
      query: (userId) => USER_ENDPOINTS.USER_BY_ID(userId),
      providesTags: (_result, _error, id) => [{ type: "User", id }],
    }),

    // 3. Tạo mới tài khoản người dùng
    createUser: builder.mutation<ApiResponse<UserDetailResponse>, CreateUserPayload>({
      query: (body) => ({
        url: USER_ENDPOINTS.USERS,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),

    // 4. Gửi lại email kích hoạt
    resendActivation: builder.mutation<ApiResponse<void>, string>({
      query: (userId) => ({
        url: USER_ENDPOINTS.RESEND_ACTIVATION(userId),
        method: "POST",
      }),
    }),

    // 5. Khóa tài khoản
    lockUser: builder.mutation<ApiResponse<void>, string>({
      query: (userId) => ({
        url: USER_ENDPOINTS.LOCK(userId),
        method: "POST",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "User", id },
        { type: "User", id: "LIST" },
      ],
    }),

    // 6. Mở khóa tài khoản
    unlockUser: builder.mutation<ApiResponse<void>, string>({
      query: (userId) => ({
        url: USER_ENDPOINTS.UNLOCK(userId),
        method: "POST",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "User", id },
        { type: "User", id: "LIST" },
      ],
    }),

    // 7. Lấy danh sách vai trò đã gán của người dùng
    getUserRoleAssignments: builder.query<ApiResponse<UserRoleAssignmentResponse[]>, string>({
      query: (userId) => USER_ENDPOINTS.ROLE_ASSIGNMENTS(userId),
      providesTags: (_result, _error, userId) => [{ type: "Role", id: `USER_${userId}` }],
    }),

    // 8. Gán vai trò cho người dùng tại một công ty
    assignUserRole: builder.mutation<
      ApiResponse<UserRoleAssignmentResponse>,
      { userId: string; body: AssignUserRolePayload }
    >({
      query: ({ userId, body }) => ({
        url: USER_ENDPOINTS.ROLE_ASSIGNMENTS(userId),
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, { userId }) => [
        { type: "Role", id: `USER_${userId}` },
        { type: "User", id: "LIST" },
      ],
    }),

    // 9. Thu hồi vai trò đã gán
    revokeUserRoleAssignment: builder.mutation<
      ApiResponse<void>,
      { assignmentId: string; userId: string }
    >({
      query: ({ assignmentId }) => ({
        url: USER_ENDPOINTS.REVOKE_ROLE_ASSIGNMENT(assignmentId),
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { userId }) => [
        { type: "Role", id: `USER_${userId}` },
        { type: "User", id: "LIST" },
      ],
    }),

    // 10. Tra cứu quyền hiệu lực của người dùng
    getEffectivePermissions: builder.query<
      ApiResponse<EffectivePermissionResponse[]>,
      { userId: string; companyId?: string }
    >({
      query: ({ userId, companyId }) => ({
        url: USER_ENDPOINTS.EFFECTIVE_PERMISSIONS(userId),
        params: companyId ? { companyId } : undefined,
      }),
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useResendActivationMutation,
  useLockUserMutation,
  useUnlockUserMutation,
  useGetUserRoleAssignmentsQuery,
  useAssignUserRoleMutation,
  useRevokeUserRoleAssignmentMutation,
  useGetEffectivePermissionsQuery,
} = userApi;

