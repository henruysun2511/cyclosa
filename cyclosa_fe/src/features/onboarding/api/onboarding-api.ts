import { baseApi } from "@/store/base-api-rtk";
import { buildQueryString } from "@/lib/utils";
import type { ApiResponse, PageData } from "@/types/api.types";
import type {
  OnboardingTemplateDto,
  CreateOnboardingTemplatePayload,
  UpdateOnboardingTemplatePayload,
  OnboardingTemplateFilterParams,
  ItAccountTypeDto,
  CreateItAccountTypePayload,
  UpdateItAccountTypePayload,
  OrientationSessionDto,
  CreateOrientationSessionPayload,
  BatchAttendancePayload,
  OrientationSessionFilterParams,
  OnboardingProcessDto,
  CreateOnboardingProcessPayload,
  AcceptOnboardingProcessPayload,
  CancelOnboardingProcessPayload,
  OnboardingProcessFilterParams,
  OnboardingTaskDto,
  CreateAdHocTaskPayload,
  CompleteTaskPayload,
  ItAccountRequestDto,
  ProvisionItAccountPayload,
  FailItAccountPayload,
  ItAccountRequestFilterParams,
} from "../types/onboarding.types";

export const onboardingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ═══════════════════════════════════════════════════════════════════════════
    // 1. MẪU CHECKLIST (ONBOARDING TEMPLATES)
    // ═══════════════════════════════════════════════════════════════════════════

    getOnboardingTemplates: builder.query<
      PageData<OnboardingTemplateDto>,
      OnboardingTemplateFilterParams
    >({
      query: (params = {}) => {
        const queryParams: Record<string, unknown> = {
          ...params,
          page: params.page ? Math.max(0, params.page - 1) : 0,
        };
        const qs = buildQueryString(queryParams);
        return {
          url: `/onboarding-templates${qs ? `?${qs}` : ""}`,
          method: "GET",
        };
      },
      transformResponse: (res: ApiResponse<PageData<OnboardingTemplateDto>>) =>
        res.data,
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({
                type: "OnboardingTemplate" as const,
                id,
              })),
              { type: "OnboardingTemplate", id: "LIST" },
            ]
          : [{ type: "OnboardingTemplate", id: "LIST" }],
    }),

    getOnboardingTemplateById: builder.query<OnboardingTemplateDto, string>({
      query: (id) => `/onboarding-templates/${id}`,
      transformResponse: (res: ApiResponse<OnboardingTemplateDto>) => res.data,
      providesTags: (_res, _err, id) => [{ type: "OnboardingTemplate", id }],
    }),

    createOnboardingTemplate: builder.mutation<
      OnboardingTemplateDto,
      CreateOnboardingTemplatePayload
    >({
      query: (body) => ({
        url: "/onboarding-templates",
        method: "POST",
        body,
      }),
      transformResponse: (res: ApiResponse<OnboardingTemplateDto>) => res.data,
      invalidatesTags: [{ type: "OnboardingTemplate", id: "LIST" }],
    }),

    updateOnboardingTemplate: builder.mutation<
      OnboardingTemplateDto,
      { id: string; body: UpdateOnboardingTemplatePayload }
    >({
      query: ({ id, body }) => ({
        url: `/onboarding-templates/${id}`,
        method: "PUT",
        body,
      }),
      transformResponse: (res: ApiResponse<OnboardingTemplateDto>) => res.data,
      invalidatesTags: (_res, _err, { id }) => [
        { type: "OnboardingTemplate", id },
        { type: "OnboardingTemplate", id: "LIST" },
      ],
    }),

    deleteOnboardingTemplate: builder.mutation<void, string>({
      query: (id) => ({
        url: `/onboarding-templates/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "OnboardingTemplate", id: "LIST" }],
    }),

    // ═══════════════════════════════════════════════════════════════════════════
    // 2. LOẠI TÀI KHOẢN CNTT (IT ACCOUNT TYPES)
    // ═══════════════════════════════════════════════════════════════════════════

    getItAccountTypes: builder.query<ItAccountTypeDto[], { isActive?: boolean } | void>({
      query: (params) => {
        const qs = params ? buildQueryString(params as Record<string, unknown>) : "";
        return {
          url: `/it-account-types${qs ? `?${qs}` : ""}`,
          method: "GET",
        };
      },
      transformResponse: (res: ApiResponse<ItAccountTypeDto[]>) => res.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: "ItAccountType" as const,
                id,
              })),
              { type: "ItAccountType", id: "LIST" },
            ]
          : [{ type: "ItAccountType", id: "LIST" }],
    }),

    getItAccountTypeById: builder.query<ItAccountTypeDto, string>({
      query: (id) => `/it-account-types/${id}`,
      transformResponse: (res: ApiResponse<ItAccountTypeDto>) => res.data,
      providesTags: (_res, _err, id) => [{ type: "ItAccountType", id }],
    }),

    createItAccountType: builder.mutation<
      ItAccountTypeDto,
      CreateItAccountTypePayload
    >({
      query: (body) => ({
        url: "/it-account-types",
        method: "POST",
        body,
      }),
      transformResponse: (res: ApiResponse<ItAccountTypeDto>) => res.data,
      invalidatesTags: [{ type: "ItAccountType", id: "LIST" }],
    }),

    updateItAccountType: builder.mutation<
      ItAccountTypeDto,
      { id: string; body: UpdateItAccountTypePayload }
    >({
      query: ({ id, body }) => ({
        url: `/it-account-types/${id}`,
        method: "PUT",
        body,
      }),
      transformResponse: (res: ApiResponse<ItAccountTypeDto>) => res.data,
      invalidatesTags: (_res, _err, { id }) => [
        { type: "ItAccountType", id },
        { type: "ItAccountType", id: "LIST" },
      ],
    }),

    deleteItAccountType: builder.mutation<void, string>({
      query: (id) => ({
        url: `/it-account-types/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "ItAccountType", id: "LIST" }],
    }),

    // ═══════════════════════════════════════════════════════════════════════════
    // 3. ĐÀO TẠO ĐỊNH HƯỚNG (ORIENTATION SESSIONS)
    // ═══════════════════════════════════════════════════════════════════════════

    getOrientationSessions: builder.query<
      PageData<OrientationSessionDto>,
      OrientationSessionFilterParams
    >({
      query: (params = {}) => {
        const queryParams: Record<string, unknown> = {
          ...params,
          status: params.status === "ALL" ? undefined : params.status,
          page: params.page ? Math.max(0, params.page - 1) : 0,
        };
        const qs = buildQueryString(queryParams);
        return {
          url: `/orientation-sessions${qs ? `?${qs}` : ""}`,
          method: "GET",
        };
      },
      transformResponse: (res: ApiResponse<PageData<OrientationSessionDto>>) =>
        res.data,
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({
                type: "OrientationSession" as const,
                id,
              })),
              { type: "OrientationSession", id: "LIST" },
            ]
          : [{ type: "OrientationSession", id: "LIST" }],
    }),

    getOrientationSessionById: builder.query<OrientationSessionDto, string>({
      query: (id) => `/orientation-sessions/${id}`,
      transformResponse: (res: ApiResponse<OrientationSessionDto>) => res.data,
      providesTags: (_res, _err, id) => [{ type: "OrientationSession", id }],
    }),

    createOrientationSession: builder.mutation<
      OrientationSessionDto,
      CreateOrientationSessionPayload
    >({
      query: (body) => ({
        url: "/orientation-sessions",
        method: "POST",
        body,
      }),
      transformResponse: (res: ApiResponse<OrientationSessionDto>) => res.data,
      invalidatesTags: [{ type: "OrientationSession", id: "LIST" }],
    }),

    markAttendance: builder.mutation<
      OrientationSessionDto,
      { id: string; body: BatchAttendancePayload }
    >({
      query: ({ id, body }) => ({
        url: `/orientation-sessions/${id}/attendance`,
        method: "POST",
        body,
      }),
      transformResponse: (res: ApiResponse<OrientationSessionDto>) => res.data,
      invalidatesTags: (_res, _err, { id }) => [
        { type: "OrientationSession", id },
        { type: "OrientationSession", id: "LIST" },
        { type: "OnboardingProcess", id: "LIST" },
        { type: "OnboardingTask", id: "LIST" },
      ],
    }),

    cancelOrientationSession: builder.mutation<OrientationSessionDto, string>({
      query: (id) => ({
        url: `/orientation-sessions/${id}/cancel`,
        method: "POST",
      }),
      transformResponse: (res: ApiResponse<OrientationSessionDto>) => res.data,
      invalidatesTags: (_res, _err, id) => [
        { type: "OrientationSession", id },
        { type: "OrientationSession", id: "LIST" },
      ],
    }),

    // ═══════════════════════════════════════════════════════════════════════════
    // 4. TIẾN TRÌNH HỘI NHẬP (ONBOARDING PROCESSES)
    // ═══════════════════════════════════════════════════════════════════════════

    getOnboardingProcesses: builder.query<
      PageData<OnboardingProcessDto>,
      OnboardingProcessFilterParams
    >({
      query: (params = {}) => {
        const queryParams: Record<string, unknown> = {
          ...params,
          status: params.status === "ALL" ? undefined : params.status,
          page: params.page ? Math.max(0, params.page - 1) : 0,
        };
        const qs = buildQueryString(queryParams);
        return {
          url: `/onboarding-processes${qs ? `?${qs}` : ""}`,
          method: "GET",
        };
      },
      transformResponse: (res: ApiResponse<PageData<OnboardingProcessDto>>) =>
        res.data,
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({
                type: "OnboardingProcess" as const,
                id,
              })),
              { type: "OnboardingProcess", id: "LIST" },
            ]
          : [{ type: "OnboardingProcess", id: "LIST" }],
    }),

    getOnboardingProcessById: builder.query<OnboardingProcessDto, string>({
      query: (id) => `/onboarding-processes/${id}`,
      transformResponse: (res: ApiResponse<OnboardingProcessDto>) => res.data,
      providesTags: (_res, _err, id) => [
        { type: "OnboardingProcess", id },
        { type: "OnboardingTask", id: `PROCESS_${id}` },
      ],
    }),

    getEmployeeOnboarding: builder.query<OnboardingProcessDto, string>({
      query: (employeeId) => `/employees/${employeeId}/onboarding`,
      transformResponse: (res: ApiResponse<OnboardingProcessDto>) => res.data,
      providesTags: (_res, _err, employeeId) => [
        { type: "OnboardingProcess", id: `EMPLOYEE_${employeeId}` },
      ],
    }),

    getMyOnboarding: builder.query<OnboardingProcessDto, void>({
      query: () => "/me/onboarding",
      transformResponse: (res: ApiResponse<OnboardingProcessDto>) => res.data,
      providesTags: [{ type: "OnboardingProcess", id: "MY_ONBOARDING" }],
    }),

    createOnboardingProcess: builder.mutation<
      OnboardingProcessDto,
      CreateOnboardingProcessPayload
    >({
      query: (body) => ({
        url: "/onboarding-processes",
        method: "POST",
        body,
      }),
      transformResponse: (res: ApiResponse<OnboardingProcessDto>) => res.data,
      invalidatesTags: [
        { type: "OnboardingProcess", id: "LIST" },
        { type: "ItAccountRequest", id: "LIST" },
      ],
    }),

    acceptOnboardingProcess: builder.mutation<
      OnboardingProcessDto,
      { id: string; body: AcceptOnboardingProcessPayload }
    >({
      query: ({ id, body }) => ({
        url: `/onboarding-processes/${id}/accept`,
        method: "POST",
        body,
      }),
      transformResponse: (res: ApiResponse<OnboardingProcessDto>) => res.data,
      invalidatesTags: (_res, _err, { id }) => [
        { type: "OnboardingProcess", id },
        { type: "OnboardingProcess", id: "LIST" },
        { type: "OnboardingProcess", id: "MY_ONBOARDING" },
      ],
    }),

    cancelOnboardingProcess: builder.mutation<
      OnboardingProcessDto,
      { id: string; body: CancelOnboardingProcessPayload }
    >({
      query: ({ id, body }) => ({
        url: `/onboarding-processes/${id}/cancel`,
        method: "POST",
        body,
      }),
      transformResponse: (res: ApiResponse<OnboardingProcessDto>) => res.data,
      invalidatesTags: (_res, _err, { id }) => [
        { type: "OnboardingProcess", id },
        { type: "OnboardingProcess", id: "LIST" },
      ],
    }),

    // ═══════════════════════════════════════════════════════════════════════════
    // 5. CÔNG VIỆC HỘI NHẬP (ONBOARDING TASKS)
    // ═══════════════════════════════════════════════════════════════════════════

    getProcessTasks: builder.query<OnboardingTaskDto[], string>({
      query: (processId) => `/onboarding-processes/${processId}/tasks`,
      transformResponse: (res: ApiResponse<OnboardingTaskDto[]>) => res.data,
      providesTags: (_res, _err, processId) => [
        { type: "OnboardingTask", id: `PROCESS_${processId}` },
      ],
    }),

    createAdHocTask: builder.mutation<
      OnboardingTaskDto,
      { processId: string; body: CreateAdHocTaskPayload }
    >({
      query: ({ processId, body }) => ({
        url: `/onboarding-processes/${processId}/tasks`,
        method: "POST",
        body,
      }),
      transformResponse: (res: ApiResponse<OnboardingTaskDto>) => res.data,
      invalidatesTags: (_res, _err, { processId }) => [
        { type: "OnboardingProcess", id: processId },
        { type: "OnboardingTask", id: `PROCESS_${processId}` },
      ],
    }),

    completeOnboardingTask: builder.mutation<
      OnboardingTaskDto,
      { id: string; body: CompleteTaskPayload }
    >({
      query: ({ id, body }) => ({
        url: `/onboarding-tasks/${id}/complete`,
        method: "POST",
        body,
      }),
      transformResponse: (res: ApiResponse<OnboardingTaskDto>) => res.data,
      invalidatesTags: () => [
        { type: "OnboardingProcess" },
        { type: "OnboardingTask" },
      ],
    }),

    skipOnboardingTask: builder.mutation<
      OnboardingTaskDto,
      { id: string; reason?: string }
    >({
      query: ({ id, reason }) => ({
        url: `/onboarding-tasks/${id}/skip`,
        method: "POST",
        params: reason ? { reason } : undefined,
      }),
      transformResponse: (res: ApiResponse<OnboardingTaskDto>) => res.data,
      invalidatesTags: () => [
        { type: "OnboardingProcess" },
        { type: "OnboardingTask" },
      ],
    }),

    // ═══════════════════════════════════════════════════════════════════════════
    // 6. HÀNG ĐỢI IT (IT ACCOUNT REQUESTS)
    // ═══════════════════════════════════════════════════════════════════════════

    getItAccountRequests: builder.query<
      PageData<ItAccountRequestDto>,
      ItAccountRequestFilterParams
    >({
      query: (params = {}) => {
        const queryParams: Record<string, unknown> = {
          ...params,
          status: params.status === "ALL" ? undefined : params.status,
          page: params.page ? Math.max(0, params.page - 1) : 0,
        };
        const qs = buildQueryString(queryParams);
        return {
          url: `/it-account-requests${qs ? `?${qs}` : ""}`,
          method: "GET",
        };
      },
      transformResponse: (res: ApiResponse<PageData<ItAccountRequestDto>>) =>
        res.data,
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({
                type: "ItAccountRequest" as const,
                id,
              })),
              { type: "ItAccountRequest", id: "LIST" },
            ]
          : [{ type: "ItAccountRequest", id: "LIST" }],
    }),

    provisionItAccount: builder.mutation<
      ItAccountRequestDto,
      { id: string; body: ProvisionItAccountPayload }
    >({
      query: ({ id, body }) => ({
        url: `/it-account-requests/${id}/provision`,
        method: "POST",
        body,
      }),
      transformResponse: (res: ApiResponse<ItAccountRequestDto>) => res.data,
      invalidatesTags: [
        { type: "ItAccountRequest", id: "LIST" },
        { type: "OnboardingProcess" },
        { type: "OnboardingTask" },
      ],
    }),

    failItAccount: builder.mutation<
      ItAccountRequestDto,
      { id: string; body: FailItAccountPayload }
    >({
      query: ({ id, body }) => ({
        url: `/it-account-requests/${id}/fail`,
        method: "POST",
        body,
      }),
      transformResponse: (res: ApiResponse<ItAccountRequestDto>) => res.data,
      invalidatesTags: [
        { type: "ItAccountRequest", id: "LIST" },
        { type: "OnboardingProcess" },
      ],
    }),
  }),
});

