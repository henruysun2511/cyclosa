import { baseApi } from "@/store/base-api-rtk";
import type { ApiResponse, PageData } from "@/types/api.types";
import type {
  ShiftResponse,
  CreateShiftRequest,
  UpdateShiftRequest,
  ShiftFilter,
  ShiftAssignmentResponse,
  BulkShiftAssignmentRequest,
  ShiftAssignmentFilter,
  PunchRequest,
  CheckInRequest,
  CheckOutRequest,
  AttendanceLogResponse,
  AttendanceLogFilter,
  TodayAttendanceStatusResponse,
  DailyAttendanceRecordResponse,
  DailyRecordFilter,
  MonthlyTimesheetSummaryResponse,
  MonthlySummaryFilter,
  AttendanceExceptionSummaryResponse,
  AttendanceRequestResponse,
  CreateAttendanceRequest,
  ApproveAttendanceRequest,
  AttendanceRequestFilter,
  AttendanceAdjustmentResponse,
  TimesheetPeriodResponse,
  CreateTimesheetPeriodRequest,
  TimesheetPeriodFilter,
  TimesheetPreLockCheckResponse,
  LockTimesheetPeriodRequest,
  UnlockPeriodRequest,
  TimesheetSnapshotResponse,
} from "../types/attendance.types";

