import { baseApi } from "@/store/base-api-rtk";
import type { ApiResponse } from "@/types/api.types";
import { buildQueryString } from "@/lib/utils";
import type {
  DashboardFilterParams,
  ExecutiveDashboardData,
  PersonnelDashboardData,
  AttendanceDashboardData,
  RecruitmentDashboardData,
  PerformanceDashboardData,
  WorkplaceDashboardData,
} from "../types/dashboard.types";

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 1. Executive Dashboard
    getExecutiveDashboard: builder.query<
      ExecutiveDashboardData,
      DashboardFilterParams | void
    >({
      query: (params) => {
        const queryStr = params ? buildQueryString(params as Record<string, unknown>) : "";
        return {
          url: `/dashboard/overview${queryStr ? `?${queryStr}` : ""}`,
          method: "GET",
        };
      },
      transformResponse: (response: ApiResponse<ExecutiveDashboardData>) => response.data,
      providesTags: [{ type: "Dashboard", id: "EXECUTIVE" }],
    }),

    // 2. Personnel Dashboard
    getPersonnelDashboard: builder.query<
      PersonnelDashboardData,
      DashboardFilterParams | void
    >({
      query: (params) => {
        const queryStr = params ? buildQueryString(params as Record<string, unknown>) : "";
        return {
          url: `/dashboard/personnel${queryStr ? `?${queryStr}` : ""}`,
          method: "GET",
        };
      },
      transformResponse: (response: ApiResponse<PersonnelDashboardData>) => response.data,
      providesTags: [{ type: "Dashboard", id: "PERSONNEL" }],
    }),

    // 3. Attendance Dashboard
    getAttendanceDashboard: builder.query<
      AttendanceDashboardData,
      DashboardFilterParams | void
    >({
      query: (params) => {
        const queryStr = params ? buildQueryString(params as Record<string, unknown>) : "";
        return {
          url: `/dashboard/attendance${queryStr ? `?${queryStr}` : ""}`,
          method: "GET",
        };
      },
      transformResponse: (response: ApiResponse<AttendanceDashboardData>) => response.data,
      providesTags: [{ type: "Dashboard", id: "ATTENDANCE" }],
    }),

    // 4. Recruitment Dashboard
    getRecruitmentDashboard: builder.query<
      RecruitmentDashboardData,
      DashboardFilterParams | void
    >({
      query: (params) => {
        const queryStr = params ? buildQueryString(params as Record<string, unknown>) : "";
        return {
          url: `/dashboard/recruitment${queryStr ? `?${queryStr}` : ""}`,
          method: "GET",
        };
      },
      transformResponse: (response: ApiResponse<RecruitmentDashboardData>) => response.data,
      providesTags: [{ type: "Dashboard", id: "RECRUITMENT" }],
    }),

    // 5. Performance Dashboard
    getPerformanceDashboard: builder.query<
      PerformanceDashboardData,
      DashboardFilterParams | void
    >({
      query: (params) => {
        const queryStr = params ? buildQueryString(params as Record<string, unknown>) : "";
        return {
          url: `/dashboard/performance${queryStr ? `?${queryStr}` : ""}`,
          method: "GET",
        };
      },
      transformResponse: (response: ApiResponse<PerformanceDashboardData>) => response.data,
      providesTags: [{ type: "Dashboard", id: "PERFORMANCE" }],
    }),

    // 6. Workplace Dashboard
    getWorkplaceDashboard: builder.query<
      WorkplaceDashboardData,
      DashboardFilterParams | void
    >({
      query: (params) => {
        const queryStr = params ? buildQueryString(params as Record<string, unknown>) : "";
        return {
          url: `/dashboard/workplace${queryStr ? `?${queryStr}` : ""}`,
          method: "GET",
        };
      },
      transformResponse: (response: ApiResponse<WorkplaceDashboardData>) => response.data,
      providesTags: [{ type: "Dashboard", id: "WORKPLACE" }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetExecutiveDashboardQuery,
  useGetPersonnelDashboardQuery,
  useGetAttendanceDashboardQuery,
  useGetRecruitmentDashboardQuery,
  useGetPerformanceDashboardQuery,
  useGetWorkplaceDashboardQuery,
} = dashboardApi;
