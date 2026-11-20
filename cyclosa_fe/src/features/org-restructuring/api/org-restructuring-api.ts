import { baseApi } from "@/store/base-api-rtk";
import type { ApiResponse, PageData } from "@/types/api.types";
import type {
  OrgScenarioFilterParams,
  OrgScenarioItem,
  OrgScenarioStatistics,
  ScenarioDepartmentItem,
  ScenarioDepartmentTreeNode,
  WhatIfImpactAnalysis,
  RestructureConflicts,
  RestructureDiff,
} from "../types/org-restructuring.types";
import type {
  CreateOrgScenarioFormValues,
  CreateScenarioDepartmentFormValues,
  MergeDepartmentsFormValues,
  RejectScenarioFormValues,
} from "../schemas/org-restructuring.schemas";

export const orgRestructureApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ── 1. Kịch bản tái cơ cấu (Scenarios) ──────────────────────────────────
    getScenarios: builder.query<PageData<OrgScenarioItem>, OrgScenarioFilterParams>({
      query: (params) => ({
        url: "/org-restructuring/scenarios",
        method: "GET",
        params,
      }),
      transformResponse: (response: ApiResponse<PageData<OrgScenarioItem>>) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({ type: "OrgScenario" as const, id })),
              { type: "OrgScenario", id: "LIST" },
            ]
          : [{ type: "OrgScenario", id: "LIST" }],
    }),

    getScenarioStatistics: builder.query<OrgScenarioStatistics, void>({
      query: () => ({
        url: "/org-restructuring/scenarios/statistics",
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<OrgScenarioStatistics>) => response.data,
      providesTags: [{ type: "OrgScenario", id: "STATS" }],
    }),

    getScenarioDetail: builder.query<OrgScenarioItem, string>({
      query: (id) => ({
        url: `/org-restructuring/scenarios/${id}`,
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<OrgScenarioItem>) => response.data,
      providesTags: (_result, _error, id) => [{ type: "OrgScenario", id }],
    }),

    createScenario: builder.mutation<OrgScenarioItem, CreateOrgScenarioFormValues>({
      query: (body) => ({
        url: "/org-restructuring/scenarios",
        method: "POST",
        body,
      }),
      invalidatesTags: [
        { type: "OrgScenario", id: "LIST" },
        { type: "OrgScenario", id: "STATS" },
      ],
    }),

    updateScenario: builder.mutation<
      OrgScenarioItem,
      { id: string; body: Partial<CreateOrgScenarioFormValues> }
    >({
      query: ({ id, body }) => ({
        url: `/org-restructuring/scenarios/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "OrgScenario", id },
        { type: "OrgScenario", id: "LIST" },
      ],
    }),

    deleteScenario: builder.mutation<void, string>({
      query: (id) => ({
        url: `/org-restructuring/scenarios/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        { type: "OrgScenario", id: "LIST" },
        { type: "OrgScenario", id: "STATS" },
      ],
    }),

    // ── 2. Cây sơ đồ tổ chức ảo (Sandbox Tree) ──────────────────────────────
    getScenarioTree: builder.query<ScenarioDepartmentTreeNode[], string>({
      query: (id) => ({
        url: `/org-restructuring/scenarios/${id}/tree`,
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<ScenarioDepartmentTreeNode[]>) => response.data,
      providesTags: (_result, _error, id) => [{ type: "OrgScenario", id: `TREE_${id}` }],
    }),

    createDepartment: builder.mutation<
      ScenarioDepartmentItem,
      { scenarioId: string; body: CreateScenarioDepartmentFormValues }
    >({
      query: ({ scenarioId, body }) => ({
        url: `/org-restructuring/scenarios/${scenarioId}/departments`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, { scenarioId }) => [
        { type: "OrgScenario", id: scenarioId },
        { type: "OrgScenario", id: `TREE_${scenarioId}` },
        { type: "OrgScenario", id: `IMPACT_${scenarioId}` },
        { type: "OrgScenario", id: `CONFLICT_${scenarioId}` },
      ],
    }),

    moveDepartment: builder.mutation<
      ScenarioDepartmentItem,
      { scenarioId: string; deptId: string; newParentScenarioDeptId?: string }
    >({
      query: ({ scenarioId, deptId, newParentScenarioDeptId }) => ({
        url: `/org-restructuring/scenarios/${scenarioId}/departments/${deptId}/move`,
        method: "PUT",
        body: { newParentScenarioDeptId },
      }),
      invalidatesTags: (_result, _error, { scenarioId }) => [
        { type: "OrgScenario", id: scenarioId },
        { type: "OrgScenario", id: `TREE_${scenarioId}` },
        { type: "OrgScenario", id: `IMPACT_${scenarioId}` },
        { type: "OrgScenario", id: `CONFLICT_${scenarioId}` },
      ],
    }),

    mergeDepartments: builder.mutation<
      void,
      { scenarioId: string; body: MergeDepartmentsFormValues }
    >({
      query: ({ scenarioId, body }) => ({
        url: `/org-restructuring/scenarios/${scenarioId}/actions/merge`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, { scenarioId }) => [
        { type: "OrgScenario", id: scenarioId },
        { type: "OrgScenario", id: `TREE_${scenarioId}` },
        { type: "OrgScenario", id: `IMPACT_${scenarioId}` },
        { type: "OrgScenario", id: `CONFLICT_${scenarioId}` },
      ],
    }),

    splitDepartment: builder.mutation<
      void,
      {
        scenarioId: string;
        body: { sourceDepartmentId: string; newDepartments: CreateScenarioDepartmentFormValues[] };
      }
    >({
      query: ({ scenarioId, body }) => ({
        url: `/org-restructuring/scenarios/${scenarioId}/actions/split`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, { scenarioId }) => [
        { type: "OrgScenario", id: scenarioId },
        { type: "OrgScenario", id: `TREE_${scenarioId}` },
        { type: "OrgScenario", id: `IMPACT_${scenarioId}` },
        { type: "OrgScenario", id: `CONFLICT_${scenarioId}` },
      ],
    }),

    dissolveDepartment: builder.mutation<void, { scenarioId: string; deptId: string }>({
      query: ({ scenarioId, deptId }) => ({
        url: `/org-restructuring/scenarios/${scenarioId}/departments/${deptId}/dissolve`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, { scenarioId }) => [
        { type: "OrgScenario", id: scenarioId },
        { type: "OrgScenario", id: `TREE_${scenarioId}` },
        { type: "OrgScenario", id: `IMPACT_${scenarioId}` },
        { type: "OrgScenario", id: `CONFLICT_${scenarioId}` },
      ],
    }),

    // ── 3. Phân tích What-If, Xung đột & Diff ──────────────────────────────
    getWhatIfImpact: builder.query<WhatIfImpactAnalysis, string>({
      query: (id) => ({
        url: `/org-restructuring/scenarios/${id}/impact-analysis`,
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<WhatIfImpactAnalysis>) => response.data,
      providesTags: (_result, _error, id) => [{ type: "OrgScenario", id: `IMPACT_${id}` }],
    }),

    getConflicts: builder.query<RestructureConflicts, string>({
      query: (id) => ({
        url: `/org-restructuring/scenarios/${id}/conflicts`,
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<RestructureConflicts>) => response.data,
      providesTags: (_result, _error, id) => [{ type: "OrgScenario", id: `CONFLICT_${id}` }],
    }),

    getDiff: builder.query<RestructureDiff, string>({
      query: (id) => ({
        url: `/org-restructuring/scenarios/${id}/diff`,
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<RestructureDiff>) => response.data,
      providesTags: (_result, _error, id) => [{ type: "OrgScenario", id: `DIFF_${id}` }],
    }),

    // ── 4. Lifecycle & Phê duyệt ────────────────────────────────────────────
    submitScenario: builder.mutation<OrgScenarioItem, string>({
      query: (id) => ({
        url: `/org-restructuring/scenarios/${id}/submit`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "OrgScenario", id },
        { type: "OrgScenario", id: "LIST" },
        { type: "OrgScenario", id: "STATS" },
      ],
    }),

    approveScenario: builder.mutation<OrgScenarioItem, string>({
      query: (id) => ({
        url: `/org-restructuring/scenarios/${id}/approve`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "OrgScenario", id },
        { type: "OrgScenario", id: "LIST" },
        { type: "OrgScenario", id: "STATS" },
      ],
    }),

    rejectScenario: builder.mutation<OrgScenarioItem, { id: string; body: RejectScenarioFormValues }>({
      query: ({ id, body }) => ({
        url: `/org-restructuring/scenarios/${id}/reject`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "OrgScenario", id },
        { type: "OrgScenario", id: "LIST" },
        { type: "OrgScenario", id: "STATS" },
      ],
    }),

    executeScenario: builder.mutation<OrgScenarioItem, string>({
      query: (id) => ({
        url: `/org-restructuring/scenarios/${id}/execute`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "OrgScenario", id },
        { type: "OrgScenario", id: "LIST" },
        { type: "OrgScenario", id: "STATS" },
      ],
    }),
  }),
});

export const {
  useGetScenariosQuery,
  useGetScenarioStatisticsQuery,
  useGetScenarioDetailQuery,
  useCreateScenarioMutation,
  useUpdateScenarioMutation,
  useDeleteScenarioMutation,
  useGetScenarioTreeQuery,
  useCreateDepartmentMutation,
  useMoveDepartmentMutation,
  useMergeDepartmentsMutation,
  useSplitDepartmentMutation,
  useDissolveDepartmentMutation,
  useGetWhatIfImpactQuery,
  useGetConflictsQuery,
  useGetDiffQuery,
  useSubmitScenarioMutation,
  useApproveScenarioMutation,
  useRejectScenarioMutation,
  useExecuteScenarioMutation,
} = orgRestructureApi;
