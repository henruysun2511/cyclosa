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
} from "../types/employee.types";

export const employeeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
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

    getMyProfile: builder.query<EmployeeDetail, void>({
      query: () => ({ url: "/me/profile", method: "GET" }),
      transformResponse: (res: ApiResponse<EmployeeDetail>) => res.data,
      providesTags: [{ type: "Employee", id: "ME" }],
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

    // Work assignments
    getWorkAssignments: builder.query<WorkAssignment[], string>({
      query: (employeeId) => ({ url: `/employees/${employeeId}/work-assignments`, method: "GET" }),
      transformResponse: (res: ApiResponse<WorkAssignment[]>) => res.data,
      providesTags: (_res, _err, id) => [{ type: "Employee", id }],
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

    // Status change
    changeEmployeeStatus: builder.mutation<StatusHistory, { employeeId: string; body: { status: string; effectiveFrom: string; note?: string } }>({
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

    // Confirm official
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
  }),
});

export const {
  useGetEmployeesQuery,
  useGetEmployeeByIdQuery,
  useGetMyProfileQuery,
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  useGetWorkAssignmentsQuery,
  useCreateWorkAssignmentMutation,
  useChangeEmployeeStatusMutation,
  useConfirmOfficialMutation,
} = employeeApi;

