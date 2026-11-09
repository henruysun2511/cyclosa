import { baseApi } from "@/store/base-api-rtk";
import type { ApiResponse, PageData } from "@/types/api.types";
import type {
  CreateWorkflowDefinitionRequest,
  UpdateWorkflowDefinitionRequest,
  WorkflowDefinitionFilterRequest,
  WorkflowDefinitionResponse,
  WorkflowDefinitionDetailResponse,
  SubmitWorkflowRequest,
  ApproveStepRequest,
  RejectStepRequest,
  CancelWorkflowRequest,
  WorkflowInboxFilterRequest,
  WorkflowRequestResponse,
  WorkflowRequestDetailResponse,
  WorkflowStatsResponse,
  RequestType,
} from "../types/workflow.types";

export const workflowApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ── ĐỊNH NGHĨA QUY TRÌNH ────────────────────────────────────────────────
    getWorkflowDefinitions: builder.query<
      PageData<WorkflowDefinitionResponse>,
      WorkflowDefinitionFilterRequest
    >({
      query: (params) => ({
        url: "/api/v1/workflow-definitions",
        method: "GET",
        params,
      }),
      providesTags: (result) =>
        result?.items
          ? [
              ...result.items.map((item: WorkflowDefinitionResponse) => ({
                type: "WorkflowDefinition" as const,
                id: item.id,
              })),
              { type: "WorkflowDefinition", id: "LIST" },
            ]
          : [{ type: "WorkflowDefinition", id: "LIST" }],
    }),

    getWorkflowDefinitionById: builder.query<
      WorkflowDefinitionDetailResponse,
      string
    >({
      query: (id) => `/api/v1/workflow-definitions/${id}`,
      transformResponse: (
        res: ApiResponse<WorkflowDefinitionDetailResponse>
      ) => res.data,
      providesTags: (_res, _err, id) => [{ type: "WorkflowDefinition", id }],
    }),

    createWorkflowDefinition: builder.mutation<
      WorkflowDefinitionDetailResponse,
      CreateWorkflowDefinitionRequest
    >({
      query: (body) => ({
        url: "/api/v1/workflow-definitions",
        method: "POST",
        body,
      }),
      transformResponse: (
        res: ApiResponse<WorkflowDefinitionDetailResponse>
      ) => res.data,
      invalidatesTags: [
        { type: "WorkflowDefinition", id: "LIST" },
        { type: "WorkflowStats", id: "CURRENT" },
      ],
    }),

    updateWorkflowDefinition: builder.mutation<
      WorkflowDefinitionDetailResponse,
      { id: string; body: UpdateWorkflowDefinitionRequest }
    >({
      query: ({ id, body }) => ({
        url: `/api/v1/workflow-definitions/${id}`,
        method: "PUT",
        body,
      }),
      transformResponse: (
        res: ApiResponse<WorkflowDefinitionDetailResponse>
      ) => res.data,
      invalidatesTags: (_res, _err, { id }) => [
        { type: "WorkflowDefinition", id },
        { type: "WorkflowDefinition", id: "LIST" },
      ],
    }),

    toggleWorkflowDefinitionStatus: builder.mutation<
      WorkflowDefinitionResponse,
      string
    >({
      query: (id) => ({
        url: `/api/v1/workflow-definitions/${id}/toggle-status`,
        method: "PATCH",
      }),
      transformResponse: (
        res: ApiResponse<WorkflowDefinitionResponse>
      ) => res.data,
      invalidatesTags: (_res, _err, id) => [
        { type: "WorkflowDefinition", id },
        { type: "WorkflowDefinition", id: "LIST" },
      ],
    }),

    deleteWorkflowDefinition: builder.mutation<void, string>({
      query: (id) => ({
        url: `/api/v1/workflow-definitions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        { type: "WorkflowDefinition", id: "LIST" },
        { type: "WorkflowStats", id: "CURRENT" },
      ],
    }),

    // ── THỐNG KÊ DASHBOARD ──────────────────────────────────────────────────
    getWorkflowStats: builder.query<WorkflowStatsResponse, void>({
      query: () => "/api/v1/workflow-requests/stats",
      transformResponse: (res: ApiResponse<WorkflowStatsResponse>) => res.data,
      providesTags: [{ type: "WorkflowStats", id: "CURRENT" }],
    }),

    // ── HỘP THƯ PHÊ DUYỆT (INBOX / SUBMITTED / HISTORY) ─────────────────────
    getMyInbox: builder.query<
      PageData<WorkflowRequestResponse>,
      WorkflowInboxFilterRequest
    >({
      query: (params) => ({
        url: "/api/v1/workflow-requests/inbox",
        method: "GET",
        params,
      }),
      providesTags: [{ type: "WorkflowRequest", id: "INBOX" }],
    }),

    getMySubmitted: builder.query<
      PageData<WorkflowRequestResponse>,
      WorkflowInboxFilterRequest
    >({
      query: (params) => ({
        url: "/api/v1/workflow-requests/my-submitted",
        method: "GET",
        params,
      }),
      providesTags: [{ type: "WorkflowRequest", id: "SUBMITTED" }],
    }),

    getWorkflowHistory: builder.query<
      PageData<WorkflowRequestResponse>,
      WorkflowInboxFilterRequest
    >({
      query: (params) => ({
        url: "/api/v1/workflow-requests/history",
        method: "GET",
        params,
      }),
      providesTags: [{ type: "WorkflowRequest", id: "HISTORY" }],
    }),

    // ── CHI TIẾT VÀ TRA CỨU QUY TRÌNH ──────────────────────────────────────
    getWorkflowRequestDetail: builder.query<
      WorkflowRequestDetailResponse,
      string
    >({
      query: (id) => `/api/v1/workflow-requests/${id}`,
      transformResponse: (
        res: ApiResponse<WorkflowRequestDetailResponse>
      ) => res.data,
      providesTags: (_res, _err, id) => [{ type: "WorkflowRequest", id }],
    }),

    getWorkflowRequestByReference: builder.query<
      WorkflowRequestDetailResponse,
      { referenceId: string; requestType: RequestType }
    >({
      query: ({ referenceId, requestType }) => ({
        url: "/api/v1/workflow-requests/by-reference",
        method: "GET",
        params: { referenceId, requestType },
      }),
      transformResponse: (
        res: ApiResponse<WorkflowRequestDetailResponse>
      ) => res.data,
      providesTags: (_res, _err, { referenceId }) => [
        { type: "WorkflowRequest", id: referenceId },
      ],
    }),

    // ── HÀNH ĐỘNG PHÊ DUYỆT / TỪ CHỐI / HỦY ───────────────────────────────
    submitWorkflow: builder.mutation<
      WorkflowRequestDetailResponse,
      SubmitWorkflowRequest
    >({
      query: (body) => ({
        url: "/api/v1/workflow-requests/submit",
        method: "POST",
        body,
      }),
      transformResponse: (
        res: ApiResponse<WorkflowRequestDetailResponse>
      ) => res.data,
      invalidatesTags: [
        { type: "WorkflowRequest", id: "INBOX" },
        { type: "WorkflowRequest", id: "SUBMITTED" },
        { type: "WorkflowStats", id: "CURRENT" },
        { type: "Contract", id: "LIST" },
      ],
    }),

    approveWorkflowStep: builder.mutation<
      WorkflowRequestDetailResponse,
      { requestId: string; stepId: string; body: ApproveStepRequest }
    >({
      query: ({ requestId, stepId, body }) => ({
        url: `/api/v1/workflow-requests/${requestId}/steps/${stepId}/approve`,
        method: "POST",
        body,
      }),
      transformResponse: (
        res: ApiResponse<WorkflowRequestDetailResponse>
      ) => res.data,
      invalidatesTags: (_res, _err, { requestId }) => [
        { type: "WorkflowRequest", id: requestId },
        { type: "WorkflowRequest", id: "INBOX" },
        { type: "WorkflowRequest", id: "HISTORY" },
        { type: "WorkflowStats", id: "CURRENT" },
        { type: "Contract", id: "LIST" },
      ],
    }),

    rejectWorkflowStep: builder.mutation<
      WorkflowRequestDetailResponse,
      { requestId: string; stepId: string; body: RejectStepRequest }
    >({
      query: ({ requestId, stepId, body }) => ({
        url: `/api/v1/workflow-requests/${requestId}/steps/${stepId}/reject`,
        method: "POST",
        body,
      }),
      transformResponse: (
        res: ApiResponse<WorkflowRequestDetailResponse>
      ) => res.data,
      invalidatesTags: (_res, _err, { requestId }) => [
        { type: "WorkflowRequest", id: requestId },
        { type: "WorkflowRequest", id: "INBOX" },
        { type: "WorkflowRequest", id: "HISTORY" },
        { type: "WorkflowStats", id: "CURRENT" },
        { type: "Contract", id: "LIST" },
      ],
    }),

    cancelWorkflowRequest: builder.mutation<
      void,
      { requestId: string; body: CancelWorkflowRequest }
    >({
      query: ({ requestId, body }) => ({
        url: `/api/v1/workflow-requests/${requestId}/cancel`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_res, _err, { requestId }) => [
        { type: "WorkflowRequest", id: requestId },
        { type: "WorkflowRequest", id: "INBOX" },
        { type: "WorkflowRequest", id: "SUBMITTED" },
        { type: "WorkflowStats", id: "CURRENT" },
        { type: "Contract", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetWorkflowDefinitionsQuery,
  useGetWorkflowDefinitionByIdQuery,
  useCreateWorkflowDefinitionMutation,
  useUpdateWorkflowDefinitionMutation,
  useToggleWorkflowDefinitionStatusMutation,
  useDeleteWorkflowDefinitionMutation,
  useGetWorkflowStatsQuery,
  useGetMyInboxQuery,
  useGetMySubmittedQuery,
  useGetWorkflowHistoryQuery,
  useGetWorkflowRequestDetailQuery,
  useGetWorkflowRequestByReferenceQuery,
  useSubmitWorkflowMutation,
  useApproveWorkflowStepMutation,
  useRejectWorkflowStepMutation,
  useCancelWorkflowRequestMutation,
} = workflowApi;

