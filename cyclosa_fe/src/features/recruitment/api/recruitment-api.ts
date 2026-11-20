import { baseApi } from "@/store/base-api-rtk";
import { buildQueryString } from "@/lib/utils";
import type { ApiResponse, PageData } from "@/types/api.types";
import type {
  RecruitmentRequestDto,
  CreateRecruitmentRequestPayload,
  UpdateRecruitmentRequestPayload,
  RecruitmentRequestFilterParams,
  JobOpeningDto,
  CreateJobOpeningPayload,
  UpdateJobOpeningPayload,
  JobOpeningFilterParams,
  RecruitmentChannelDto,
  JobPostingDto,
  PublishJobPostingPayload,
  CandidateDto,
  CreateCandidatePayload,
  UpdateCandidatePayload,
  CandidateFilterParams,
  CvParsedProfileResponse,
  ApplicationDto,
  CreateApplicationPayload,
  UpdateApplicationStagePayload,
  RejectApplicationPayload,
  ApplicationFilterParams,
  AiScreeningLogDto,
  InterviewDto,
  ScheduleInterviewPayload,
  RescheduleInterviewPayload,
  InterviewFilterParams,
  ScorecardDto,
  SubmitScorecardPayload,
  AiGeneratedQuestionDto,
  OfferDto,
  ConvertOfferToEmployeeResponse,
  CreateOfferPayload,
  OfferFilterParams,
  InternalOpportunityDto,
  CreateInternalOpportunityPayload,
  InternalOpportunityApplicationDto,
  ApplyInternalOpportunityPayload,
  PublicJobOpening,
  PublicApplyPayload,
} from "../types/recruitment.types";

