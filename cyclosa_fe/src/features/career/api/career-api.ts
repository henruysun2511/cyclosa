import { baseApi } from "@/store/base-api-rtk";
import type { ApiResponse, PageData } from "@/types/api.types";
import type {
  CareerGraphResponse,
  CareerPathFilterParams,
  CareerPathItem,
  CareerStatisticsResponse,
  NineBoxGridResponse,
  SuccessionCandidateItem,
  SuccessionPlanDetail,
  SuccessionPlanFilterParams,
  SuccessionPlanItem,
  SuccessionSuggestionItem,
  TalentPoolFilterParams,
  TalentPoolItem,
} from "../types/career.types";

export const careerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ── Career Paths ────────────────────────────────────────────────────────
    getCareerPaths: builder.query<PageData<CareerPathItem>, CareerPathFilterParams>({
      query: (params) => ({
        url: "/career-paths",
        method: "GET",
        params,
      }),
      transformResponse: (response: ApiResponse<PageData<CareerPathItem>>) =>
        response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({
                type: "CareerPath" as const,
                id,
              })),
              { type: "CareerPath", id: "LIST" },
            ]
          : [{ type: "CareerPath", id: "LIST" }],
    }),

    getCareerStatistics: builder.query<CareerStatisticsResponse, void>({
      query: () => ({
        url: "/career-paths/statistics",
        method: "GET",
      }),
      transformResponse: (
        response: ApiResponse<CareerStatisticsResponse>
      ) => response.data,
      providesTags: [{ type: "CareerPath", id: "STATS" }],
    }),

    getCareerGraph: builder.query<CareerGraphResponse, { fromJobTitleId?: string }>({
      query: (params) => ({
        url: "/career-paths/graph",
        method: "GET",
        params,
      }),
      transformResponse: (response: ApiResponse<CareerGraphResponse>) =>
        response.data,
      providesTags: [{ type: "CareerPath", id: "GRAPH" }],
    }),

    createCareerPath: builder.mutation<
      CareerPathItem,
      {
        fromJobTitleId: string;
        toJobTitleId: string;
        minExperienceYears: number;
        requirements?: string;
      }
    >({
      query: (body) => ({
        url: "/career-paths",
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiResponse<CareerPathItem>) =>
        response.data,
      invalidatesTags: [
        { type: "CareerPath", id: "LIST" },
        { type: "CareerPath", id: "GRAPH" },
      ],
    }),

    updateCareerPath: builder.mutation<
      CareerPathItem,
      {
        id: string;
        minExperienceYears: number;
        requirements?: string;
      }
    >({
      query: ({ id, ...body }) => ({
        url: `/career-paths/${id}`,
        method: "PUT",
        body,
      }),
      transformResponse: (response: ApiResponse<CareerPathItem>) =>
        response.data,
      invalidatesTags: (result, error, { id }) => [
        { type: "CareerPath", id },
        { type: "CareerPath", id: "LIST" },
        { type: "CareerPath", id: "GRAPH" },
      ],
    }),

    deleteCareerPath: builder.mutation<void, string>({
      query: (id) => ({
        url: `/career-paths/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        { type: "CareerPath", id: "LIST" },
        { type: "CareerPath", id: "GRAPH" },
      ],
    }),

    // ── Succession Plans ────────────────────────────────────────────────────
    getSuccessionPlans: builder.query<
      PageData<SuccessionPlanItem>,
      SuccessionPlanFilterParams
    >({
      query: (params) => ({
        url: "/succession-plans",
        method: "GET",
        params: {
          ...params,
          riskLevel: params.riskLevel === "ALL" ? undefined : params.riskLevel,
        },
      }),
      transformResponse: (response: ApiResponse<PageData<SuccessionPlanItem>>) =>
        response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({
                type: "SuccessionPlan" as const,
                id,
              })),
              { type: "SuccessionPlan", id: "LIST" },
            ]
          : [{ type: "SuccessionPlan", id: "LIST" }],
    }),

    getSuccessionPlanById: builder.query<SuccessionPlanDetail, string>({
      query: (id) => ({
        url: `/succession-plans/${id}`,
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<SuccessionPlanDetail>) =>
        response.data,
      providesTags: (result, error, id) => [{ type: "SuccessionPlan", id }],
    }),

    createSuccessionPlan: builder.mutation<
      SuccessionPlanItem,
      {
        departmentId: string;
        jobTitleId: string;
        riskLevel: string;
        reviewDate: string;
      }
    >({
      query: (body) => ({
        url: "/succession-plans",
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiResponse<SuccessionPlanItem>) =>
        response.data,
      invalidatesTags: [
        { type: "SuccessionPlan", id: "LIST" },
        { type: "CareerPath", id: "STATS" },
      ],
    }),

    updateSuccessionPlan: builder.mutation<
      SuccessionPlanItem,
      {
        id: string;
        riskLevel: string;
        reviewDate: string;
      }
    >({
      query: ({ id, ...body }) => ({
        url: `/succession-plans/${id}`,
        method: "PUT",
        body,
      }),
      transformResponse: (response: ApiResponse<SuccessionPlanItem>) =>
        response.data,
      invalidatesTags: (result, error, { id }) => [
        { type: "SuccessionPlan", id },
        { type: "SuccessionPlan", id: "LIST" },
        { type: "CareerPath", id: "STATS" },
      ],
    }),

    deleteSuccessionPlan: builder.mutation<void, string>({
      query: (id) => ({
        url: `/succession-plans/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        { type: "SuccessionPlan", id: "LIST" },
        { type: "CareerPath", id: "STATS" },
      ],
    }),

    addSuccessionCandidate: builder.mutation<
      SuccessionCandidateItem,
      {
        planId: string;
        employeeId: string;
        readiness: string;
        developmentNotes?: string;
      }
    >({
      query: ({ planId, ...body }) => ({
        url: `/succession-plans/${planId}/candidates`,
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiResponse<SuccessionCandidateItem>) =>
        response.data,
      invalidatesTags: (result, error, { planId }) => [
        { type: "SuccessionPlan", id: planId },
        { type: "SuccessionPlan", id: "LIST" },
        { type: "CareerPath", id: "STATS" },
      ],
    }),

    updateSuccessionCandidate: builder.mutation<
      SuccessionCandidateItem,
      {
        planId: string;
        employeeId: string;
        readiness: string;
        developmentNotes?: string;
      }
    >({
      query: ({ planId, employeeId, ...body }) => ({
        url: `/succession-plans/${planId}/candidates/${employeeId}`,
        method: "PUT",
        body,
      }),
      transformResponse: (response: ApiResponse<SuccessionCandidateItem>) =>
        response.data,
      invalidatesTags: (result, error, { planId }) => [
        { type: "SuccessionPlan", id: planId },
        { type: "SuccessionPlan", id: "LIST" },
        { type: "CareerPath", id: "STATS" },
      ],
    }),

    removeSuccessionCandidate: builder.mutation<
      void,
      { planId: string; employeeId: string }
    >({
      query: ({ planId, employeeId }) => ({
        url: `/succession-plans/${planId}/candidates/${employeeId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { planId }) => [
        { type: "SuccessionPlan", id: planId },
        { type: "SuccessionPlan", id: "LIST" },
        { type: "CareerPath", id: "STATS" },
      ],
    }),

    getSuccessionSuggestions: builder.query<
      SuccessionSuggestionItem[],
      string
    >({
      query: (planId) => ({
        url: `/succession-plans/${planId}/suggestions`,
        method: "GET",
      }),
      transformResponse: (
        response: ApiResponse<SuccessionSuggestionItem[]>
      ) => response.data,
    }),

    // ── Internal Talent Pool ────────────────────────────────────────────────
    getTalentPool: builder.query<
      PageData<TalentPoolItem>,
      TalentPoolFilterParams
    >({
      query: (params) => ({
        url: "/internal-talent-pool",
        method: "GET",
        params: {
          ...params,
          tag: params.tag === "ALL" ? undefined : params.tag,
        },
      }),
      transformResponse: (response: ApiResponse<PageData<TalentPoolItem>>) =>
        response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({
                type: "TalentPool" as const,
                id,
              })),
              { type: "TalentPool", id: "LIST" },
            ]
          : [{ type: "TalentPool", id: "LIST" }],
    }),

    getNineBoxGrid: builder.query<NineBoxGridResponse, void>({
      query: () => ({
        url: "/internal-talent-pool/nine-box-grid",
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<NineBoxGridResponse>) =>
        response.data,
      providesTags: [{ type: "TalentPool", id: "GRID" }],
    }),

    addTalentPoolEntry: builder.mutation<
      TalentPoolItem,
      {
        employeeId: string;
        tag: string;
        reason: string;
      }
    >({
      query: (body) => ({
        url: "/internal-talent-pool",
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiResponse<TalentPoolItem>) =>
        response.data,
      invalidatesTags: [
        { type: "TalentPool", id: "LIST" },
        { type: "TalentPool", id: "GRID" },
        { type: "CareerPath", id: "STATS" },
      ],
    }),

    removeTalentPoolEntry: builder.mutation<void, string>({
      query: (id) => ({
        url: `/internal-talent-pool/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        { type: "TalentPool", id: "LIST" },
        { type: "TalentPool", id: "GRID" },
        { type: "CareerPath", id: "STATS" },
      ],
    }),
  }),
});

export const {
  useGetCareerPathsQuery,
  useGetCareerStatisticsQuery,
  useGetCareerGraphQuery,
  useCreateCareerPathMutation,
  useUpdateCareerPathMutation,
  useDeleteCareerPathMutation,
  useGetSuccessionPlansQuery,
  useGetSuccessionPlanByIdQuery,
  useCreateSuccessionPlanMutation,
  useUpdateSuccessionPlanMutation,
  useDeleteSuccessionPlanMutation,
  useAddSuccessionCandidateMutation,
  useUpdateSuccessionCandidateMutation,
  useRemoveSuccessionCandidateMutation,
  useGetSuccessionSuggestionsQuery,
  useGetTalentPoolQuery,
  useGetNineBoxGridQuery,
  useAddTalentPoolEntryMutation,
  useRemoveTalentPoolEntryMutation,
} = careerApi;