export const attendanceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ── 1. Ca Làm Việc (Shifts) ────────────────────────────────────────────────
    getShifts: builder.query<ApiResponse<PageData<ShiftResponse>>, ShiftFilter | void>({
      query: (params) => ({
        url: "/shifts",
        params: params || {},
      }),
      providesTags: (result) =>
        result?.data?.items
          ? [
              ...result.data.items.map(({ id }) => ({ type: "AttendanceShift" as const, id })),
              { type: "AttendanceShift", id: "LIST" },
            ]
          : [{ type: "AttendanceShift", id: "LIST" }],
    }),

    getShiftById: builder.query<ApiResponse<ShiftResponse>, string>({
      query: (id) => `/shifts/${id}`,
      providesTags: (_res, _err, id) => [{ type: "AttendanceShift", id }],
    }),

    createShift: builder.mutation<ApiResponse<ShiftResponse>, CreateShiftRequest>({
      query: (body) => ({
        url: "/shifts",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "AttendanceShift", id: "LIST" }],
    }),

    updateShift: builder.mutation<ApiResponse<ShiftResponse>, { id: string; body: UpdateShiftRequest }>({
      query: ({ id, body }) => ({
        url: `/shifts/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_res, _err, { id }) => [
        { type: "AttendanceShift", id },
        { type: "AttendanceShift", id: "LIST" },
      ],
    }),

    deleteShift: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/shifts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "AttendanceShift", id: "LIST" }],
    }),

    toggleShiftActive: builder.mutation<ApiResponse<ShiftResponse>, string>({
      query: (id) => ({
        url: `/shifts/${id}/toggle-active`,
        method: "POST",
      }),
      invalidatesTags: (_res, _err, id) => [
        { type: "AttendanceShift", id },
        { type: "AttendanceShift", id: "LIST" },
      ],
    }),

    // ── 2. Phân Ca Làm Việc (Shift Assignments) ────────────────────────────────
    getShiftAssignments: builder.query<ApiResponse<ShiftAssignmentResponse[]>, ShiftAssignmentFilter>({
      query: (params) => ({
        url: "/shift-assignments",
        params,
      }),
      providesTags: [{ type: "ShiftAssignment", id: "LIST" }],
    }),

    bulkAssignShifts: builder.mutation<ApiResponse<ShiftAssignmentResponse[]>, BulkShiftAssignmentRequest>({
      query: (body) => ({
        url: "/shift-assignments/bulk",
        method: "POST",
        body,
      }),
      invalidatesTags: [
        { type: "ShiftAssignment", id: "LIST" },
        { type: "AttendanceDailyRecord", id: "LIST" },
        { type: "MonthlyTimesheetSummary", id: "LIST" },
      ],
    }),

    // ── 3. Chấm Công Trực Tuyến & Log (Punch & Logs) ───────────────────────────
    punchCheckIn: builder.mutation<ApiResponse<AttendanceLogResponse>, CheckInRequest>({
      query: (body) => ({
        url: "/attendance/check-in",
        method: "POST",
        body,
      }),
      invalidatesTags: [
        { type: "AttendanceLog", id: "LIST" },
        { type: "AttendanceDailyRecord", id: "LIST" },
      ],
    }),

    punchCheckOut: builder.mutation<ApiResponse<AttendanceLogResponse>, CheckOutRequest>({
      query: (body) => ({
        url: "/attendance/check-out",
        method: "POST",
        body,
      }),
      invalidatesTags: [
        { type: "AttendanceLog", id: "LIST" },
        { type: "AttendanceDailyRecord", id: "LIST" },
      ],
    }),

    getMyTodayStatus: builder.query<ApiResponse<TodayAttendanceStatusResponse>, void>({
      query: () => "/me/attendance/today",
      providesTags: [{ type: "AttendanceLog", id: "TODAY_STATUS" }],
    }),

    getMyAttendanceLogs: builder.query<ApiResponse<PageData<AttendanceLogResponse>>, AttendanceLogFilter | void>({
      query: (params) => ({
        url: "/me/attendance/logs",
        params: params || {},
      }),
      providesTags: [{ type: "AttendanceLog", id: "MY_LIST" }],
    }),

    getAllAttendanceLogs: builder.query<ApiResponse<PageData<AttendanceLogResponse>>, AttendanceLogFilter>({
      query: (params) => ({
        url: "/attendance/logs",
        params,
      }),
      providesTags: [{ type: "AttendanceLog", id: "LIST" }],
    }),

    // ── 4. Bảng Công Ngày & Bảng Công Tháng ──────────────────────────────────
    getDailyRecords: builder.query<ApiResponse<PageData<DailyAttendanceRecordResponse>>, DailyRecordFilter>({
      query: (params) => ({
        url: "/attendance/daily-records",
        params,
      }),
      providesTags: [{ type: "AttendanceDailyRecord", id: "LIST" }],
    }),

    getMyDailyRecords: builder.query<ApiResponse<PageData<DailyAttendanceRecordResponse>>, DailyRecordFilter | void>({
      query: (params) => ({
        url: "/me/attendance/daily-records",
        params: params || {},
      }),
      providesTags: [{ type: "AttendanceDailyRecord", id: "MY_LIST" }],
    }),

    getMonthlySummary: builder.query<ApiResponse<MonthlyTimesheetSummaryResponse>, MonthlySummaryFilter>({
      query: (params) => ({
        url: "/attendance/monthly-summary",
        params,
      }),
      providesTags: [{ type: "MonthlyTimesheetSummary", id: "CURRENT" }],
    }),

    getExceptionSummaries: builder.query<
      ApiResponse<AttendanceExceptionSummaryResponse[]>,
      { startDate?: string; endDate?: string; date?: string } | void
    >({
      query: (params) => ({
        url: "/attendance/exceptions",
        params: params || {},
      }),
      providesTags: [{ type: "AttendanceException", id: "LIST" }],
    }),

    // ── 5. Đơn Giải Trình Chấm Công (Attendance Requests) ─────────────────────
    createAttendanceRequest: builder.mutation<ApiResponse<AttendanceRequestResponse>, CreateAttendanceRequest>({
      query: (body) => ({
        url: "/attendance-requests",
        method: "POST",
        body,
      }),
      invalidatesTags: [
        { type: "AttendanceRequest", id: "LIST" },
        { type: "AttendanceRequest", id: "MY_LIST" },
        { type: "AttendanceException", id: "LIST" },
      ],
    }),

    getMyAttendanceRequests: builder.query<ApiResponse<PageData<AttendanceRequestResponse>>, AttendanceRequestFilter | void>({
      query: (params) => ({
        url: "/me/attendance-requests",
        params: params || {},
      }),
      providesTags: [{ type: "AttendanceRequest", id: "MY_LIST" }],
    }),

    getAllAttendanceRequests: builder.query<ApiResponse<PageData<AttendanceRequestResponse>>, AttendanceRequestFilter>({
      query: (params) => ({
        url: "/attendance-requests",
        params,
      }),
      providesTags: [{ type: "AttendanceRequest", id: "LIST" }],
    }),

    getAttendanceRequestById: builder.query<ApiResponse<AttendanceRequestResponse>, string>({
      query: (id) => `/attendance-requests/${id}`,
      providesTags: (_res, _err, id) => [{ type: "AttendanceRequest", id }],
    }),

    approveAttendanceRequest: builder.mutation<
      ApiResponse<AttendanceRequestResponse>,
      { id: string; body?: ApproveAttendanceRequest }
    >({
      query: ({ id, body }) => ({
        url: `/attendance-requests/${id}/approved-times`,
        method: "PUT",
        body: body || {},
      }),
      invalidatesTags: (_res, _err, { id }) => [
        { type: "AttendanceRequest", id },
        { type: "AttendanceRequest", id: "LIST" },
        { type: "AttendanceAdjustment", id: "LIST" },
        { type: "AttendanceDailyRecord", id: "LIST" },
        { type: "MonthlyTimesheetSummary", id: "CURRENT" },
        { type: "AttendanceException", id: "LIST" },
      ],
    }),

    rejectAttendanceRequest: builder.mutation<
      ApiResponse<AttendanceRequestResponse>,
      { id: string; reason?: string }
    >({
      query: ({ id, reason }) => ({
        url: `/attendance-requests/${id}/reject`,
        method: "POST",
        params: reason ? { reason } : {},
      }),
      invalidatesTags: (_res, _err, { id }) => [
        { type: "AttendanceRequest", id },
        { type: "AttendanceRequest", id: "LIST" },
        { type: "AttendanceException", id: "LIST" },
      ],
    }),

    cancelAttendanceRequest: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/attendance-requests/${id}/cancel`,
        method: "POST",
      }),
      invalidatesTags: [
        { type: "AttendanceRequest", id: "LIST" },
        { type: "AttendanceRequest", id: "MY_LIST" },
      ],
    }),

    getAttendanceAdjustments: builder.query<
      ApiResponse<PageData<AttendanceAdjustmentResponse>>,
      { employeeId?: string; date?: string; page?: number; size?: number } | void
    >({
      query: (params) => ({
        url: "/attendance-adjustments",
        params: params || {},
      }),
      providesTags: [{ type: "AttendanceAdjustment", id: "LIST" }],
    }),

    // ── 6. Kỳ Công Tháng & Snapshot (Periods & Snapshots) ─────────────────────
    getTimesheetPeriods: builder.query<ApiResponse<PageData<TimesheetPeriodResponse>>, TimesheetPeriodFilter | void>({
      query: (params) => ({
        url: "/timesheet-periods",
        params: params || {},
      }),
      providesTags: [{ type: "TimesheetPeriod", id: "LIST" }],
    }),

    createTimesheetPeriod: builder.mutation<ApiResponse<TimesheetPeriodResponse>, CreateTimesheetPeriodRequest>({
      query: (body) => ({
        url: "/timesheet-periods",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "TimesheetPeriod", id: "LIST" }],
    }),

    getTimesheetPeriodById: builder.query<ApiResponse<TimesheetPeriodResponse>, string>({
      query: (id) => `/timesheet-periods/${id}`,
      providesTags: (_res, _err, id) => [{ type: "TimesheetPeriod", id }],
    }),

    preLockCheck: builder.query<ApiResponse<TimesheetPreLockCheckResponse>, string>({
      query: (id) => `/timesheet-periods/${id}/pre-lock-check`,
      providesTags: (_res, _err, id) => [{ type: "TimesheetPeriod", id: `PRE_LOCK_${id}` }],
    }),

    lockTimesheetPeriod: builder.mutation<
      ApiResponse<TimesheetPeriodResponse>,
      { id: string; body?: LockTimesheetPeriodRequest }
    >({
      query: ({ id, body }) => ({
        url: `/timesheet-periods/${id}/lock`,
        method: "POST",
        body: body || {},
      }),
      invalidatesTags: (_res, _err, { id }) => [
        { type: "TimesheetPeriod", id },
        { type: "TimesheetPeriod", id: "LIST" },
        { type: "TimesheetSnapshot", id: "LIST" },
      ],
    }),

    unlockTimesheetPeriod: builder.mutation<
      ApiResponse<TimesheetPeriodResponse>,
      { id: string; body: UnlockPeriodRequest }
    >({
      query: ({ id, body }) => ({
        url: `/timesheet-periods/${id}/unlock`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_res, _err, { id }) => [
        { type: "TimesheetPeriod", id },
        { type: "TimesheetPeriod", id: "LIST" },
        { type: "TimesheetSnapshot", id: "LIST" },
      ],
    }),

    getTimesheetSnapshots: builder.query<
      ApiResponse<PageData<TimesheetSnapshotResponse>>,
      { periodId: string; page?: number; size?: number }
    >({
      query: ({ periodId, ...params }) => ({
        url: `/timesheet-periods/${periodId}/snapshots`,
        params,
      }),
      providesTags: [{ type: "TimesheetSnapshot", id: "LIST" }],
    }),

    getMyTimesheetSnapshots: builder.query<ApiResponse<TimesheetSnapshotResponse[]>, { year?: number } | void>({
      query: (params) => ({
        url: "/me/timesheet-snapshots",
        params: params || {},
      }),
      providesTags: [{ type: "TimesheetSnapshot", id: "MY_LIST" }],
    }),
  }),
});

