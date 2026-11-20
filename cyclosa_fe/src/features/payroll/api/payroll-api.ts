import { baseApi } from "@/store/base-api-rtk";
import type { ApiResponse } from "@/types/api.types";
import type {
  SalaryComponentDto,
  CreateSalaryComponentDto,
  UpdateSalaryComponentDto,
  PayrollPeriodDto,
  CreatePayrollPeriodDto,
  UpdatePayrollPeriodDto,
  PayrollPrecheckDto,
  PayrollPeriodSummaryDto,
  PayrollRecordDto,
  PayrollRecordDetailDto,
  ManualAdjustmentDto,
  SalaryAdvanceDto,
  CreateSalaryAdvanceDto,
  PayrollPaymentDto,
  PayslipDto,
} from "../types/payroll.types";

export const payrollApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ── Salary Components ──────────────────────────────────────────
    getSalaryComponents: builder.query<ApiResponse<SalaryComponentDto[]>, void>({
      query: () => "/salary-components",
      providesTags: ["Payroll"],
    }),
    createSalaryComponent: builder.mutation<ApiResponse<SalaryComponentDto>, CreateSalaryComponentDto>({
      query: (body) => ({
        url: "/salary-components",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Payroll"],
    }),
    updateSalaryComponent: builder.mutation<
      ApiResponse<SalaryComponentDto>,
      { id: string; body: UpdateSalaryComponentDto }
    >({
      query: ({ id, body }) => ({
        url: `/salary-components/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Payroll"],
    }),
    deleteSalaryComponent: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/salary-components/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Payroll"],
    }),

    // ── Payroll Periods ────────────────────────────────────────────
    getPayrollPeriods: builder.query<ApiResponse<PayrollPeriodDto[]>, void>({
      query: () => "/payroll-periods",
      providesTags: ["Payroll"],
    }),
    getPayrollPeriodById: builder.query<ApiResponse<PayrollPeriodDto>, string>({
      query: (id) => `/payroll-periods/${id}`,
      providesTags: (_res, _err, id) => [{ type: "Payroll", id }],
    }),
    createPayrollPeriod: builder.mutation<ApiResponse<PayrollPeriodDto>, CreatePayrollPeriodDto>({
      query: (body) => ({
        url: "/payroll-periods",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Payroll"],
    }),
    updatePayrollPeriod: builder.mutation<
      ApiResponse<PayrollPeriodDto>,
      { id: string; body: UpdatePayrollPeriodDto }
    >({
      query: ({ id, body }) => ({
        url: `/payroll-periods/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Payroll"],
    }),
    deletePayrollPeriod: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/payroll-periods/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Payroll"],
    }),

    // ── Actions: Precheck, Calculate, Summary, Submit, Approve, Lock ──
    precheckPayrollPeriod: builder.query<ApiResponse<PayrollPrecheckDto>, string>({
      query: (id) => `/payroll-periods/${id}/precheck`,
    }),
    calculatePayroll: builder.mutation<ApiResponse<PayrollPeriodDto>, string>({
      query: (id) => ({
        url: `/payroll-periods/${id}/calculate`,
        method: "POST",
      }),
      invalidatesTags: ["Payroll"],
    }),
    getPayrollPeriodSummary: builder.query<ApiResponse<PayrollPeriodSummaryDto>, string>({
      query: (id) => `/payroll-periods/${id}/summary`,
      providesTags: (_res, _err, id) => [{ type: "Payroll", id }],
    }),
    submitPayrollForApproval: builder.mutation<ApiResponse<PayrollPeriodDto>, string>({
      query: (id) => ({
        url: `/payroll-periods/${id}/submit`,
        method: "POST",
      }),
      invalidatesTags: ["Payroll"],
    }),
    approvePayrollPeriod: builder.mutation<ApiResponse<PayrollPeriodDto>, string>({
      query: (id) => ({
        url: `/payroll-periods/${id}/approve`,
        method: "POST",
      }),
      invalidatesTags: ["Payroll"],
    }),
    rejectPayrollPeriod: builder.mutation<
      ApiResponse<PayrollPeriodDto>,
      { id: string; reason?: string }
    >({
      query: ({ id, reason }) => ({
        url: `/payroll-periods/${id}/reject`,
        method: "POST",
        body: { reason },
      }),
      invalidatesTags: ["Payroll"],
    }),
    lockPayrollPeriod: builder.mutation<ApiResponse<PayrollPeriodDto>, string>({
      query: (id) => ({
        url: `/payroll-periods/${id}/lock`,
        method: "POST",
      }),
      invalidatesTags: ["Payroll"],
    }),

    // ── Payroll Records ────────────────────────────────────────────
    getPayrollRecordsByPeriod: builder.query<ApiResponse<PayrollRecordDto[]>, string>({
      query: (periodId) => `/payroll-records/period/${periodId}`,
      providesTags: ["Payroll"],
    }),
    getPayrollRecordDetail: builder.query<ApiResponse<PayrollRecordDetailDto>, string>({
      query: (recordId) => `/payroll-records/${recordId}`,
      providesTags: (_res, _err, id) => [{ type: "Payroll", id }],
    }),
    manualAdjustRecordLine: builder.mutation<
      ApiResponse<PayrollRecordDetailDto>,
      { recordId: string; body: ManualAdjustmentDto }
    >({
      query: ({ recordId, body }) => ({
        url: `/payroll-records/${recordId}/adjust`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Payroll"],
    }),

    // ── Salary Advances ────────────────────────────────────────────
    getSalaryAdvances: builder.query<ApiResponse<SalaryAdvanceDto[]>, void>({
      query: () => "/salary-advances",
      providesTags: ["Payroll"],
    }),
    createSalaryAdvance: builder.mutation<ApiResponse<SalaryAdvanceDto>, CreateSalaryAdvanceDto>({
      query: (body) => ({
        url: "/salary-advances",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Payroll"],
    }),
    approveSalaryAdvance: builder.mutation<ApiResponse<SalaryAdvanceDto>, string>({
      query: (id) => ({
        url: `/salary-advances/${id}/approve`,
        method: "POST",
      }),
      invalidatesTags: ["Payroll"],
    }),
    rejectSalaryAdvance: builder.mutation<
      ApiResponse<SalaryAdvanceDto>,
      { id: string; reason?: string }
    >({
      query: ({ id, reason }) => ({
        url: `/salary-advances/${id}/reject`,
        method: "POST",
        body: { reason },
      }),
      invalidatesTags: ["Payroll"],
    }),
    disburseSalaryAdvance: builder.mutation<
      ApiResponse<SalaryAdvanceDto>,
      { id: string; payrollPeriodId?: string }
    >({
      query: ({ id, payrollPeriodId }) => ({
        url: `/salary-advances/${id}/disburse`,
        method: "POST",
        params: payrollPeriodId ? { payrollPeriodId } : undefined,
      }),
      invalidatesTags: ["Payroll"],
    }),

    // ── Payments & Payslips ────────────────────────────────────────
    getPayrollPaymentsByPeriod: builder.query<ApiResponse<PayrollPaymentDto[]>, string>({
      query: (periodId) => `/payroll-payments/period/${periodId}`,
      providesTags: ["Payroll"],
    }),
    getPayslipsByPeriod: builder.query<ApiResponse<PayslipDto[]>, string>({
      query: (periodId) => `/payslips/period/${periodId}`,
      providesTags: ["Payroll"],
    }),
    getPayslipDetail: builder.query<ApiResponse<PayslipDto>, string>({
      query: (id) => `/payslips/${id}`,
      providesTags: (_res, _err, id) => [{ type: "Payroll", id }],
    }),

    // ── ESS (Employee Self-Service) ────────────────────────────────
    getMyPayslips: builder.query<ApiResponse<PayslipDto[]>, void>({
      query: () => "/me/payroll/payslips",
      providesTags: ["Payroll"],
    }),
    getMyPayslipDetail: builder.query<ApiResponse<PayslipDto>, string>({
      query: (id) => `/me/payroll/payslips/${id}`,
      providesTags: (_res, _err, id) => [{ type: "Payroll", id }],
    }),
    getMySalaryAdvances: builder.query<ApiResponse<SalaryAdvanceDto[]>, void>({
      query: () => "/me/payroll/advances",
      providesTags: ["Payroll"],
    }),
    requestMySalaryAdvance: builder.mutation<
      ApiResponse<SalaryAdvanceDto>,
      CreateSalaryAdvanceDto
    >({
      query: (body) => ({
        url: "/me/payroll/advances",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Payroll"],
    }),
  }),
});

export const {
  useGetSalaryComponentsQuery,
  useCreateSalaryComponentMutation,
  useUpdateSalaryComponentMutation,
  useDeleteSalaryComponentMutation,

  useGetPayrollPeriodsQuery,
  useGetPayrollPeriodByIdQuery,
  useCreatePayrollPeriodMutation,
  useUpdatePayrollPeriodMutation,
  useDeletePayrollPeriodMutation,

  usePrecheckPayrollPeriodQuery,
  useCalculatePayrollMutation,
  useGetPayrollPeriodSummaryQuery,
  useSubmitPayrollForApprovalMutation,
  useApprovePayrollPeriodMutation,
  useRejectPayrollPeriodMutation,
  useLockPayrollPeriodMutation,

  useGetPayrollRecordsByPeriodQuery,
  useGetPayrollRecordDetailQuery,
  useManualAdjustRecordLineMutation,

  useGetSalaryAdvancesQuery,
  useCreateSalaryAdvanceMutation,
  useApproveSalaryAdvanceMutation,
  useRejectSalaryAdvanceMutation,
  useDisburseSalaryAdvanceMutation,

  useGetPayrollPaymentsByPeriodQuery,
  useGetPayslipsByPeriodQuery,
  useGetPayslipDetailQuery,

  useGetMyPayslipsQuery,
  useGetMyPayslipDetailQuery,
  useGetMySalaryAdvancesQuery,
  useRequestMySalaryAdvanceMutation,
} = payrollApi;

