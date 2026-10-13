import { baseApi } from "@/lib/base-api-rtk";
import type { ApiResponse } from "@/types/api.types";
import type {
  DashboardOverviewResponse,
  DashboardFilterParams,
} from "../types/dashboard.types";
import { buildQueryString } from "@/lib/utils";

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardOverview: builder.query<
      DashboardOverviewResponse,
      DashboardFilterParams | void
    >({
      query: (params) => {
        const queryStr = params ? buildQueryString(params as Record<string, unknown>) : "";
        return {
          url: `/dashboard/overview${queryStr ? `?${queryStr}` : ""}`,
          method: "GET",
        };
      },
      transformResponse: (response: ApiResponse<DashboardOverviewResponse>) =>
        response.data,
      providesTags: ["Dashboard" as any],
    }),
  }),
  overrideExisting: false,
});

export const { useGetDashboardOverviewQuery } = dashboardApi;
