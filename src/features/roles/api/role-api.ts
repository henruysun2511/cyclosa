import { baseApi } from "@/store/base-api-rtk";
import type { ApiResponse, PageData } from "@/types/api.types";
import { ROLE_ENDPOINTS } from "../constants/role.constants";
import type {
  RoleResponse,
  RoleDetailResponse,
  RolePermissionResponse,
  PermissionResponse,
  GroupedPermissionsResponse,
  RoleFilterParams,
  CreateRoleRequest,
  UpdateRoleRequest,
  AssignRolePermissionsRequest,
} from "../types/role.types";

export const roleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 1. Lấy danh sách vai trò có phân trang & tìm kiếm
    getRoles: builder.query<ApiResponse<PageData<RoleResponse>>, RoleFilterParams | void>({
      query: (params) => ({
        url: ROLE_ENDPOINTS.ROLES,
        params: params || undefined,
      }),
      providesTags: (result) =>
        result?.data?.items
          ? [
              ...result.data.items.map(({ id }) => ({ type: "Role" as const, id })),
              { type: "Role", id: "LIST" },
            ]
          : [{ type: "Role", id: "LIST" }],
    }),

    // 2. Lấy chi tiết vai trò kèm số lượng user và danh sách quyền
    getRoleById: builder.query<ApiResponse<RoleDetailResponse>, string>({
      query: (roleId) => ROLE_ENDPOINTS.ROLE_DETAIL(roleId),
      providesTags: (_result, _error, roleId) => [{ type: "Role", id: roleId }],
    }),

    // 3. Tạo mới vai trò tùy chỉnh
    createRole: builder.mutation<ApiResponse<RoleResponse>, CreateRoleRequest>({
      query: (body) => ({
        url: ROLE_ENDPOINTS.ROLES,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Role", id: "LIST" }],
    }),

    // 4. Cập nhật vai trò tùy chỉnh
    updateRole: builder.mutation<
      ApiResponse<RoleResponse>,
      { roleId: string; body: UpdateRoleRequest }
    >({
      query: ({ roleId, body }) => ({
        url: ROLE_ENDPOINTS.ROLE_DETAIL(roleId),
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { roleId }) => [
        { type: "Role", id: roleId },
        { type: "Role", id: "LIST" },
      ],
    }),

    // 5. Xóa mềm vai trò
    deleteRole: builder.mutation<ApiResponse<void>, string>({
      query: (roleId) => ({
        url: ROLE_ENDPOINTS.ROLE_DETAIL(roleId),
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Role", id: "LIST" }],
    }),

    // 6. Lấy ma trận quyền của vai trò
    getRolePermissions: builder.query<ApiResponse<RolePermissionResponse[]>, string>({
      query: (roleId) => ROLE_ENDPOINTS.ROLE_PERMISSIONS(roleId),
      providesTags: (_result, _error, roleId) => [{ type: "Role", id: `${roleId}_PERMS` }],
    }),

    // 7. Lưu thiết lập ma trận quyền cho vai trò
    assignRolePermissions: builder.mutation<
      ApiResponse<RolePermissionResponse[]>,
      { roleId: string; body: AssignRolePermissionsRequest }
    >({
      query: ({ roleId, body }) => ({
        url: ROLE_ENDPOINTS.ROLE_PERMISSIONS(roleId),
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { roleId }) => [
        { type: "Role", id: roleId },
        { type: "Role", id: `${roleId}_PERMS` },
        { type: "Role", id: "LIST" },
      ],
    }),

    // 8. Lấy 36 quyền gom theo 12 phân hệ tài nguyên
    getGroupedPermissions: builder.query<ApiResponse<GroupedPermissionsResponse>, void>({
      query: () => ROLE_ENDPOINTS.PERMISSIONS_GROUPED,
      providesTags: [{ type: "Permission", id: "GROUPED" }],
    }),

    // 9. Lấy danh sách toàn bộ quyền phẳng
    getAllPermissions: builder.query<ApiResponse<PermissionResponse[]>, void>({
      query: () => ROLE_ENDPOINTS.PERMISSIONS,
      providesTags: [{ type: "Permission", id: "LIST" }],
    }),
  }),
});

export const {
  useGetRolesQuery,
  useGetRoleByIdQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
  useGetRolePermissionsQuery,
  useAssignRolePermissionsMutation,
  useGetGroupedPermissionsQuery,
  useGetAllPermissionsQuery,
} = roleApi;