export const recruitmentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ═══════════════════════════════════════════════════════════════════════════
    // 1. ĐỀ XUẤT TUYỂN DỤNG (RECRUITMENT REQUESTS)
    // ═══════════════════════════════════════════════════════════════════════════

    getRecruitmentRequests: builder.query<
      PageData<RecruitmentRequestDto>,
      RecruitmentRequestFilterParams
    >({
      query: (params = {}) => {
        const queryParams: Record<string, unknown> = {
          ...params,
          page: params.page ? Math.max(0, params.page - 1) : 0,
        };
        return {
          url: `/recruitment/requests?${buildQueryString(queryParams)}`,
          method: "GET",
        };
      },
      transformResponse: (res: ApiResponse<PageData<RecruitmentRequestDto>>) => res.data,
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({ type: "RecruitmentRequest" as const, id })),
              { type: "RecruitmentRequest", id: "LIST" },
            ]
          : [{ type: "RecruitmentRequest", id: "LIST" }],
    }),

    getRecruitmentRequestById: builder.query<RecruitmentRequestDto, string>({
      query: (id) => `/recruitment/requests/${id}`,
      transformResponse: (res: ApiResponse<RecruitmentRequestDto>) => res.data,
      providesTags: (_res, _err, id) => [{ type: "RecruitmentRequest", id }],
    }),

    createRecruitmentRequest: builder.mutation<RecruitmentRequestDto, CreateRecruitmentRequestPayload>({
      query: (body) => ({
        url: "/recruitment/requests",
        method: "POST",
        body,
      }),
      transformResponse: (res: ApiResponse<RecruitmentRequestDto>) => res.data,
      invalidatesTags: [{ type: "RecruitmentRequest", id: "LIST" }],
    }),

    updateRecruitmentRequest: builder.mutation<
      RecruitmentRequestDto,
      { id: string; body: UpdateRecruitmentRequestPayload }
    >({
      query: ({ id, body }) => ({
        url: `/recruitment/requests/${id}`,
        method: "PUT",
        body,
      }),
      transformResponse: (res: ApiResponse<RecruitmentRequestDto>) => res.data,
      invalidatesTags: (_res, _err, { id }) => [
        { type: "RecruitmentRequest", id },
        { type: "RecruitmentRequest", id: "LIST" },
      ],
    }),

    submitRecruitmentRequest: builder.mutation<RecruitmentRequestDto, string>({
      query: (id) => ({
        url: `/recruitment/requests/${id}/submit`,
        method: "POST",
      }),
      transformResponse: (res: ApiResponse<RecruitmentRequestDto>) => res.data,
      invalidatesTags: (_res, _err, id) => [
        { type: "RecruitmentRequest", id },
        { type: "RecruitmentRequest", id: "LIST" },
      ],
    }),

    approveRecruitmentRequest: builder.mutation<RecruitmentRequestDto, string>({
      query: (id) => ({
        url: `/recruitment/requests/${id}/approve`,
        method: "POST",
      }),
      transformResponse: (res: ApiResponse<RecruitmentRequestDto>) => res.data,
      invalidatesTags: (_res, _err, id) => [
        { type: "RecruitmentRequest", id },
        { type: "RecruitmentRequest", id: "LIST" },
        { type: "JobOpening", id: "LIST" },
      ],
    }),

    rejectRecruitmentRequest: builder.mutation<
      RecruitmentRequestDto,
      { id: string; reason: string }
    >({
      query: ({ id, reason }) => ({
        url: `/recruitment/requests/${id}/reject`,
        method: "POST",
        body: { reason },
      }),
      transformResponse: (res: ApiResponse<RecruitmentRequestDto>) => res.data,
      invalidatesTags: (_res, _err, { id }) => [
        { type: "RecruitmentRequest", id },
        { type: "RecruitmentRequest", id: "LIST" },
      ],
    }),

    deleteRecruitmentRequest: builder.mutation<void, string>({
      query: (id) => ({
        url: `/recruitment/requests/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "RecruitmentRequest", id: "LIST" }],
    }),

    // ═══════════════════════════════════════════════════════════════════════════
    // 2. VỊ TRÍ TUYỂN DỤNG (JOB OPENINGS & INTERVIEW ROUNDS)
    // ═══════════════════════════════════════════════════════════════════════════

    getJobOpenings: builder.query<PageData<JobOpeningDto>, JobOpeningFilterParams>({
      query: (params = {}) => {
        const queryParams: Record<string, unknown> = {
          ...params,
          page: params.page ? Math.max(0, params.page - 1) : 0,
        };
        return {
          url: `/recruitment/job-openings?${buildQueryString(queryParams)}`,
          method: "GET",
        };
      },
      transformResponse: (res: ApiResponse<PageData<JobOpeningDto>>) => res.data,
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({ type: "JobOpening" as const, id })),
              { type: "JobOpening", id: "LIST" },
            ]
          : [{ type: "JobOpening", id: "LIST" }],
    }),

    getJobOpeningById: builder.query<JobOpeningDto, string>({
      query: (id) => `/recruitment/job-openings/${id}`,
      transformResponse: (res: ApiResponse<JobOpeningDto>) => res.data,
      providesTags: (_res, _err, id) => [{ type: "JobOpening", id }],
    }),

    createJobOpening: builder.mutation<JobOpeningDto, CreateJobOpeningPayload>({
      query: (body) => ({
        url: "/recruitment/job-openings",
        method: "POST",
        body,
      }),
      transformResponse: (res: ApiResponse<JobOpeningDto>) => res.data,
      invalidatesTags: [{ type: "JobOpening", id: "LIST" }],
    }),

    updateJobOpening: builder.mutation<
      JobOpeningDto,
      { id: string; body: UpdateJobOpeningPayload }
    >({
      query: ({ id, body }) => ({
        url: `/recruitment/job-openings/${id}`,
        method: "PUT",
        body,
      }),
      transformResponse: (res: ApiResponse<JobOpeningDto>) => res.data,
      invalidatesTags: (_res, _err, { id }) => [
        { type: "JobOpening", id },
        { type: "JobOpening", id: "LIST" },
      ],
    }),

    publishJobOpening: builder.mutation<JobOpeningDto, string>({
      query: (id) => ({
        url: `/recruitment/job-openings/${id}/publish`,
        method: "POST",
      }),
      transformResponse: (res: ApiResponse<JobOpeningDto>) => res.data,
      invalidatesTags: (_res, _err, id) => [
        { type: "JobOpening", id },
        { type: "JobOpening", id: "LIST" },
      ],
    }),

    closeJobOpening: builder.mutation<JobOpeningDto, string>({
      query: (id) => ({
        url: `/recruitment/job-openings/${id}/close`,
        method: "POST",
      }),
      transformResponse: (res: ApiResponse<JobOpeningDto>) => res.data,
      invalidatesTags: (_res, _err, id) => [
        { type: "JobOpening", id },
        { type: "JobOpening", id: "LIST" },
      ],
    }),

    deleteJobOpening: builder.mutation<void, string>({
      query: (id) => ({
        url: `/recruitment/job-openings/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "JobOpening", id: "LIST" }],
    }),

    // ═══════════════════════════════════════════════════════════════════════════
    // 3. KÊNH TUYỂN DỤNG & TIN ĐĂNG (CHANNELS & POSTINGS)
    // ═══════════════════════════════════════════════════════════════════════════

    getRecruitmentChannels: builder.query<RecruitmentChannelDto[], void>({
      query: () => "/recruitment/channels",
      transformResponse: (res: ApiResponse<RecruitmentChannelDto[]>) => res.data,
      providesTags: [{ type: "RecruitmentChannel", id: "LIST" }],
    }),

    createRecruitmentChannel: builder.mutation<
      RecruitmentChannelDto,
      Partial<RecruitmentChannelDto>
    >({
      query: (body) => ({
        url: "/recruitment/channels",
        method: "POST",
        body,
      }),
      transformResponse: (res: ApiResponse<RecruitmentChannelDto>) => res.data,
      invalidatesTags: [{ type: "RecruitmentChannel", id: "LIST" }],
    }),

    publishJobPosting: builder.mutation<JobPostingDto, PublishJobPostingPayload>({
      query: (body) => ({
        url: "/recruitment/channels/postings",
        method: "POST",
        body,
      }),
      transformResponse: (res: ApiResponse<JobPostingDto>) => res.data,
      invalidatesTags: (_res, _err, { jobOpeningId }) => [
        { type: "JobOpening", id: jobOpeningId },
        { type: "RecruitmentChannel", id: "LIST" },
      ],
    }),

    getJobPostingsByJobOpening: builder.query<JobPostingDto[], string>({
      query: (jobOpeningId) => `/recruitment/channels/postings/job/${jobOpeningId}`,
      transformResponse: (res: ApiResponse<JobPostingDto[]>) => res.data,
      providesTags: (_res, _err, jobOpeningId) => [
        { type: "JobOpening", id: jobOpeningId },
      ],
    }),

    // ═══════════════════════════════════════════════════════════════════════════
    // 4. HỒ SƠ ỨNG VIÊN & AI CV PARSER (CANDIDATES)
    // ═══════════════════════════════════════════════════════════════════════════

    getCandidates: builder.query<PageData<CandidateDto>, CandidateFilterParams>({
      query: (params = {}) => {
        const queryParams: Record<string, unknown> = {
          ...params,
          page: params.page ? Math.max(0, params.page - 1) : 0,
        };
        return {
          url: `/recruitment/candidates?${buildQueryString(queryParams)}`,
          method: "GET",
        };
      },
      transformResponse: (res: ApiResponse<PageData<CandidateDto>>) => res.data,
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({ type: "Candidate" as const, id })),
              { type: "Candidate", id: "LIST" },
            ]
          : [{ type: "Candidate", id: "LIST" }],
    }),

    getCandidateById: builder.query<CandidateDto, string>({
      query: (id) => `/recruitment/candidates/${id}`,
      transformResponse: (res: ApiResponse<CandidateDto>) => res.data,
      providesTags: (_res, _err, id) => [{ type: "Candidate", id }],
    }),

    createCandidate: builder.mutation<CandidateDto, CreateCandidatePayload>({
      query: (body) => ({
        url: "/recruitment/candidates",
        method: "POST",
        body,
      }),
      transformResponse: (res: ApiResponse<CandidateDto>) => res.data,
      invalidatesTags: [{ type: "Candidate", id: "LIST" }],
    }),

    updateCandidate: builder.mutation<
      CandidateDto,
      { id: string; body: UpdateCandidatePayload }
    >({
      query: ({ id, body }) => ({
        url: `/recruitment/candidates/${id}`,
        method: "PUT",
        body,
      }),
      transformResponse: (res: ApiResponse<CandidateDto>) => res.data,
      invalidatesTags: (_res, _err, { id }) => [
        { type: "Candidate", id },
        { type: "Candidate", id: "LIST" },
      ],
    }),

    blacklistCandidate: builder.mutation<
      CandidateDto,
      { id: string; reason: string }
    >({
      query: ({ id, reason }) => ({
        url: `/recruitment/candidates/${id}/blacklist`,
        method: "POST",
        body: { reason },
      }),
      transformResponse: (res: ApiResponse<CandidateDto>) => res.data,
      invalidatesTags: (_res, _err, { id }) => [
        { type: "Candidate", id },
        { type: "Candidate", id: "LIST" },
        { type: "Application", id: "LIST" },
      ],
    }),

    unblacklistCandidate: builder.mutation<CandidateDto, string>({
      query: (id) => ({
        url: `/recruitment/candidates/${id}/unblacklist`,
        method: "POST",
      }),
      transformResponse: (res: ApiResponse<CandidateDto>) => res.data,
      invalidatesTags: (_res, _err, id) => [
        { type: "Candidate", id },
        { type: "Candidate", id: "LIST" },
      ],
    }),

    parseCvFile: builder.mutation<CvParsedProfileResponse, FormData>({
      query: (formData) => ({
        url: "/recruitment/candidates/parse-cv",
        method: "POST",
        body: formData,
      }),
      transformResponse: (res: ApiResponse<CvParsedProfileResponse>) => res.data,
    }),

    // ═══════════════════════════════════════════════════════════════════════════
    // 5. PHỄU ATS PIPELINE & SÀNG LỌC AI (APPLICATIONS)
    // ═══════════════════════════════════════════════════════════════════════════

    getApplications: builder.query<PageData<ApplicationDto>, ApplicationFilterParams>({
      query: (params = {}) => {
        const queryParams: Record<string, unknown> = {
          ...params,
          page: params.page ? Math.max(0, params.page - 1) : 0,
        };
        return {
          url: `/recruitment/applications?${buildQueryString(queryParams)}`,
          method: "GET",
        };
      },
      transformResponse: (res: ApiResponse<PageData<ApplicationDto>>) => res.data,
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({ type: "Application" as const, id })),
              { type: "Application", id: "LIST" },
            ]
          : [{ type: "Application", id: "LIST" }],
    }),

    getApplicationById: builder.query<ApplicationDto, string>({
      query: (id) => `/recruitment/applications/${id}`,
      transformResponse: (res: ApiResponse<ApplicationDto>) => res.data,
      providesTags: (_res, _err, id) => [{ type: "Application", id }],
    }),

    createApplication: builder.mutation<ApplicationDto, CreateApplicationPayload>({
      query: (body) => ({
        url: "/recruitment/applications",
        method: "POST",
        body,
      }),
      transformResponse: (res: ApiResponse<ApplicationDto>) => res.data,
      invalidatesTags: [
        { type: "Application", id: "LIST" },
        { type: "JobOpening", id: "LIST" },
      ],
    }),

    updateApplicationStage: builder.mutation<
      ApplicationDto,
      { id: string; body: UpdateApplicationStagePayload }
    >({
      query: ({ id, body }) => ({
        url: `/recruitment/applications/${id}/stage`,
        method: "PUT",
        body,
      }),
      transformResponse: (res: ApiResponse<ApplicationDto>) => res.data,
      invalidatesTags: (_res, _err, { id }) => [
        { type: "Application", id },
        { type: "Application", id: "LIST" },
      ],
    }),

    rejectApplication: builder.mutation<
      ApplicationDto,
      { id: string; body: RejectApplicationPayload }
    >({
      query: ({ id, body }) => ({
        url: `/recruitment/applications/${id}/reject`,
        method: "POST",
        body,
      }),
      transformResponse: (res: ApiResponse<ApplicationDto>) => res.data,
      invalidatesTags: (_res, _err, { id }) => [
        { type: "Application", id },
        { type: "Application", id: "LIST" },
      ],
    }),

    withdrawApplication: builder.mutation<
      ApplicationDto,
      { id: string; notes?: string }
    >({
      query: ({ id, notes }) => ({
        url: `/recruitment/applications/${id}/withdraw`,
        method: "POST",
        body: { notes },
      }),
      transformResponse: (res: ApiResponse<ApplicationDto>) => res.data,
      invalidatesTags: (_res, _err, { id }) => [
        { type: "Application", id },
        { type: "Application", id: "LIST" },
      ],
    }),

    triggerAiScreening: builder.mutation<AiScreeningLogDto, string>({
      query: (applicationId) => ({
        url: `/recruitment/applications/${applicationId}/ai-screen`,
        method: "POST",
      }),
      transformResponse: (res: ApiResponse<AiScreeningLogDto>) => res.data,
      invalidatesTags: (_res, _err, applicationId) => [
        { type: "Application", id: applicationId },
        { type: "Application", id: "LIST" },
      ],
    }),

    // ═══════════════════════════════════════════════════════════════════════════
    // 6. PHỎNG VẤN & HỘI ĐỒNG (INTERVIEWS)
    // ═══════════════════════════════════════════════════════════════════════════

    getInterviews: builder.query<PageData<InterviewDto>, InterviewFilterParams>({
      query: (params = {}) => {
        const queryParams: Record<string, unknown> = {
          ...params,
          page: params.page ? Math.max(0, params.page - 1) : 0,
        };
        return {
          url: `/recruitment/interviews?${buildQueryString(queryParams)}`,
          method: "GET",
        };
      },
      transformResponse: (res: ApiResponse<PageData<InterviewDto>>) => res.data,
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({ type: "Interview" as const, id })),
              { type: "Interview", id: "LIST" },
            ]
          : [{ type: "Interview", id: "LIST" }],
    }),

    getInterviewById: builder.query<InterviewDto, string>({
      query: (id) => `/recruitment/interviews/${id}`,
      transformResponse: (res: ApiResponse<InterviewDto>) => res.data,
      providesTags: (_res, _err, id) => [{ type: "Interview", id }],
    }),

    scheduleInterview: builder.mutation<InterviewDto, ScheduleInterviewPayload>({
      query: (body) => ({
        url: "/recruitment/interviews/schedule",
        method: "POST",
        body,
      }),
      transformResponse: (res: ApiResponse<InterviewDto>) => res.data,
      invalidatesTags: [
        { type: "Interview", id: "LIST" },
        { type: "Application", id: "LIST" },
      ],
    }),

    rescheduleInterview: builder.mutation<
      InterviewDto,
      { id: string; body: RescheduleInterviewPayload }
    >({
      query: ({ id, body }) => ({
        url: `/recruitment/interviews/${id}/reschedule`,
        method: "PUT",
        body,
      }),
      transformResponse: (res: ApiResponse<InterviewDto>) => res.data,
      invalidatesTags: (_res, _err, { id }) => [
        { type: "Interview", id },
        { type: "Interview", id: "LIST" },
      ],
    }),

    cancelInterview: builder.mutation<
      InterviewDto,
      { id: string; reason: string }
    >({
      query: ({ id, reason }) => ({
        url: `/recruitment/interviews/${id}/cancel`,
        method: "POST",
        body: { reason },
      }),
      transformResponse: (res: ApiResponse<InterviewDto>) => res.data,
      invalidatesTags: (_res, _err, { id }) => [
        { type: "Interview", id },
        { type: "Interview", id: "LIST" },
      ],
    }),

    completeInterview: builder.mutation<InterviewDto, string>({
      query: (id) => ({
        url: `/recruitment/interviews/${id}/complete`,
        method: "POST",
      }),
      transformResponse: (res: ApiResponse<InterviewDto>) => res.data,
      invalidatesTags: (_res, _err, id) => [
        { type: "Interview", id },
        { type: "Interview", id: "LIST" },
      ],
    }),

    generateAiQuestions: builder.mutation<
      AiGeneratedQuestionDto[],
      { roundId: string }
    >({
      query: ({ roundId }) => ({
        url: `/recruitment/interviews/rounds/${roundId}/generate-questions`,
        method: "POST",
      }),
      transformResponse: (res: ApiResponse<AiGeneratedQuestionDto[]>) => res.data,
    }),

    // ═══════════════════════════════════════════════════════════════════════════
    // 7. PHIẾU CHẤM ĐIỂM BLIND GRADING (SCORECARDS)
    // ═══════════════════════════════════════════════════════════════════════════

    getScorecardById: builder.query<ScorecardDto, string>({
      query: (id) => `/recruitment/scorecards/${id}`,
      transformResponse: (res: ApiResponse<ScorecardDto>) => res.data,
      providesTags: (_res, _err, id) => [{ type: "Scorecard", id }],
    }),

    getScorecardsByInterview: builder.query<ScorecardDto[], string>({
      query: (interviewId) => `/recruitment/scorecards/interview/${interviewId}`,
      transformResponse: (res: ApiResponse<ScorecardDto[]>) => res.data,
      providesTags: (_res, _err, interviewId) => [
        { type: "Scorecard", id: `INTERVIEW_${interviewId}` },
      ],
    }),

    submitScorecard: builder.mutation<ScorecardDto, SubmitScorecardPayload>({
      query: (body) => ({
        url: "/recruitment/scorecards",
        method: "POST",
        body,
      }),
      transformResponse: (res: ApiResponse<ScorecardDto>) => res.data,
      invalidatesTags: (_res, _err, { interviewId }) => [
        { type: "Scorecard", id: `INTERVIEW_${interviewId}` },
        { type: "Interview", id: interviewId },
        { type: "Interview", id: "LIST" },
      ],
    }),

    // ═══════════════════════════════════════════════════════════════════════════
    // 8. THƯ MỜI NHẬN VIỆC (OFFERS)
    // ═══════════════════════════════════════════════════════════════════════════

    getOffers: builder.query<PageData<OfferDto>, OfferFilterParams>({
      query: (params = {}) => {
        const queryParams: Record<string, unknown> = {
          ...params,
          page: params.page ? Math.max(0, params.page - 1) : 0,
        };
        return {
          url: `/recruitment/offers?${buildQueryString(queryParams)}`,
          method: "GET",
        };
      },
      transformResponse: (res: ApiResponse<PageData<OfferDto>>) => res.data,
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({ type: "Offer" as const, id })),
              { type: "Offer", id: "LIST" },
            ]
          : [{ type: "Offer", id: "LIST" }],
    }),

    getOfferById: builder.query<OfferDto, string>({
      query: (id) => `/recruitment/offers/${id}`,
      transformResponse: (res: ApiResponse<OfferDto>) => res.data,
      providesTags: (_res, _err, id) => [{ type: "Offer", id }],
    }),

    createOffer: builder.mutation<OfferDto, CreateOfferPayload>({
      query: (body) => ({
        url: "/recruitment/offers",
        method: "POST",
        body,
      }),
      transformResponse: (res: ApiResponse<OfferDto>) => res.data,
      invalidatesTags: [
        { type: "Offer", id: "LIST" },
        { type: "Application", id: "LIST" },
      ],
    }),

    sendOffer: builder.mutation<OfferDto, string>({
      query: (id) => ({
        url: `/recruitment/offers/${id}/send`,
        method: "POST",
      }),
      transformResponse: (res: ApiResponse<OfferDto>) => res.data,
      invalidatesTags: (_res, _err, id) => [
        { type: "Offer", id },
        { type: "Offer", id: "LIST" },
      ],
    }),

    acceptOffer: builder.mutation<OfferDto, string>({
      query: (id) => ({
        url: `/recruitment/offers/${id}/accept`,
        method: "POST",
      }),
      transformResponse: (res: ApiResponse<OfferDto>) => res.data,
      invalidatesTags: (_res, _err, id) => [
        { type: "Offer", id },
        { type: "Offer", id: "LIST" },
        { type: "Application", id: "LIST" },
        { type: "Employee", id: "LIST" },
      ],
    }),

    declineOffer: builder.mutation<OfferDto, { id: string; reason: string }>({
      query: ({ id, reason }) => ({
        url: `/recruitment/offers/${id}/decline`,
        method: "POST",
        body: { reason },
      }),
      transformResponse: (res: ApiResponse<OfferDto>) => res.data,
      invalidatesTags: (_res, _err, { id }) => [
        { type: "Offer", id },
        { type: "Offer", id: "LIST" },
        { type: "Application", id: "LIST" },
      ],
    }),

    convertOfferToEmployee: builder.mutation<ConvertOfferToEmployeeResponse, string>({
      query: (id) => ({
        url: `/recruitment/offers/${id}/onboard`,
        method: "POST",
      }),
      transformResponse: (res: ApiResponse<ConvertOfferToEmployeeResponse>) => res.data,
      invalidatesTags: (_res, _err, id) => [
        { type: "Offer", id },
        { type: "Offer", id: "LIST" },
        { type: "Application", id: "LIST" },
        { type: "Employee", id: "LIST" },
      ],
    }),

    // ═══════════════════════════════════════════════════════════════════════════
    // 9. CƠ HỘI NỘI BỘ (INTERNAL OPPORTUNITIES)
    // ═══════════════════════════════════════════════════════════════════════════

    getInternalOpportunities: builder.query<
      PageData<InternalOpportunityDto>,
      { page?: number; size?: number; keyword?: string; isActive?: boolean }
    >({
      query: (params = {}) => {
        const queryParams: Record<string, unknown> = {
          ...params,
          page: params.page ? Math.max(0, params.page - 1) : 0,
        };
        return {
          url: `/recruitment/internal-opportunities?${buildQueryString(queryParams)}`,
          method: "GET",
        };
      },
      transformResponse: (res: ApiResponse<PageData<InternalOpportunityDto>>) => res.data,
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({ type: "InternalOpportunity" as const, id })),
              { type: "InternalOpportunity", id: "LIST" },
            ]
          : [{ type: "InternalOpportunity", id: "LIST" }],
    }),

    getInternalOpportunityById: builder.query<InternalOpportunityDto, string>({
      query: (id) => `/recruitment/internal-opportunities/${id}`,
      transformResponse: (res: ApiResponse<InternalOpportunityDto>) => res.data,
      providesTags: (_res, _err, id) => [{ type: "InternalOpportunity", id }],
    }),

    createInternalOpportunity: builder.mutation<
      InternalOpportunityDto,
      CreateInternalOpportunityPayload
    >({
      query: (body) => ({
        url: "/recruitment/internal-opportunities",
        method: "POST",
        body,
      }),
      transformResponse: (res: ApiResponse<InternalOpportunityDto>) => res.data,
      invalidatesTags: [{ type: "InternalOpportunity", id: "LIST" }],
    }),

    applyInternalOpportunity: builder.mutation<
      InternalOpportunityApplicationDto,
      { id: string; body: ApplyInternalOpportunityPayload }
    >({
      query: ({ id, body }) => ({
        url: `/recruitment/internal-opportunities/${id}/apply`,
        method: "POST",
        body,
      }),
      transformResponse: (res: ApiResponse<InternalOpportunityApplicationDto>) => res.data,
      invalidatesTags: (_res, _err, { id }) => [
        { type: "InternalOpportunity", id },
        { type: "InternalOpportunity", id: "LIST" },
      ],
    }),

    getInternalOpportunityApplications: builder.query<
      InternalOpportunityApplicationDto[],
      string
    >({
      query: (id) => `/recruitment/internal-opportunities/${id}/applications`,
      transformResponse: (res: ApiResponse<InternalOpportunityApplicationDto[]>) => res.data,
      providesTags: (_res, _err, id) => [
        { type: "InternalOpportunity", id: `APPLICATIONS_${id}` },
      ],
    }),

    // ═══════════════════════════════════════════════════════════════════════════
    // 10. CỔNG TUYỂN DỤNG CÔNG KHAI (PUBLIC CAREER PORTAL)
    // ═══════════════════════════════════════════════════════════════════════════

    getPublicJobOpenings: builder.query<
      PageData<PublicJobOpening>,
      { keyword?: string; departmentId?: string; page?: number; size?: number } | void
    >({
      query: (params = {}) => {
        const queryParams: Record<string, unknown> = {
          ...params,
          page: params?.page ? Math.max(0, params.page - 1) : 0,
        };
        return {
          url: `/public/job-openings?${buildQueryString(queryParams)}`,
          method: "GET",
        };
      },
      transformResponse: (res: ApiResponse<PageData<PublicJobOpening>>) => res.data,
      providesTags: ["JobOpening"],
    }),

    getPublicJobOpeningBySlug: builder.query<PublicJobOpening, string>({
      query: (slug) => `/public/job-openings/${slug}`,
      transformResponse: (res: ApiResponse<PublicJobOpening>) => res.data,
      providesTags: (_res, _err, slug) => [{ type: "JobOpening", id: slug }],
    }),

    applyPublicJobOpening: builder.mutation<
      ApplicationDto,
      { slug: string; formData: FormData }
    >({
      query: ({ slug, formData }) => ({
        url: `/public/job-openings/${slug}/applications`,
        method: "POST",
        body: formData,
      }),
      transformResponse: (res: ApiResponse<ApplicationDto>) => res.data,
      invalidatesTags: [{ type: "Application", id: "LIST" }],
    }),
  }),
});

