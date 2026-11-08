import { baseApi } from "@/store/base-api-rtk";
import { buildQueryString } from "@/lib/utils";
import type { ApiResponse, PageData } from "@/types/api.types";
import type {
  EmployeeSummary,
  EmployeeDetail,
  CreateEmployeeInput,
  UpdateEmployeeInput,
  EmployeeFilterParams,
  WorkAssignment,
  IdentityDocument,
  BankAccount,
  Dependent,
  EmergencyContact,
  StatusHistory,
  ProbationEvaluation,
  FaceEnrollment,
} from "../types/employee.types";

export const employeeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 3.1 Nhóm Hồ sơ nhân viên chính (Employee Profiles)
    getEmployees: builder.query<PageData<EmployeeSummary>, EmployeeFilterParams>({
      query: (params = {}) => ({
        url: `/employees?${buildQueryString(params)}`,
        method: "GET",
      }),
      transformResponse: (res: ApiResponse<PageData<EmployeeSummary>>) => res.data,
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({ type: "Employee" as const, id })),
              { type: "Employee", id: "LIST" },
            ]
          : [{ type: "Employee", id: "LIST" }],
    }),

    getEmployeeById: builder.query<EmployeeDetail, string>({
      query: (id) => ({ url: `/employees/${id}`, method: "GET" }),
      transformResponse: (res: ApiResponse<EmployeeDetail>) => res.data,
      providesTags: (_res, _err, id) => [{ type: "Employee", id }],
    }),

    createEmployee: builder.mutation<EmployeeDetail, CreateEmployeeInput>({
      query: (body) => ({ url: "/employees", method: "POST", body }),
      transformResponse: (res: ApiResponse<EmployeeDetail>) => res.data,
      invalidatesTags: [
        { type: "Employee", id: "LIST" },
        { type: "DepartmentTree", id: "LIST" },
      ],
    }),

    updateEmployee: builder.mutation<EmployeeDetail, { id: string; body: UpdateEmployeeInput }>({
      query: ({ id, body }) => ({ url: `/employees/${id}`, method: "PUT", body }),
      transformResponse: (res: ApiResponse<EmployeeDetail>) => res.data,
      invalidatesTags: (_res, _err, { id }) => [
        { type: "Employee", id },
        { type: "Employee", id: "LIST" },
      ],
    }),

    exportEmployees: builder.query<{ downloadUrl?: string; message?: string }, EmployeeFilterParams>({
      query: (params = {}) => ({
        url: `/employees/export?${buildQueryString(params)}`,
        method: "GET",
      }),
      transformResponse: (res: ApiResponse<{ downloadUrl?: string; message?: string }>) => res.data,
    }),

    getMyProfile: builder.query<EmployeeDetail, void>({
      query: () => ({ url: "/me/profile", method: "GET" }),
      transformResponse: (res: ApiResponse<EmployeeDetail>) => res.data,
      providesTags: [{ type: "Employee", id: "ME" }],
    }),

    updateMyProfile: builder.mutation<EmployeeDetail, UpdateEmployeeInput>({
      query: (body) => ({ url: "/me/profile", method: "PUT", body }),
      transformResponse: (res: ApiResponse<EmployeeDetail>) => res.data,
      invalidatesTags: [{ type: "Employee", id: "ME" }],
    }),

    // 3.2 Nhóm Giấy tờ định danh & Ngân hàng (Identities & Banking)
    getIdentityDocuments: builder.query<IdentityDocument[], string>({
      query: (employeeId) => ({ url: `/employees/${employeeId}/identity-documents`, method: "GET" }),
      transformResponse: (res: ApiResponse<IdentityDocument[]>) => res.data,
      providesTags: (_res, _err, id) => [{ type: "Employee", id }],
    }),

    createIdentityDocument: builder.mutation<IdentityDocument, { employeeId: string; body: Partial<IdentityDocument> }>({
      query: ({ employeeId, body }) => ({
        url: `/employees/${employeeId}/identity-documents`,
        method: "POST",
        body,
      }),
      transformResponse: (res: ApiResponse<IdentityDocument>) => res.data,
      invalidatesTags: (_res, _err, { employeeId }) => [{ type: "Employee", id: employeeId }],
    }),

    updateIdentityDocument: builder.mutation<IdentityDocument, { documentId: string; body: Partial<IdentityDocument> }>({
      query: ({ documentId, body }) => ({
        url: `/identity-documents/${documentId}`,
        method: "PUT",
        body,
      }),
      transformResponse: (res: ApiResponse<IdentityDocument>) => res.data,
      invalidatesTags: [{ type: "Employee", id: "LIST" }],
    }),

    deleteIdentityDocument: builder.mutation<void, string>({
      query: (documentId) => ({
        url: `/identity-documents/${documentId}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Employee", id: "LIST" }],
    }),

    getBankAccount: builder.query<BankAccount, string>({
      query: (employeeId) => ({ url: `/employees/${employeeId}/bank-account`, method: "GET" }),
      transformResponse: (res: ApiResponse<BankAccount>) => res.data,
      providesTags: (_res, _err, id) => [{ type: "Employee", id }],
    }),

    updateBankAccount: builder.mutation<BankAccount, { employeeId: string; body: Partial<BankAccount> }>({
      query: ({ employeeId, body }) => ({
        url: `/employees/${employeeId}/bank-account`,
        method: "PUT",
        body,
      }),
      transformResponse: (res: ApiResponse<BankAccount>) => res.data,
      invalidatesTags: (_res, _err, { employeeId }) => [{ type: "Employee", id: employeeId }],
    }),

    // 3.3 Nhóm Người phụ thuộc & Khẩn cấp (Dependents & Emergency Contacts)
    getDependents: builder.query<Dependent[], string>({
      query: (employeeId) => ({ url: `/employees/${employeeId}/dependents`, method: "GET" }),
      transformResponse: (res: ApiResponse<Dependent[]>) => res.data,
      providesTags: (_res, _err, id) => [{ type: "Employee", id }],
    }),

    createDependent: builder.mutation<Dependent, { employeeId: string; body: Partial<Dependent> }>({
      query: ({ employeeId, body }) => ({
        url: `/employees/${employeeId}/dependents`,
        method: "POST",
        body,
      }),
      transformResponse: (res: ApiResponse<Dependent>) => res.data,
      invalidatesTags: (_res, _err, { employeeId }) => [{ type: "Employee", id: employeeId }],
    }),

    updateDependent: builder.mutation<Dependent, { dependentId: string; body: Partial<Dependent> }>({
      query: ({ dependentId, body }) => ({
        url: `/dependents/${dependentId}`,
        method: "PUT",
        body,
      }),
      transformResponse: (res: ApiResponse<Dependent>) => res.data,
      invalidatesTags: [{ type: "Employee", id: "LIST" }],
    }),

    deleteDependent: builder.mutation<void, string>({
      query: (dependentId) => ({
        url: `/dependents/${dependentId}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Employee", id: "LIST" }],
    }),

    getEmergencyContacts: builder.query<EmergencyContact[], string>({
      query: (employeeId) => ({ url: `/employees/${employeeId}/emergency-contacts`, method: "GET" }),
      transformResponse: (res: ApiResponse<EmergencyContact[]>) => res.data,
      providesTags: (_res, _err, id) => [{ type: "Employee", id }],
    }),

    createEmergencyContact: builder.mutation<EmergencyContact, { employeeId: string; body: Partial<EmergencyContact> }>({
      query: ({ employeeId, body }) => ({
        url: `/employees/${employeeId}/emergency-contacts`,
        method: "POST",
        body,
      }),
      transformResponse: (res: ApiResponse<EmergencyContact>) => res.data,
      invalidatesTags: (_res, _err, { employeeId }) => [{ type: "Employee", id: employeeId }],
    }),

    updateEmergencyContact: builder.mutation<EmergencyContact, { contactId: string; body: Partial<EmergencyContact> }>({
      query: ({ contactId, body }) => ({
        url: `/emergency-contacts/${contactId}`,
        method: "PUT",
        body,
      }),
      transformResponse: (res: ApiResponse<EmergencyContact>) => res.data,
      invalidatesTags: [{ type: "Employee", id: "LIST" }],
    }),

    deleteEmergencyContact: builder.mutation<void, string>({
      query: (contactId) => ({
        url: `/emergency-contacts/${contactId}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Employee", id: "LIST" }],
    }),

    // 3.4 Nhóm Công tác & Phân công nhiệm vụ (Work Assignments)
    getWorkAssignments: builder.query<WorkAssignment[], string>({
      query: (employeeId) => ({ url: `/employees/${employeeId}/work-assignments`, method: "GET" }),
      transformResponse: (res: ApiResponse<WorkAssignment[]>) => res.data,
      providesTags: (_res, _err, id) => [{ type: "Employee", id }],
    }),

    getWorkAssignmentAt: builder.query<WorkAssignment, { employeeId: string; date: string }>({
      query: ({ employeeId, date }) => ({
        url: `/employees/${employeeId}/work-assignments/at?date=${date}`,
        method: "GET",
      }),
      transformResponse: (res: ApiResponse<WorkAssignment>) => res.data,
    }),

    createWorkAssignment: builder.mutation<WorkAssignment, { employeeId: string; body: any }>({
      query: ({ employeeId, body }) => ({
        url: `/employees/${employeeId}/work-assignments`,
        method: "POST",
        body,
      }),
      transformResponse: (res: ApiResponse<WorkAssignment>) => res.data,
      invalidatesTags: (_res, _err, { employeeId }) => [
        { type: "Employee", id: employeeId },
        { type: "Employee", id: "LIST" },
        { type: "DepartmentTree", id: "LIST" },
      ],
    }),

    getDirectReports: builder.query<EmployeeSummary[], string>({
      query: (employeeId) => ({ url: `/employees/${employeeId}/direct-reports`, method: "GET" }),
      transformResponse: (res: ApiResponse<EmployeeSummary[]>) => res.data,
    }),

    // 3.5 Nhóm Trạng thái làm việc & Thử việc (Lifecycle & Probation)
    getStatusHistory: builder.query<StatusHistory[], string>({
      query: (employeeId) => ({ url: `/employees/${employeeId}/status-history`, method: "GET" }),
      transformResponse: (res: ApiResponse<StatusHistory[]>) => res.data,
      providesTags: (_res, _err, id) => [{ type: "Employee", id }],
    }),

    changeEmployeeStatus: builder.mutation<
      StatusHistory,
      { employeeId: string; body: { status: string; effectiveFrom: string; note?: string } }
    >({
      query: ({ employeeId, body }) => ({
        url: `/employees/${employeeId}/status-changes`,
        method: "POST",
        body,
      }),
      transformResponse: (res: ApiResponse<StatusHistory>) => res.data,
      invalidatesTags: (_res, _err, { employeeId }) => [
        { type: "Employee", id: employeeId },
        { type: "Employee", id: "LIST" },
      ],
    }),

    getProbationEvaluations: builder.query<ProbationEvaluation[], string>({
      query: (employeeId) => ({ url: `/employees/${employeeId}/probation-evaluations`, method: "GET" }),
      transformResponse: (res: ApiResponse<ProbationEvaluation[]>) => res.data,
      providesTags: (_res, _err, id) => [{ type: "Employee", id }],
    }),

    createProbationEvaluation: builder.mutation<ProbationEvaluation, { employeeId: string; body: any }>({
      query: ({ employeeId, body }) => ({
        url: `/employees/${employeeId}/probation-evaluations`,
        method: "POST",
        body,
      }),
      transformResponse: (res: ApiResponse<ProbationEvaluation>) => res.data,
      invalidatesTags: (_res, _err, { employeeId }) => [{ type: "Employee", id: employeeId }],
    }),

    getOfficialEligibility: builder.query<{ eligible: boolean; reasons: string[] }, string>({
      query: (employeeId) => ({ url: `/employees/${employeeId}/official-eligibility`, method: "GET" }),
      transformResponse: (res: ApiResponse<{ eligible: boolean; reasons: string[] }>) => res.data,
    }),

    confirmOfficial: builder.mutation<StatusHistory, string>({
      query: (employeeId) => ({
        url: `/employees/${employeeId}/confirm-official`,
        method: "POST",
      }),
      transformResponse: (res: ApiResponse<StatusHistory>) => res.data,
      invalidatesTags: (_res, _err, id) => [
        { type: "Employee", id },
        { type: "Employee", id: "LIST" },
      ],
    }),

    // 3.6 Nhóm Đăng ký Khuôn mặt Sinh trắc học (Face Enrollments)
    getFaceEnrollments: builder.query<FaceEnrollment[], string>({
      query: (employeeId) => ({ url: `/employees/${employeeId}/face-enrollments`, method: "GET" }),
      transformResponse: (res: ApiResponse<FaceEnrollment[]>) => res.data,
      providesTags: (_res, _err, id) => [{ type: "Employee", id }],
    }),

    createFaceEnrollment: builder.mutation<FaceEnrollment, { employeeId: string; body: any }>({
      query: ({ employeeId, body }) => ({
        url: `/employees/${employeeId}/face-enrollments`,
        method: "POST",
        body,
      }),
      transformResponse: (res: ApiResponse<FaceEnrollment>) => res.data,
      invalidatesTags: (_res, _err, { employeeId }) => [{ type: "Employee", id: employeeId }],
    }),

    revokeFaceEnrollment: builder.mutation<FaceEnrollment, { enrollmentId: string; body?: { reason: string } }>({
      query: ({ enrollmentId, body }) => ({
        url: `/face-enrollments/${enrollmentId}/revoke`,
        method: "POST",
        body,
      }),
      transformResponse: (res: ApiResponse<FaceEnrollment>) => res.data,
      invalidatesTags: [{ type: "Employee", id: "LIST" }],
    }),

    getMyFaceEnrollment: builder.query<FaceEnrollment, void>({
      query: () => ({ url: "/me/face-enrollment", method: "GET" }),
      transformResponse: (res: ApiResponse<FaceEnrollment>) => res.data,
    }),

    createMyFaceEnrollment: builder.mutation<FaceEnrollment, any>({
      query: (body) => ({ url: "/me/face-enrollment", method: "POST", body }),
      transformResponse: (res: ApiResponse<FaceEnrollment>) => res.data,
    }),

    deleteMyFaceEnrollment: builder.mutation<void, void>({
      query: () => ({ url: "/me/face-enrollment", method: "DELETE" }),
    }),
  }),
});

export const {
  // 3.1
  useGetEmployeesQuery,
  useGetEmployeeByIdQuery,
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  useExportEmployeesQuery,
  useLazyExportEmployeesQuery,
  useGetMyProfileQuery,
  useUpdateMyProfileMutation,

  // 3.2
  useGetIdentityDocumentsQuery,
  useCreateIdentityDocumentMutation,
  useUpdateIdentityDocumentMutation,
  useDeleteIdentityDocumentMutation,
  useGetBankAccountQuery,
  useUpdateBankAccountMutation,

  // 3.3
  useGetDependentsQuery,
  useCreateDependentMutation,
  useUpdateDependentMutation,
  useDeleteDependentMutation,
  useGetEmergencyContactsQuery,
  useCreateEmergencyContactMutation,
  useUpdateEmergencyContactMutation,
  useDeleteEmergencyContactMutation,

  // 3.4
  useGetWorkAssignmentsQuery,
  useGetWorkAssignmentAtQuery,
  useCreateWorkAssignmentMutation,
  useGetDirectReportsQuery,

  // 3.5
  useGetStatusHistoryQuery,
  useChangeEmployeeStatusMutation,
  useGetProbationEvaluationsQuery,
  useCreateProbationEvaluationMutation,
  useGetOfficialEligibilityQuery,
  useConfirmOfficialMutation,

  // 3.6
  useGetFaceEnrollmentsQuery,
  useCreateFaceEnrollmentMutation,
  useRevokeFaceEnrollmentMutation,
  useGetMyFaceEnrollmentQuery,
  useCreateMyFaceEnrollmentMutation,
  useDeleteMyFaceEnrollmentMutation,
} = employeeApi;