export const {
  useGetOnboardingTemplatesQuery,
  useGetOnboardingTemplateByIdQuery,
  useCreateOnboardingTemplateMutation,
  useUpdateOnboardingTemplateMutation,
  useDeleteOnboardingTemplateMutation,
  useGetItAccountTypesQuery,
  useGetItAccountTypeByIdQuery,
  useCreateItAccountTypeMutation,
  useUpdateItAccountTypeMutation,
  useDeleteItAccountTypeMutation,
  useGetOrientationSessionsQuery,
  useGetOrientationSessionByIdQuery,
  useCreateOrientationSessionMutation,
  useMarkAttendanceMutation,
  useCancelOrientationSessionMutation,
  useGetOnboardingProcessesQuery,
  useGetOnboardingProcessByIdQuery,
  useGetEmployeeOnboardingQuery,
  useGetMyOnboardingQuery,
  useCreateOnboardingProcessMutation,
  useAcceptOnboardingProcessMutation,
  useCancelOnboardingProcessMutation,
  useGetProcessTasksQuery,
  useCreateAdHocTaskMutation,
  useCompleteOnboardingTaskMutation,
  useSkipOnboardingTaskMutation,
  useGetItAccountRequestsQuery,
  useProvisionItAccountMutation,
  useFailItAccountMutation,
} = onboardingApi;

