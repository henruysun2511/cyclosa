import { baseApi } from "@/store/base-api-rtk";
import type { ApiResponse, PageData } from "@/types/api.types";
import type {
  RewardDecision,
  CreateRewardDecisionRequest,
  UpdateRewardDecisionRequest,
  RewardDecisionFilter,
  DisciplineCase,
  DisciplineCaseDetail,
  DisciplineEligibility,
  CreateDisciplineCaseRequest,
  UpdateDisciplineCaseRequest,
  UpdateParticipantsRequest,
  AddEvidenceRequest,
  DecideDisciplineRequest,
  DisciplineCaseFilter,
  DisciplineParticipant,
  DisciplineEvidence,
  Complaint,
  CreateComplaintRequest,
  AssignComplaintRequest,
  ResolveComplaintRequest,
  ComplaintFilter,
} from "../types/reward.types";

export const rewardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ── REWARD DECISIONS ──
    getRewardDecisions: builder.query<
      ApiResponse<PageData<RewardDecision>>,
      RewardDecisionFilter | void
    >({
      query: (filter) => ({
        url: "/reward-decisions",
        params: (filter as Record<string, unknown>) || {},
      }),
      providesTags: (result) =>
        result?.data?.items
          ? [
              ...result.data.items.map((item: RewardDecision) => ({
                type: "Reward" as const,
                id: item.id,
              })),
              { type: "Reward", id: "LIST" },
            ]
          : [{ type: "Reward", id: "LIST" }],
    }),

    getRewardDecisionById: builder.query<ApiResponse<RewardDecision>, string>({
      query: (id) => `/reward-decisions/${id}`,
      providesTags: (_res, _err, id) => [{ type: "Reward", id }],
    }),

    createRewardDecision: builder.mutation<
      ApiResponse<RewardDecision>,
      CreateRewardDecisionRequest
    >({
      query: (body) => ({
        url: "/reward-decisions",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Reward", id: "LIST" }],
    }),

    updateRewardDecision: builder.mutation<
      ApiResponse<RewardDecision>,
      { id: string; body: UpdateRewardDecisionRequest }
    >({
      query: ({ id, body }) => ({
        url: `/reward-decisions/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_res, _err, { id }) => [
        { type: "Reward", id },
        { type: "Reward", id: "LIST" },
      ],
    }),

    deleteRewardDecision: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/reward-decisions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Reward", id: "LIST" }],
    }),

    // ── DISCIPLINE CASES ──
    getDisciplineCases: builder.query<
      ApiResponse<PageData<DisciplineCase>>,
      DisciplineCaseFilter | void
    >({
      query: (filter) => ({
        url: "/discipline-cases",
        params: (filter as Record<string, unknown>) || {},
      }),
      providesTags: (result) =>
        result?.data?.items
          ? [
              ...result.data.items.map((item: DisciplineCase) => ({
                type: "Discipline" as const,
                id: item.id,
              })),
              { type: "Discipline", id: "LIST" },
            ]
          : [{ type: "Discipline", id: "LIST" }],
    }),

    getDisciplineCaseById: builder.query<
      ApiResponse<DisciplineCaseDetail>,
      string
    >({
      query: (id) => `/discipline-cases/${id}`,
      providesTags: (_res, _err, id) => [{ type: "Discipline", id }],
    }),

    getDisciplineEligibility: builder.query<
      ApiResponse<DisciplineEligibility>,
      string
    >({
      query: (id) => `/discipline-cases/${id}/eligibility`,
      providesTags: (_res, _err, id) => [{ type: "Discipline", id: `ELIGIBILITY_${id}` }],
    }),

    createDisciplineCase: builder.mutation<
      ApiResponse<DisciplineCase>,
      CreateDisciplineCaseRequest
    >({
      query: (body) => ({
        url: "/discipline-cases",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Discipline", id: "LIST" }],
    }),

    updateDisciplineCase: builder.mutation<
      ApiResponse<DisciplineCase>,
      { id: string; body: UpdateDisciplineCaseRequest }
    >({
      query: ({ id, body }) => ({
        url: `/discipline-cases/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_res, _err, { id }) => [
        { type: "Discipline", id },
        { type: "Discipline", id: "LIST" },
      ],
    }),

    updateDisciplineParticipants: builder.mutation<
      ApiResponse<DisciplineParticipant[]>,
      { id: string; body: UpdateParticipantsRequest }
    >({
      query: ({ id, body }) => ({
        url: `/discipline-cases/${id}/participants`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_res, _err, { id }) => [{ type: "Discipline", id }],
    }),

    getDisciplineEvidences: builder.query<
      ApiResponse<DisciplineEvidence[]>,
      string
    >({
      query: (id) => `/discipline-cases/${id}/evidences`,
      providesTags: (_res, _err, id) => [{ type: "Discipline", id: `EVIDENCE_${id}` }],
    }),

    addDisciplineEvidence: builder.mutation<
      ApiResponse<DisciplineEvidence>,
      { id: string; body: AddEvidenceRequest }
    >({
      query: ({ id, body }) => ({
        url: `/discipline-cases/${id}/evidences`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_res, _err, { id }) => [
        { type: "Discipline", id },
        { type: "Discipline", id: `EVIDENCE_${id}` },
      ],
    }),

    deleteDisciplineEvidence: builder.mutation<
      ApiResponse<void>,
      { caseId: string; evidenceId: string }
    >({
      query: ({ evidenceId }) => ({
        url: `/discipline-evidences/${evidenceId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_res, _err, { caseId }) => [
        { type: "Discipline", id: caseId },
        { type: "Discipline", id: `EVIDENCE_${caseId}` },
      ],
    }),

    decideDiscipline: builder.mutation<
      ApiResponse<DisciplineCase>,
      { id: string; body: DecideDisciplineRequest }
    >({
      query: ({ id, body }) => ({
        url: `/discipline-cases/${id}/decide`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_res, _err, { id }) => [
        { type: "Discipline", id },
        { type: "Discipline", id: "LIST" },
      ],
    }),

    submitDismissal: builder.mutation<ApiResponse<DisciplineCase>, string>({
      query: (id) => ({
        url: `/discipline-cases/${id}/submit-dismissal`,
        method: "POST",
      }),
      invalidatesTags: (_res, _err, id) => [
        { type: "Discipline", id },
        { type: "Discipline", id: "LIST" },
      ],
    }),

    // ── COMPLAINTS ──
    getComplaints: builder.query<
      ApiResponse<PageData<Complaint>>,
      ComplaintFilter | void
    >({
      query: (filter) => ({
        url: "/complaints",
        params: (filter as Record<string, unknown>) || {},
      }),
      providesTags: (result) =>
        result?.data?.items
          ? [
              ...result.data.items.map((item: Complaint) => ({
                type: "Complaint" as const,
                id: item.id,
              })),
              { type: "Complaint", id: "LIST" },
            ]
          : [{ type: "Complaint", id: "LIST" }],
    }),

    getComplaintById: builder.query<ApiResponse<Complaint>, string>({
      query: (id) => `/complaints/${id}`,
      providesTags: (_res, _err, id) => [{ type: "Complaint", id }],
    }),

    assignComplaintHandler: builder.mutation<
      ApiResponse<Complaint>,
      { id: string; body: AssignComplaintRequest }
    >({
      query: ({ id, body }) => ({
        url: `/complaints/${id}/assign`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_res, _err, { id }) => [
        { type: "Complaint", id },
        { type: "Complaint", id: "LIST" },
      ],
    }),

    startComplaintInvestigation: builder.mutation<
      ApiResponse<Complaint>,
      string
    >({
      query: (id) => ({
        url: `/complaints/${id}/start-investigation`,
        method: "POST",
      }),
      invalidatesTags: (_res, _err, id) => [
        { type: "Complaint", id },
        { type: "Complaint", id: "LIST" },
      ],
    }),

    resolveComplaint: builder.mutation<
      ApiResponse<Complaint>,
      { id: string; body: ResolveComplaintRequest }
    >({
      query: ({ id, body }) => ({
        url: `/complaints/${id}/resolve`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_res, _err, { id }) => [
        { type: "Complaint", id },
        { type: "Complaint", id: "LIST" },
      ],
    }),

    closeComplaint: builder.mutation<ApiResponse<Complaint>, string>({
      query: (id) => ({
        url: `/complaints/${id}/close`,
        method: "POST",
      }),
      invalidatesTags: (_res, _err, id) => [
        { type: "Complaint", id },
        { type: "Complaint", id: "LIST" },
      ],
    }),

    // ── ESS (SELF-SERVICE) ──
    getMyRewardDecisions: builder.query<ApiResponse<RewardDecision[]>, void>({
      query: () => "/me/reward-decisions",
      providesTags: [{ type: "Reward", id: "ME" }],
    }),

    getMyDisciplineCases: builder.query<ApiResponse<DisciplineCase[]>, void>({
      query: () => "/me/discipline-cases",
      providesTags: [{ type: "Discipline", id: "ME" }],
    }),

    createMyComplaint: builder.mutation<
      ApiResponse<Complaint>,
      CreateComplaintRequest
    >({
      query: (body) => ({
        url: "/complaints",
        method: "POST",
        body,
      }),
      invalidatesTags: [
        { type: "Complaint", id: "ME" },
        { type: "Complaint", id: "LIST" },
      ],
    }),

    getMyComplaints: builder.query<
      ApiResponse<PageData<Complaint>>,
      { page?: number; size?: number } | void
    >({
      query: (params) => ({
        url: "/me/complaints",
        params: (params as Record<string, unknown>) || {},
      }),
      providesTags: [{ type: "Complaint", id: "ME" }],
    }),
  }),
});

export const {
  useGetRewardDecisionsQuery,
  useGetRewardDecisionByIdQuery,
  useCreateRewardDecisionMutation,
  useUpdateRewardDecisionMutation,
  useDeleteRewardDecisionMutation,
  useGetDisciplineCasesQuery,
  useGetDisciplineCaseByIdQuery,
  useGetDisciplineEligibilityQuery,
  useCreateDisciplineCaseMutation,
  useUpdateDisciplineCaseMutation,
  useUpdateDisciplineParticipantsMutation,
  useGetDisciplineEvidencesQuery,
  useAddDisciplineEvidenceMutation,
  useDeleteDisciplineEvidenceMutation,
  useDecideDisciplineMutation,
  useSubmitDismissalMutation,
  useGetComplaintsQuery,
  useGetComplaintByIdQuery,
  useAssignComplaintHandlerMutation,
  useStartComplaintInvestigationMutation,
  useResolveComplaintMutation,
  useCloseComplaintMutation,
  useGetMyRewardDecisionsQuery,
  useGetMyDisciplineCasesQuery,
  useCreateMyComplaintMutation,
  useGetMyComplaintsQuery,
} = rewardApi;