export const {
  useGetShiftsQuery,
  useGetShiftByIdQuery,
  useCreateShiftMutation,
  useUpdateShiftMutation,
  useDeleteShiftMutation,
  useToggleShiftActiveMutation,
  useGetShiftAssignmentsQuery,
  useBulkAssignShiftsMutation,
  usePunchCheckInMutation,
  usePunchCheckOutMutation,
  useGetMyTodayStatusQuery,
  useGetMyAttendanceLogsQuery,
  useGetAllAttendanceLogsQuery,
  useGetDailyRecordsQuery,
  useGetMyDailyRecordsQuery,
  useGetMonthlySummaryQuery,
  useGetExceptionSummariesQuery,
  useCreateAttendanceRequestMutation,
  useGetMyAttendanceRequestsQuery,
  useGetAllAttendanceRequestsQuery,
  useGetAttendanceRequestByIdQuery,
  useApproveAttendanceRequestMutation,
  useRejectAttendanceRequestMutation,
  useCancelAttendanceRequestMutation,
  useGetAttendanceAdjustmentsQuery,
  useGetTimesheetPeriodsQuery,
  useCreateTimesheetPeriodMutation,
  useGetTimesheetPeriodByIdQuery,
  usePreLockCheckQuery,
  useLockTimesheetPeriodMutation,
  useUnlockTimesheetPeriodMutation,
  useGetTimesheetSnapshotsQuery,
  useGetMyTimesheetSnapshotsQuery,
} = attendanceApi;