export const {
  // 1. Recruitment Requests
  useGetRecruitmentRequestsQuery,
  useGetRecruitmentRequestByIdQuery,
  useCreateRecruitmentRequestMutation,
  useUpdateRecruitmentRequestMutation,
  useSubmitRecruitmentRequestMutation,
  useApproveRecruitmentRequestMutation,
  useRejectRecruitmentRequestMutation,
  useDeleteRecruitmentRequestMutation,

  // 2. Job Openings
  useGetJobOpeningsQuery,
  useGetJobOpeningByIdQuery,
  useCreateJobOpeningMutation,
  useUpdateJobOpeningMutation,
  usePublishJobOpeningMutation,
  useCloseJobOpeningMutation,
  useDeleteJobOpeningMutation,

  // 3. Channels & Postings
  useGetRecruitmentChannelsQuery,
  useCreateRecruitmentChannelMutation,
  usePublishJobPostingMutation,
  useGetJobPostingsByJobOpeningQuery,

  // 4. Candidates
  useGetCandidatesQuery,
  useGetCandidateByIdQuery,
  useCreateCandidateMutation,
  useUpdateCandidateMutation,
  useBlacklistCandidateMutation,
  useUnblacklistCandidateMutation,
  useParseCvFileMutation,

  // 5. Applications
  useGetApplicationsQuery,
  useGetApplicationByIdQuery,
  useCreateApplicationMutation,
  useUpdateApplicationStageMutation,
  useRejectApplicationMutation,
  useWithdrawApplicationMutation,
  useTriggerAiScreeningMutation,

  // 6. Interviews
  useGetInterviewsQuery,
  useGetInterviewByIdQuery,
  useScheduleInterviewMutation,
  useRescheduleInterviewMutation,
  useCancelInterviewMutation,
  useCompleteInterviewMutation,
  useGenerateAiQuestionsMutation,

  // 7. Scorecards
  useGetScorecardByIdQuery,
  useGetScorecardsByInterviewQuery,
  useSubmitScorecardMutation,

  // 8. Offers
  useGetOffersQuery,
  useGetOfferByIdQuery,
  useCreateOfferMutation,
  useSendOfferMutation,
  useAcceptOfferMutation,
  useDeclineOfferMutation,
  useConvertOfferToEmployeeMutation,

  // 9. Internal Opportunities
  useGetInternalOpportunitiesQuery,
  useGetInternalOpportunityByIdQuery,
  useCreateInternalOpportunityMutation,
  useApplyInternalOpportunityMutation,
  useGetInternalOpportunityApplicationsQuery,

  // 10. Public Careers Portal
  useGetPublicJobOpeningsQuery,
  useGetPublicJobOpeningBySlugQuery,
  useApplyPublicJobOpeningMutation,
} = recruitmentApi;

