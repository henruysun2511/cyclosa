import { baseApi } from "@/store/base-api-rtk";
import type { ApiResponse, PageData } from "@/types/api.types";
import type {
  LeaveTypeDto,
  CreateLeaveTypeDto,
  UpdateLeaveTypeDto,
  LeaveTypeFilterParams,
  LeavePolicyDto,
  CreateLeavePolicyDto,
  UpdateLeavePolicyDto,
  LeavePolicyFilterParams,
  LeaveBalanceDto,
  GenerateLeaveBalancesDto,
  RecalculateLeaveBalanceDto,
  CarryOverLeaveDto,
  LeaveBalanceFilterParams,
  LeaveRequestDto,
  CreateLeaveRequestDto,
  LeavePreviewRequestDto,
  LeavePreviewResponseDto,
  LeaveRequestFilterParams,
  LeaveCalendarFilterParams,
  LeaveCalendarEventDto,
} from "../types/leave.types";

export const leaveApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ── Leave Types ──────────────────────────────────────────────────────────
    getLeaveTypes: builder.query<
      ApiResponse<PageData<LeaveTypeDto>>,
      LeaveTypeFilterParams | void
    >({
      query: (params) => {
        const p: Record<string, string | number | boolean> = {};
        if (params?.keyword) p.keyword = params.keyword;
        if (params?.leaveGroup && params.leaveGroup !== "ALL") p.leaveGroup = params.leaveGroup;
        if (params?.payer && params.payer !== "ALL") p.payer = params.payer;
        if (params?.isActive !== undefined && params.isActive !== "ALL") p.isActive = params.isActive;
        if (params?.page !== undefined) p.page = params.page;
        if (params?.size !== undefined) p.size = params.size;
        if (params?.sortBy) p.sortBy = params.sortBy;
        if (params?.direction) p.direction = params.direction;
        return {
          url: "/leave-types",
          params: p,
        };
      },
      providesTags: (result) =>
        result?.data?.items
          ? [
              ...result.data.items.map(({ id }) => ({
                type: "LeaveType" as const,
                id,
              })),
              { type: "LeaveType", id: "LIST" },
            ]
          : [{ type: "LeaveType", id: "LIST" }],
    }),

    getActiveLeaveTypes: builder.query<ApiResponse<LeaveTypeDto[]>, void>({
      query: () => "/leave-types/active",
      providesTags: [{ type: "LeaveType", id: "ACTIVE_LIST" }],
    }),

    getLeaveTypeById: builder.query<ApiResponse<LeaveTypeDto>, string>({
      query: (id) => `/leave-types/${id}`,
      providesTags: (_res, _err, id) => [{ type: "LeaveType", id }],
    }),

    createLeaveType: builder.mutation<ApiResponse<LeaveTypeDto>, CreateLeaveTypeDto>({
      query: (body) => ({
        url: "/leave-types",
        method: "POST",
        body,
      }),
      invalidatesTags: [
        { type: "LeaveType", id: "LIST" },
        { type: "LeaveType", id: "ACTIVE_LIST" },
      ],
    }),

    updateLeaveType: builder.mutation<
      ApiResponse<LeaveTypeDto>,
      { id: string; body: UpdateLeaveTypeDto }
    >({
      query: ({ id, body }) => ({
        url: `/leave-types/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_res, _err, { id }) => [
        { type: "LeaveType", id },
        { type: "LeaveType", id: "LIST" },
        { type: "LeaveType", id: "ACTIVE_LIST" },
        { type: "LeavePolicy", id: "LIST" },
      ],
    }),

    deleteLeaveType: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/leave-types/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        { type: "LeaveType", id: "LIST" },
        { type: "LeaveType", id: "ACTIVE_LIST" },
      ],
    }),

    // ── Leave Policies ───────────────────────────────────────────────────────
    getLeavePolicies: builder.query<
      ApiResponse<PageData<LeavePolicyDto>>,
      LeavePolicyFilterParams | void
    >({
      query: (params) => {
        const p: Record<string, string | number> = {};
        if (params?.keyword) p.keyword = params.keyword;
        if (params?.leaveTypeId && params.leaveTypeId !== "ALL") p.leaveTypeId = params.leaveTypeId;
        if (params?.contractType && params.contractType !== "ALL") p.contractType = params.contractType;
        if (params?.page !== undefined) p.page = params.page;
        if (params?.size !== undefined) p.size = params.size;
        if (params?.sortBy) p.sortBy = params.sortBy;
        if (params?.direction) p.direction = params.direction;
        return {
          url: "/leave-policies",
          params: p,
        };
      },
      providesTags: (result) =>
        result?.data?.items
          ? [
              ...result.data.items.map(({ id }) => ({
                type: "LeavePolicy" as const,
                id,
              })),
              { type: "LeavePolicy", id: "LIST" },
            ]
          : [{ type: "LeavePolicy", id: "LIST" }],
    }),

    getLeavePolicyById: builder.query<ApiResponse<LeavePolicyDto>, string>({
      query: (id) => `/leave-policies/${id}`,
      providesTags: (_res, _err, id) => [{ type: "LeavePolicy", id }],
    }),

    createLeavePolicy: builder.mutation<ApiResponse<LeavePolicyDto>, CreateLeavePolicyDto>({
      query: (body) => ({
        url: "/leave-policies",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "LeavePolicy", id: "LIST" }],
    }),

    updateLeavePolicy: builder.mutation<
      ApiResponse<LeavePolicyDto>,
      { id: string; body: UpdateLeavePolicyDto }
    >({
      query: ({ id, body }) => ({
        url: `/leave-policies/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_res, _err, { id }) => [
        { type: "LeavePolicy", id },
        { type: "LeavePolicy", id: "LIST" },
      ],
    }),

    deleteLeavePolicy: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/leave-policies/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "LeavePolicy", id: "LIST" }],
    }),

    // ── Leave Balances ───────────────────────────────────────────────────────
    getLeaveBalances: builder.query<
      ApiResponse<PageData<LeaveBalanceDto>>,
      LeaveBalanceFilterParams | void
    >({
      query: (params) => {
        const p: Record<string, string | number> = {};
        if (params?.keyword) p.keyword = params.keyword;
        if (params?.year) p.year = params.year;
        if (params?.leaveTypeId && params.leaveTypeId !== "ALL") p.leaveTypeId = params.leaveTypeId;
        if (params?.employeeId) p.employeeId = params.employeeId;
        if (params?.departmentId) p.departmentId = params.departmentId;
        if (params?.page !== undefined) p.page = params.page;
        if (params?.size !== undefined) p.size = params.size;
        if (params?.sortBy) p.sortBy = params.sortBy;
        if (params?.direction) p.direction = params.direction;
        return {
          url: "/leave-balances",
          params: p,
        };
      },
      providesTags: (result) =>
        result?.data?.items
          ? [
              ...result.data.items.map(({ id }) => ({
                type: "LeaveBalance" as const,
                id,
              })),
              { type: "LeaveBalance", id: "LIST" },
            ]
          : [{ type: "LeaveBalance", id: "LIST" }],
    }),

    getMyLeaveBalances: builder.query<ApiResponse<LeaveBalanceDto[]>, number | void>({
      query: (year) => ({
        url: "/me/leave-balances",
        params: year ? { year } : undefined,
      }),
      providesTags: [{ type: "LeaveBalance", id: "MY_BALANCES" }],
    }),

    getEmployeeLeaveBalances: builder.query<
      ApiResponse<LeaveBalanceDto[]>,
      { employeeId: string; year?: number }
    >({
      query: ({ employeeId, year }) => ({
        url: `/employees/${employeeId}/leave-balances`,
        params: year ? { year } : undefined,
      }),
      providesTags: (_res, _err, { employeeId }) => [
        { type: "LeaveBalance", id: `EMP_${employeeId}` },
      ],
    }),

    generateLeaveBalances: builder.mutation<
      ApiResponse<LeaveBalanceDto[]>,
      GenerateLeaveBalancesDto
    >({
      query: (body) => ({
        url: "/leave-balances/generate",
        method: "POST",
        body,
      }),
      invalidatesTags: [
        { type: "LeaveBalance", id: "LIST" },
        { type: "LeaveBalance", id: "MY_BALANCES" },
      ],
    }),

    recalculateLeaveBalance: builder.mutation<
      ApiResponse<LeaveBalanceDto>,
      { employeeId: string; body: RecalculateLeaveBalanceDto }
    >({
      query: ({ employeeId, body }) => ({
        url: `/employees/${employeeId}/leave-balances/recalculate`,
        method: "POST",
        body,
      }),
      invalidatesTags: [
        { type: "LeaveBalance", id: "LIST" },
        { type: "LeaveBalance", id: "MY_BALANCES" },
      ],
    }),

    carryOverLeave: builder.mutation<
      ApiResponse<LeaveBalanceDto[]>,
      CarryOverLeaveDto
    >({
      query: (body) => ({
        url: "/leave-balances/carry-over",
        method: "POST",
        body,
      }),
      invalidatesTags: [
        { type: "LeaveBalance", id: "LIST" },
        { type: "LeaveBalance", id: "MY_BALANCES" },
      ],
    }),

    // ── Leave Requests ───────────────────────────────────────────────────────
    previewLeaveRequest: builder.mutation<
      ApiResponse<LeavePreviewResponseDto>,
      LeavePreviewRequestDto
    >({
      query: (body) => ({
        url: "/leave-requests/preview",
        method: "POST",
        body,
      }),
    }),

    createLeaveRequest: builder.mutation<
      ApiResponse<LeaveRequestDto>,
      CreateLeaveRequestDto
    >({
      query: (body) => ({
        url: "/leave-requests",
        method: "POST",
        body,
      }),
      invalidatesTags: [
        { type: "LeaveRequest", id: "LIST" },
        { type: "LeaveRequest", id: "MY_LIST" },
        { type: "LeaveBalance", id: "MY_BALANCES" },
        { type: "LeaveBalance", id: "LIST" },
        { type: "LeaveCalendar", id: "LIST" },
      ],
    }),

    getMyLeaveRequests: builder.query<
      ApiResponse<PageData<LeaveRequestDto>>,
      LeaveRequestFilterParams | void
    >({
      query: (params) => {
        const p: Record<string, string | number> = {};
        if (params?.status && params.status !== "ALL") p.status = params.status;
        if (params?.year) p.year = params.year;
        if (params?.leaveTypeId && params.leaveTypeId !== "ALL") p.leaveTypeId = params.leaveTypeId;
        if (params?.page !== undefined) p.page = params.page;
        if (params?.size !== undefined) p.size = params.size;
        if (params?.sortBy) p.sortBy = params.sortBy;
        if (params?.direction) p.direction = params.direction;
        return {
          url: "/me/leave-requests",
          params: p,
        };
      },
      providesTags: (result) =>
        result?.data?.items
          ? [
              ...result.data.items.map(({ id }) => ({
                type: "LeaveRequest" as const,
                id,
              })),
              { type: "LeaveRequest", id: "MY_LIST" },
            ]
          : [{ type: "LeaveRequest", id: "MY_LIST" }],
    }),

    getLeaveRequests: builder.query<
      ApiResponse<PageData<LeaveRequestDto>>,
      LeaveRequestFilterParams | void
    >({
      query: (params) => {
        const p: Record<string, string | number> = {};
        if (params?.keyword) p.keyword = params.keyword;
        if (params?.employeeId) p.employeeId = params.employeeId;
        if (params?.departmentId) p.departmentId = params.departmentId;
        if (params?.leaveTypeId && params.leaveTypeId !== "ALL") p.leaveTypeId = params.leaveTypeId;
        if (params?.status && params.status !== "ALL") p.status = params.status;
        if (params?.from) p.from = params.from;
        if (params?.to) p.to = params.to;
        if (params?.page !== undefined) p.page = params.page;
        if (params?.size !== undefined) p.size = params.size;
        if (params?.sortBy) p.sortBy = params.sortBy;
        if (params?.direction) p.direction = params.direction;
        return {
          url: "/leave-requests",
          params: p,
        };
      },
      providesTags: (result) =>
        result?.data?.items
          ? [
              ...result.data.items.map(({ id }) => ({
                type: "LeaveRequest" as const,
                id,
              })),
              { type: "LeaveRequest", id: "LIST" },
            ]
          : [{ type: "LeaveRequest", id: "LIST" }],
    }),

    getLeaveRequestById: builder.query<ApiResponse<LeaveRequestDto>, string>({
      query: (id) => `/leave-requests/${id}`,
      providesTags: (_res, _err, id) => [{ type: "LeaveRequest", id }],
    }),

    cancelLeaveRequest: builder.mutation<ApiResponse<void>, string>({
      query: (requestId) => ({
        url: `/leave-requests/${requestId}/cancel`,
        method: "POST",
      }),
      invalidatesTags: (_res, _err, id) => [
        { type: "LeaveRequest", id },
        { type: "LeaveRequest", id: "LIST" },
        { type: "LeaveRequest", id: "MY_LIST" },
        { type: "LeaveBalance", id: "MY_BALANCES" },
        { type: "LeaveBalance", id: "LIST" },
        { type: "LeaveCalendar", id: "LIST" },
      ],
    }),

    approveLeaveRequest: builder.mutation<ApiResponse<LeaveRequestDto>, string>({
      query: (requestId) => ({
        url: `/leave-requests/${requestId}/approve`,
        method: "POST",
      }),
      invalidatesTags: (_res, _err, id) => [
        { type: "LeaveRequest", id },
        { type: "LeaveRequest", id: "LIST" },
        { type: "LeaveRequest", id: "MY_LIST" },
        { type: "LeaveBalance", id: "MY_BALANCES" },
        { type: "LeaveBalance", id: "LIST" },
        { type: "LeaveCalendar", id: "LIST" },
      ],
    }),

    rejectLeaveRequest: builder.mutation<
      ApiResponse<LeaveRequestDto>,
      { requestId: string; reason: string }
    >({
      query: ({ requestId, reason }) => ({
        url: `/leave-requests/${requestId}/reject`,
        method: "POST",
        body: { reason },
      }),
      invalidatesTags: (_res, _err, { requestId }) => [
        { type: "LeaveRequest", id: requestId },
        { type: "LeaveRequest", id: "LIST" },
        { type: "LeaveRequest", id: "MY_LIST" },
        { type: "LeaveBalance", id: "MY_BALANCES" },
        { type: "LeaveBalance", id: "LIST" },
        { type: "LeaveCalendar", id: "LIST" },
      ],
    }),

    // ── Leave Calendar ───────────────────────────────────────────────────────
    getLeaveCalendar: builder.query<
      ApiResponse<LeaveCalendarEventDto[]>,
      LeaveCalendarFilterParams
    >({
      query: (params) => ({
        url: "/leave-calendar",
        params: {
          departmentId: params.departmentId || undefined,
          from: params.from,
          to: params.to,
        },
      }),
      providesTags: [{ type: "LeaveCalendar", id: "LIST" }],
    }),
  }),
});

export const {
  useGetLeaveTypesQuery,
  useGetActiveLeaveTypesQuery,
  useGetLeaveTypeByIdQuery,
  useCreateLeaveTypeMutation,
  useUpdateLeaveTypeMutation,
  useDeleteLeaveTypeMutation,

  useGetLeavePoliciesQuery,
  useGetLeavePolicyByIdQuery,
  useCreateLeavePolicyMutation,
  useUpdateLeavePolicyMutation,
  useDeleteLeavePolicyMutation,

  useGetLeaveBalancesQuery,
  useGetMyLeaveBalancesQuery,
  useGetEmployeeLeaveBalancesQuery,
  useGenerateLeaveBalancesMutation,
  useRecalculateLeaveBalanceMutation,
  useCarryOverLeaveMutation,

  usePreviewLeaveRequestMutation,
  useCreateLeaveRequestMutation,
  useGetMyLeaveRequestsQuery,
  useGetLeaveRequestsQuery,
  useGetLeaveRequestByIdQuery,
  useCancelLeaveRequestMutation,
  useApproveLeaveRequestMutation,
  useRejectLeaveRequestMutation,

  useGetLeaveCalendarQuery,
} = leaveApi;

