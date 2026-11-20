import { baseApi } from "@/store/base-api-rtk";
import type { ApiResponse, PageData } from "@/types/api.types";
import type {
  PerformanceCycleDto,
  PerformanceCycleSummaryDto,
  KpiDto,
  PerformanceReviewDto,
  PerformanceReviewDetailDto,
  PerformanceGoalDto,
  ScorePreviewDto,
  PerformanceCycleFilters,
  KpiFilters,
  PerformanceReviewFilters,
  CreatePerformanceCyclePayload,
  UpdatePerformanceCyclePayload,
  CreateKpiPayload,
  UpdateKpiPayload,
  InitializeReviewsPayload,
  CreateGoalPayload,
  UpdateGoalPayload,
  UpdateGoalStatusPayload,
  ManagerAssessmentPayload,
} from "../types/performance.types";

export const performanceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ── 1. Chu kỳ đánh giá (Cycles) ───────────────────────────────────────────
    getCycles: builder.query<ApiResponse<PageData<PerformanceCycleDto>>, PerformanceCycleFilters>({
      query: (params) => {
        const { page, size, status, year, search, sortBy, direction } = params;
        const queryParams: Record<string, any> = {
          page: page && page > 0 ? page - 1 : 0,
          size: size || 10,
        };
        if (search) queryParams.search = search;
        if (status && status !== "ALL") queryParams.status = status;
        if (year) queryParams.year = year;
        if (sortBy) queryParams.sortBy = sortBy;
        if (direction) queryParams.direction = direction;

        return {
          url: "/performance-cycles",
          method: "GET",
          params: queryParams,
        };
      },
      providesTags: (result) =>
        result?.data?.items
          ? [
              ...result.data.items.map(({ id }) => ({ type: "PerformanceCycle" as const, id })),
              { type: "PerformanceCycle", id: "LIST" },
            ]
          : [{ type: "PerformanceCycle", id: "LIST" }],
    }),

    getCycleById: builder.query<ApiResponse<PerformanceCycleDto>, string>({
      query: (id) => ({
        url: `/performance-cycles/${id}`,
        method: "GET",
      }),
      providesTags: (_res, _err, id) => [{ type: "PerformanceCycle", id }],
    }),

    createCycle: builder.mutation<ApiResponse<PerformanceCycleDto>, CreatePerformanceCyclePayload>({
      query: (body) => ({
        url: "/performance-cycles",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "PerformanceCycle", id: "LIST" }],
    }),

    updateCycle: builder.mutation<
      ApiResponse<PerformanceCycleDto>,
      { id: string; body: UpdatePerformanceCyclePayload }
    >({
      query: ({ id, body }) => ({
        url: `/performance-cycles/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_res, _err, { id }) => [
        { type: "PerformanceCycle", id },
        { type: "PerformanceCycle", id: "LIST" },
      ],
    }),

    deleteCycle: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/performance-cycles/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "PerformanceCycle", id: "LIST" }],
    }),

    activateCycle: builder.mutation<ApiResponse<PerformanceCycleDto>, string>({
      query: (id) => ({
        url: `/performance-cycles/${id}/activate`,
        method: "POST",
      }),
      invalidatesTags: (_res, _err, id) => [
        { type: "PerformanceCycle", id },
        { type: "PerformanceCycle", id: "LIST" },
      ],
    }),

    closeCycle: builder.mutation<ApiResponse<PerformanceCycleDto>, string>({
      query: (id) => ({
        url: `/performance-cycles/${id}/close`,
        method: "POST",
      }),
      invalidatesTags: (_res, _err, id) => [
        { type: "PerformanceCycle", id },
        { type: "PerformanceCycle", id: "LIST" },
      ],
    }),

    getCycleSummary: builder.query<ApiResponse<PerformanceCycleSummaryDto>, string>({
      query: (id) => ({
        url: `/performance-cycles/${id}/summary`,
        method: "GET",
      }),
      providesTags: (_res, _err, id) => [{ type: "PerformanceCycle", id: `SUMMARY-${id}` }],
    }),

    // ── 2. Chỉ số KPI (KPI Catalog) ──────────────────────────────────────────
    getKpis: builder.query<ApiResponse<PageData<KpiDto>>, KpiFilters>({
      query: (params) => {
        const { page, size, departmentId, isActive, search, sortBy, direction } = params;
        const queryParams: Record<string, any> = {
          page: page && page > 0 ? page - 1 : 0,
          size: size || 10,
        };
        if (search) queryParams.search = search;
        if (departmentId && departmentId !== "ALL") queryParams.departmentId = departmentId;
        if (isActive !== undefined && isActive !== "ALL") queryParams.isActive = isActive;
        if (sortBy) queryParams.sortBy = sortBy;
        if (direction) queryParams.direction = direction;

        return {
          url: "/kpis",
          method: "GET",
          params: queryParams,
        };
      },
      providesTags: (result) =>
        result?.data?.items
          ? [
              ...result.data.items.map(({ id }) => ({ type: "Kpi" as const, id })),
              { type: "Kpi", id: "LIST" },
            ]
          : [{ type: "Kpi", id: "LIST" }],
    }),

    getKpiById: builder.query<ApiResponse<KpiDto>, string>({
      query: (id) => ({
        url: `/kpis/${id}`,
        method: "GET",
      }),
      providesTags: (_res, _err, id) => [{ type: "Kpi", id }],
    }),

    createKpi: builder.mutation<ApiResponse<KpiDto>, CreateKpiPayload>({
      query: (body) => ({
        url: "/kpis",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Kpi", id: "LIST" }],
    }),

    updateKpi: builder.mutation<ApiResponse<KpiDto>, { id: string; body: UpdateKpiPayload }>({
      query: ({ id, body }) => ({
        url: `/kpis/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_res, _err, { id }) => [
        { type: "Kpi", id },
        { type: "Kpi", id: "LIST" },
      ],
    }),

    deleteKpi: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/kpis/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Kpi", id: "LIST" }],
    }),

    // ── 3. Phiếu đánh giá (Reviews & Goals) ───────────────────────────────────
    getReviews: builder.query<ApiResponse<PageData<PerformanceReviewDto>>, PerformanceReviewFilters>({
      query: (params) => {
        const { page, size, cycleId, departmentId, employeeId, status, search, sortBy, direction } = params;
        const queryParams: Record<string, any> = {
          page: page && page > 0 ? page - 1 : 0,
          size: size || 10,
        };
        if (search) queryParams.search = search;
        if (cycleId && cycleId !== "ALL") queryParams.cycleId = cycleId;
        if (departmentId && departmentId !== "ALL") queryParams.departmentId = departmentId;
        if (employeeId) queryParams.employeeId = employeeId;
        if (status && status !== "ALL") queryParams.status = status;
        if (sortBy) queryParams.sortBy = sortBy;
        if (direction) queryParams.direction = direction;

        return {
          url: "/performance-reviews",
          method: "GET",
          params: queryParams,
        };
      },
      providesTags: (result) =>
        result?.data?.items
          ? [
              ...result.data.items.map(({ id }) => ({ type: "PerformanceReview" as const, id })),
              { type: "PerformanceReview", id: "LIST" },
            ]
          : [{ type: "PerformanceReview", id: "LIST" }],
    }),

    getReviewDetail: builder.query<ApiResponse<PerformanceReviewDetailDto>, string>({
      query: (reviewId) => ({
        url: `/performance-reviews/${reviewId}`,
        method: "GET",
      }),
      providesTags: (_res, _err, reviewId) => [
        { type: "PerformanceReview", id: reviewId },
        { type: "PerformanceGoal", id: `REVIEW-${reviewId}` },
      ],
    }),

    initializeReviews: builder.mutation<
      ApiResponse<void>,
      { cycleId: string; body: InitializeReviewsPayload }
    >({
      query: ({ cycleId, body }) => ({
        url: `/performance-cycles/${cycleId}/reviews`,
        method: "POST",
        body,
      }),
      invalidatesTags: [
        { type: "PerformanceReview", id: "LIST" },
        { type: "PerformanceCycle", id: "LIST" },
      ],
    }),

    addGoal: builder.mutation<
      ApiResponse<PerformanceGoalDto>,
      { reviewId: string; body: CreateGoalPayload }
    >({
      query: ({ reviewId, body }) => ({
        url: `/performance-reviews/${reviewId}/goals`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_res, _err, { reviewId }) => [
        { type: "PerformanceReview", id: reviewId },
        { type: "PerformanceGoal", id: `REVIEW-${reviewId}` },
        { type: "PerformanceReview", id: "LIST" },
      ],
    }),

    updateGoal: builder.mutation<
      ApiResponse<PerformanceGoalDto>,
      { goalId: string; reviewId: string; body: UpdateGoalPayload }
    >({
      query: ({ goalId, body }) => ({
        url: `/performance-goals/${goalId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_res, _err, { reviewId }) => [
        { type: "PerformanceReview", id: reviewId },
        { type: "PerformanceGoal", id: `REVIEW-${reviewId}` },
        { type: "PerformanceReview", id: "LIST" },
      ],
    }),

    deleteGoal: builder.mutation<
      ApiResponse<void>,
      { goalId: string; reviewId: string }
    >({
      query: ({ goalId }) => ({
        url: `/performance-goals/${goalId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_res, _err, { reviewId }) => [
        { type: "PerformanceReview", id: reviewId },
        { type: "PerformanceGoal", id: `REVIEW-${reviewId}` },
        { type: "PerformanceReview", id: "LIST" },
      ],
    }),

    updateGoalStatus: builder.mutation<
      ApiResponse<PerformanceGoalDto>,
      { goalId: string; reviewId: string; body: UpdateGoalStatusPayload }
    >({
      query: ({ goalId, body }) => ({
        url: `/performance-goals/${goalId}/status`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_res, _err, { reviewId }) => [
        { type: "PerformanceReview", id: reviewId },
        { type: "PerformanceGoal", id: `REVIEW-${reviewId}` },
      ],
    }),

    saveManagerAssessment: builder.mutation<
      ApiResponse<PerformanceReviewDetailDto>,
      { reviewId: string; body: ManagerAssessmentPayload }
    >({
      query: ({ reviewId, body }) => ({
        url: `/performance-reviews/${reviewId}/manager-assessment`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_res, _err, { reviewId }) => [
        { type: "PerformanceReview", id: reviewId },
        { type: "PerformanceReview", id: "LIST" },
      ],
    }),

    submitManagerAssessment: builder.mutation<
      ApiResponse<PerformanceReviewDetailDto>,
      string
    >({
      query: (reviewId) => ({
        url: `/performance-reviews/${reviewId}/manager-assessment/submit`,
        method: "POST",
      }),
      invalidatesTags: (_res, _err, reviewId) => [
        { type: "PerformanceReview", id: reviewId },
        { type: "PerformanceReview", id: "LIST" },
      ],
    }),

    getScorePreview: builder.query<ApiResponse<ScorePreviewDto>, string>({
      query: (reviewId) => ({
        url: `/performance-reviews/${reviewId}/score-preview`,
        method: "GET",
      }),
    }),

    finalizeReview: builder.mutation<ApiResponse<PerformanceReviewDetailDto>, string>({
      query: (reviewId) => ({
        url: `/performance-reviews/${reviewId}/finalize`,
        method: "POST",
      }),
      invalidatesTags: (_res, _err, reviewId) => [
        { type: "PerformanceReview", id: reviewId },
        { type: "PerformanceReview", id: "LIST" },
        { type: "PerformanceCycle", id: "LIST" },
      ],
    }),

    // ── ESS (Employee Self-Service) ──────────────────────────────────────────
    getMyReviews: builder.query<ApiResponse<PerformanceReviewDto[]>, void>({
      query: () => ({
        url: "/me/performance-reviews",
        method: "GET",
      }),
      providesTags: [{ type: "PerformanceReview", id: "MY_LIST" }],
    }),

    saveSelfAssessment: builder.mutation<
      ApiResponse<PerformanceReviewDetailDto>,
      { reviewId: string; body: any }
    >({
      query: ({ reviewId, body }) => ({
        url: `/performance-reviews/${reviewId}/self-assessment`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_res, _err, { reviewId }) => [
        { type: "PerformanceReview", id: reviewId },
        { type: "PerformanceReview", id: "MY_LIST" },
      ],
    }),

    submitSelfAssessment: builder.mutation<
      ApiResponse<PerformanceReviewDetailDto>,
      string
    >({
      query: (reviewId) => ({
        url: `/performance-reviews/${reviewId}/self-assessment/submit`,
        method: "POST",
      }),
      invalidatesTags: (_res, _err, reviewId) => [
        { type: "PerformanceReview", id: reviewId },
        { type: "PerformanceReview", id: "MY_LIST" },
      ],
    }),
  }),
});

export const {
  useGetCyclesQuery,
  useGetCycleByIdQuery,
  useCreateCycleMutation,
  useUpdateCycleMutation,
  useDeleteCycleMutation,
  useActivateCycleMutation,
  useCloseCycleMutation,
  useGetCycleSummaryQuery,
  useGetKpisQuery,
  useGetKpiByIdQuery,
  useCreateKpiMutation,
  useUpdateKpiMutation,
  useDeleteKpiMutation,
  useGetReviewsQuery,
  useGetReviewDetailQuery,
  useInitializeReviewsMutation,
  useAddGoalMutation,
  useUpdateGoalMutation,
  useDeleteGoalMutation,
  useUpdateGoalStatusMutation,
  useSaveManagerAssessmentMutation,
  useSubmitManagerAssessmentMutation,
  useGetScorePreviewQuery,
  useLazyGetScorePreviewQuery,
  useFinalizeReviewMutation,
  useGetMyReviewsQuery,
  useSaveSelfAssessmentMutation,
  useSubmitSelfAssessmentMutation,
} = performanceApi;
