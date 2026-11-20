import { baseApi } from "@/store/base-api-rtk";
import type { ApiResponse, PageData } from "@/types/api.types";
import type {
  OffboardingRequest,
  OffboardingClearanceItem,
  ExitInterview,
  OffboardingSummary,
  OffboardingStatistics,
  OffboardingFilterParams,
  CreateResignationPayload,
  CreateTerminationPayload,
  ApproveResignationPayload,
  RejectResignationPayload,
  UpdateClearanceItemPayload,
  SaveExitInterviewPayload,
  OffboardingHandoverProtocol,
  ReturnOffboardingAssetsPayload,
} from "../types/offboarding.types";

export const offboardingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOffboardingRequests: builder.query<
      ApiResponse<PageData<OffboardingRequest>>,
      OffboardingFilterParams
    >({
      query: (params) => {
        const { page, size, search, type, status, departmentId, fromDate, toDate, sort, direction } = params;
        const queryParams: Record<string, any> = {
          page: page && page > 0 ? page - 1 : 0,
          size: size || 10,
        };
        if (search) queryParams.search = search;
        if (type && type !== "ALL") queryParams.type = type;
        if (status && status !== "ALL") queryParams.status = status;
        if (departmentId) queryParams.departmentId = departmentId;
        if (fromDate) queryParams.fromDate = fromDate;
        if (toDate) queryParams.toDate = toDate;
        if (sort) queryParams.sort = sort;
        if (direction) queryParams.direction = direction;

        return {
          url: "/offboarding/requests",
          method: "GET",
          params: queryParams,
        };
      },
      providesTags: (result) =>
        result?.data?.items
          ? [
              ...result.data.items.map(({ id }) => ({ type: "Offboarding" as const, id })),
              { type: "Offboarding" as const, id: "LIST" },
            ]
          : [{ type: "Offboarding" as const, id: "LIST" }],
    }),

    getOffboardingStatistics: builder.query<ApiResponse<OffboardingStatistics>, void>({
      query: () => ({
        url: "/offboarding/requests/statistics",
        method: "GET",
      }),
      providesTags: [{ type: "Offboarding" as const, id: "STATS" }],
    }),

    getOffboardingRequestById: builder.query<ApiResponse<OffboardingRequest>, string>({
      query: (id) => ({
        url: `/offboarding/requests/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Offboarding" as const, id }],
    }),

    createResignation: builder.mutation<ApiResponse<OffboardingRequest>, CreateResignationPayload>({
      query: (payload) => ({
        url: "/offboarding/requests/resignations",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [
        { type: "Offboarding" as const, id: "LIST" },
        { type: "Offboarding" as const, id: "STATS" },
      ],
    }),

    createTermination: builder.mutation<ApiResponse<OffboardingRequest>, CreateTerminationPayload>({
      query: (payload) => ({
        url: "/offboarding/requests/terminations",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [
        { type: "Offboarding" as const, id: "LIST" },
        { type: "Offboarding" as const, id: "STATS" },
      ],
    }),

    approveResignation: builder.mutation<
      ApiResponse<OffboardingRequest>,
      { id: string; payload: ApproveResignationPayload }
    >({
      query: ({ id, payload }) => ({
        url: `/offboarding/requests/${id}/approve`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Offboarding" as const, id },
        { type: "Offboarding" as const, id: "LIST" },
        { type: "Offboarding" as const, id: "STATS" },
      ],
    }),

    rejectResignation: builder.mutation<
      ApiResponse<OffboardingRequest>,
      { id: string; payload: RejectResignationPayload }
    >({
      query: ({ id, payload }) => ({
        url: `/offboarding/requests/${id}/reject`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Offboarding" as const, id },
        { type: "Offboarding" as const, id: "LIST" },
        { type: "Offboarding" as const, id: "STATS" },
      ],
    }),

    getClearanceItems: builder.query<ApiResponse<OffboardingClearanceItem[]>, string>({
      query: (requestId) => ({
        url: `/offboarding/requests/${requestId}/clearance`,
        method: "GET",
      }),
      providesTags: (_result, _error, requestId) => [
        { type: "Offboarding" as const, id: `CLEARANCE_${requestId}` },
      ],
    }),

    updateClearanceItem: builder.mutation<
      ApiResponse<OffboardingClearanceItem>,
      { requestId: string; itemId: string; payload: UpdateClearanceItemPayload }
    >({
      query: ({ requestId, itemId, payload }) => ({
        url: `/offboarding/requests/${requestId}/clearance/${itemId}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: (_result, _error, { requestId }) => [
        { type: "Offboarding" as const, id: requestId },
        { type: "Offboarding" as const, id: `CLEARANCE_${requestId}` },
        { type: "Offboarding" as const, id: `SUMMARY_${requestId}` },
        { type: "Offboarding" as const, id: "LIST" },
      ],
    }),

    getExitInterview: builder.query<ApiResponse<ExitInterview>, string>({
      query: (requestId) => ({
        url: `/offboarding/requests/${requestId}/exit-interview`,
        method: "GET",
      }),
      providesTags: (_result, _error, requestId) => [
        { type: "Offboarding" as const, id: `INTERVIEW_${requestId}` },
      ],
    }),

    saveExitInterview: builder.mutation<
      ApiResponse<ExitInterview>,
      { requestId: string; payload: SaveExitInterviewPayload }
    >({
      query: ({ requestId, payload }) => ({
        url: `/offboarding/requests/${requestId}/exit-interview`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: (_result, _error, { requestId }) => [
        { type: "Offboarding" as const, id: requestId },
        { type: "Offboarding" as const, id: `INTERVIEW_${requestId}` },
        { type: "Offboarding" as const, id: `SUMMARY_${requestId}` },
      ],
    }),

    getOffboardingSummary: builder.query<ApiResponse<OffboardingSummary>, string>({
      query: (requestId) => ({
        url: `/offboarding/requests/${requestId}/summary`,
        method: "GET",
      }),
      providesTags: (_result, _error, requestId) => [
        { type: "Offboarding" as const, id: `SUMMARY_${requestId}` },
      ],
    }),

    completeOffboarding: builder.mutation<ApiResponse<OffboardingRequest>, string>({
      query: (requestId) => ({
        url: `/offboarding/requests/${requestId}/complete`,
        method: "PUT",
      }),
      invalidatesTags: (_result, _error, requestId) => [
        { type: "Offboarding" as const, id: requestId },
        { type: "Offboarding" as const, id: `SUMMARY_${requestId}` },
        { type: "Offboarding" as const, id: "LIST" },
        { type: "Offboarding" as const, id: "STATS" },
        "Employee",
        "User",
      ],
    }),

    getHandoverProtocol: builder.query<ApiResponse<OffboardingHandoverProtocol>, string>({
      query: (requestId) => ({
        url: `/offboarding/requests/${requestId}/handover-protocol`,
        method: "GET",
      }),
      providesTags: (_result, _error, requestId) => [
        { type: "Offboarding" as const, id: `HANDOVER_${requestId}` },
      ],
    }),

    returnOffboardingAssets: builder.mutation<
      ApiResponse<OffboardingHandoverProtocol>,
      { requestId: string; payload: ReturnOffboardingAssetsPayload }
    >({
      query: ({ requestId, payload }) => ({
        url: `/offboarding/requests/${requestId}/return-assets`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: (_result, _error, { requestId }) => [
        { type: "Offboarding" as const, id: requestId },
        { type: "Offboarding" as const, id: `HANDOVER_${requestId}` },
        { type: "Offboarding" as const, id: `CLEARANCE_${requestId}` },
        { type: "Offboarding" as const, id: `SUMMARY_${requestId}` },
        { type: "Offboarding" as const, id: "LIST" },
      ],
    }),

    deleteOffboardingRequest: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/offboarding/requests/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        { type: "Offboarding" as const, id: "LIST" },
        { type: "Offboarding" as const, id: "STATS" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetOffboardingRequestsQuery,
  useGetOffboardingStatisticsQuery,
  useGetOffboardingRequestByIdQuery,
  useCreateResignationMutation,
  useCreateTerminationMutation,
  useApproveResignationMutation,
  useRejectResignationMutation,
  useGetClearanceItemsQuery,
  useUpdateClearanceItemMutation,
  useGetExitInterviewQuery,
  useSaveExitInterviewMutation,
  useGetOffboardingSummaryQuery,
  useGetHandoverProtocolQuery,
  useReturnOffboardingAssetsMutation,
  useCompleteOffboardingMutation,
  useDeleteOffboardingRequestMutation,
} = offboardingApi;
