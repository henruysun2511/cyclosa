import { baseApi } from "@/store/base-api-rtk";
import { buildQueryString } from "@/lib/utils";
import type { ApiResponse, PageData } from "@/types/api.types";
import type {
  ContractTemplate,
  ContractTemplateVersion,
  CreateTemplateInput,
  UpdateTemplateInput,
  CreateTemplateVersionInput,
  RenderPreviewInput,
  ContractSummary,
  ContractDetail,
  ContractFilterParams,
  CreateContractInput,
  UpdateContractInput,
  TerminateContractInput,
  RejectContractInput,
  ComplianceCheckResult,
  ContractVersionHistory,
  ContractAppendixSummary,
  ContractAppendixDetail,
  CreateAppendixInput,
  UpdateAppendixInput,
  ContractSigner,
  ContractSigningInput,
  VerifyAuditResult,
} from "../types/contract.types";

export const contractApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ═══════════════════════════════════════════════════════════════════════════
    // 1. BIỂU MẪU HỢP ĐỒNG (CONTRACT TEMPLATES & VERSIONS)
    // ═══════════════════════════════════════════════════════════════════════════

    getContractTemplates: builder.query<
      PageData<ContractTemplate>,
      { [key: string]: unknown; page?: number; size?: number; kind?: string; isActive?: boolean; search?: string }
    >({
      query: (params = {}) => {
        const queryParams: Record<string, unknown> = {
          ...params,
          // Chuẩn hóa 1-based page từ UI sang 0-based page cho Spring Boot
          page: params.page ? Math.max(0, params.page - 1) : 0,
        };
        return {
          url: `/contract-templates?${buildQueryString(queryParams)}`,
          method: "GET",
        };
      },
      transformResponse: (res: ApiResponse<PageData<ContractTemplate>>) => res.data,
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({ type: "ContractTemplate" as const, id })),
              { type: "ContractTemplate", id: "LIST" },
            ]
          : [{ type: "ContractTemplate", id: "LIST" }],
    }),

    getContractTemplateById: builder.query<ContractTemplate, string>({
      query: (id) => ({ url: `/contract-templates/${id}`, method: "GET" }),
      transformResponse: (res: ApiResponse<ContractTemplate>) => res.data,
      providesTags: (_res, _err, id) => [{ type: "ContractTemplate", id }],
    }),

    createContractTemplate: builder.mutation<ContractTemplate, CreateTemplateInput>({
      query: (body) => ({
        url: "/contract-templates",
        method: "POST",
        body,
      }),
      transformResponse: (res: ApiResponse<ContractTemplate>) => res.data,
      invalidatesTags: [{ type: "ContractTemplate", id: "LIST" }],
    }),

    updateContractTemplate: builder.mutation<ContractTemplate, { id: string; body: UpdateTemplateInput }>({
      query: ({ id, body }) => ({
        url: `/contract-templates/${id}`,
        method: "PUT",
        body,
      }),
      transformResponse: (res: ApiResponse<ContractTemplate>) => res.data,
      invalidatesTags: (_res, _err, { id }) => [
        { type: "ContractTemplate", id },
        { type: "ContractTemplate", id: "LIST" },
      ],
    }),

    createTemplateVersion: builder.mutation<
      ContractTemplateVersion,
      { templateId: string; body: CreateTemplateVersionInput }
    >({
      query: ({ templateId, body }) => ({
        url: `/contract-templates/${templateId}/versions`,
        method: "POST",
        body,
      }),
      transformResponse: (res: ApiResponse<ContractTemplateVersion>) => res.data,
      invalidatesTags: (_res, _err, { templateId }) => [
        { type: "ContractTemplate", id: templateId },
        { type: "ContractTemplate", id: "VERSIONS" },
      ],
    }),

    getTemplateVersions: builder.query<ContractTemplateVersion[], string>({
      query: (templateId) => ({
        url: `/contract-templates/${templateId}/versions`,
        method: "GET",
      }),
      transformResponse: (res: ApiResponse<ContractTemplateVersion[]>) => res.data,
      providesTags: [{ type: "ContractTemplate", id: "VERSIONS" }],
    }),

    getTemplateVersionById: builder.query<ContractTemplateVersion, { templateId: string; versionId: string }>({
      query: ({ templateId, versionId }) => ({
        url: `/contract-templates/${templateId}/versions/${versionId}`,
        method: "GET",
      }),
      transformResponse: (res: ApiResponse<ContractTemplateVersion>) => res.data,
    }),

    publishTemplateVersion: builder.mutation<void, { templateId: string; versionId: string }>({
      query: ({ templateId, versionId }) => ({
        url: `/contract-templates/${templateId}/versions/${versionId}/publish`,
        method: "POST",
      }),
      invalidatesTags: (_res, _err, { templateId }) => [
        { type: "ContractTemplate", id: templateId },
        { type: "ContractTemplate", id: "LIST" },
        { type: "ContractTemplate", id: "VERSIONS" },
      ],
    }),

    renderTemplatePreview: builder.mutation<string, RenderPreviewInput>({
      query: (body) => ({
        url: "/contract-templates/render-preview",
        method: "POST",
        body,
      }),
      transformResponse: (res: ApiResponse<string>) => res.data,
    }),

    // ═══════════════════════════════════════════════════════════════════════════
    // 2. HỢP ĐỒNG LAO ĐỘNG (CONTRACTS LIFECYCLE)
    // ═══════════════════════════════════════════════════════════════════════════

    getContracts: builder.query<PageData<ContractSummary>, ContractFilterParams>({
      query: (params = {}) => {
        const queryParams: Record<string, unknown> = {
          ...params,
          // Chuẩn hóa 1-based page từ UI sang 0-based page cho Spring Boot
          page: params.page ? Math.max(0, params.page - 1) : 0,
        };
        return {
          url: `/contracts?${buildQueryString(queryParams)}`,
          method: "GET",
        };
      },
      transformResponse: (res: ApiResponse<PageData<ContractSummary>>) => res.data,
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({ type: "Contract" as const, id })),
              { type: "Contract", id: "LIST" },
            ]
          : [{ type: "Contract", id: "LIST" }],
    }),

    getContractById: builder.query<ContractDetail, string>({
      query: (id) => ({ url: `/contracts/${id}`, method: "GET" }),
      transformResponse: (res: ApiResponse<ContractDetail>) => res.data,
      providesTags: (_res, _err, id) => [{ type: "Contract", id }],
    }),

    createContract: builder.mutation<ContractDetail, CreateContractInput>({
      query: (body) => ({
        url: "/contracts",
        method: "POST",
        body,
      }),
      transformResponse: (res: ApiResponse<ContractDetail>) => res.data,
      invalidatesTags: [{ type: "Contract", id: "LIST" }],
    }),

    updateContract: builder.mutation<ContractDetail, { id: string; body: UpdateContractInput }>({
      query: ({ id, body }) => ({
        url: `/contracts/${id}`,
        method: "PUT",
        body,
      }),
      transformResponse: (res: ApiResponse<ContractDetail>) => res.data,
      invalidatesTags: (_res, _err, { id }) => [
        { type: "Contract", id },
        { type: "Contract", id: "LIST" },
      ],
    }),

    deleteContract: builder.mutation<void, string>({
      query: (id) => ({
        url: `/contracts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Contract", id: "LIST" }],
    }),

    submitContractApproval: builder.mutation<ContractDetail, string>({
      query: (id) => ({
        url: `/contracts/${id}/submit-approval`,
        method: "POST",
      }),
      transformResponse: (res: ApiResponse<ContractDetail>) => res.data,
      invalidatesTags: (_res, _err, id) => [
        { type: "Contract", id },
        { type: "Contract", id: "LIST" },
      ],
    }),

    approveContract: builder.mutation<ContractDetail, string>({
      query: (id) => ({
        url: `/contracts/${id}/approve`,
        method: "POST",
      }),
      transformResponse: (res: ApiResponse<ContractDetail>) => res.data,
      invalidatesTags: (_res, _err, id) => [
        { type: "Contract", id },
        { type: "Contract", id: "LIST" },
      ],
    }),

    rejectContract: builder.mutation<ContractDetail, { id: string; body: RejectContractInput }>({
      query: ({ id, body }) => ({
        url: `/contracts/${id}/reject`,
        method: "POST",
        body,
      }),
      transformResponse: (res: ApiResponse<ContractDetail>) => res.data,
      invalidatesTags: (_res, _err, { id }) => [
        { type: "Contract", id },
        { type: "Contract", id: "LIST" },
      ],
    }),

    sendContractSigning: builder.mutation<ContractDetail, string>({
      query: (id) => ({
        url: `/contracts/${id}/send-signing`,
        method: "POST",
      }),
      transformResponse: (res: ApiResponse<ContractDetail>) => res.data,
      invalidatesTags: (_res, _err, id) => [
        { type: "Contract", id },
        { type: "Contract", id: "LIST" },
        { type: "ContractSigner", id: "LIST" },
      ],
    }),

    activateContract: builder.mutation<ContractDetail, string>({
      query: (id) => ({
        url: `/contracts/${id}/activate`,
        method: "POST",
      }),
      transformResponse: (res: ApiResponse<ContractDetail>) => res.data,
      invalidatesTags: (_res, _err, id) => [
        { type: "Contract", id },
        { type: "Contract", id: "LIST" },
      ],
    }),

    terminateContract: builder.mutation<ContractDetail, { id: string; body: TerminateContractInput }>({
      query: ({ id, body }) => ({
        url: `/contracts/${id}/terminate`,
        method: "POST",
        body,
      }),
      transformResponse: (res: ApiResponse<ContractDetail>) => res.data,
      invalidatesTags: (_res, _err, { id }) => [
        { type: "Contract", id },
        { type: "Contract", id: "LIST" },
      ],
    }),

    getContractPreviewPdf: builder.query<{ pdfUrl: string; base64Content?: string }, string>({
      query: (id) => ({
        url: `/contracts/${id}/preview-pdf`,
        method: "GET",
      }),
      transformResponse: (res: ApiResponse<{ pdfUrl: string; base64Content?: string }>) => res.data,
    }),

    getContractVersions: builder.query<ContractVersionHistory[], string>({
      query: (id) => ({
        url: `/contracts/${id}/versions`,
        method: "GET",
      }),
      transformResponse: (res: ApiResponse<ContractVersionHistory[]>) => res.data,
    }),

    checkContractCompliance: builder.query<ComplianceCheckResult, { employeeId: string; contractType: string }>({
      query: ({ employeeId, contractType }) => ({
        url: `/contracts/compliance-check?employeeId=${employeeId}&contractType=${contractType}`,
        method: "GET",
      }),
      transformResponse: (res: ApiResponse<ComplianceCheckResult>) => res.data,
    }),

    // ═══════════════════════════════════════════════════════════════════════════
    // 3. PHỤ LỤC HỢP ĐỒNG (APPENDICES)
    // ═══════════════════════════════════════════════════════════════════════════

    getContractAppendices: builder.query<ContractAppendixSummary[], string>({
      query: (contractId) => ({
        url: `/contracts/${contractId}/appendices`,
        method: "GET",
      }),
      transformResponse: (res: ApiResponse<ContractAppendixSummary[]>) => res.data,
      providesTags: [{ type: "ContractAppendix", id: "LIST" }],
    }),

    createContractAppendix: builder.mutation<ContractAppendixDetail, { contractId: string; body: CreateAppendixInput }>({
      query: ({ contractId, body }) => ({
        url: `/contracts/${contractId}/appendices`,
        method: "POST",
        body,
      }),
      transformResponse: (res: ApiResponse<ContractAppendixDetail>) => res.data,
      invalidatesTags: [
        { type: "ContractAppendix", id: "LIST" },
        { type: "Contract", id: "LIST" },
      ],
    }),

    getContractAppendixById: builder.query<ContractAppendixDetail, string>({
      query: (id) => ({ url: `/contract-appendices/${id}`, method: "GET" }),
      transformResponse: (res: ApiResponse<ContractAppendixDetail>) => res.data,
      providesTags: (_res, _err, id) => [{ type: "ContractAppendix", id }],
    }),

    updateContractAppendix: builder.mutation<ContractAppendixDetail, { id: string; body: UpdateAppendixInput }>({
      query: ({ id, body }) => ({
        url: `/contract-appendices/${id}`,
        method: "PUT",
        body,
      }),
      transformResponse: (res: ApiResponse<ContractAppendixDetail>) => res.data,
      invalidatesTags: (_res, _err, { id }) => [
        { type: "ContractAppendix", id },
        { type: "ContractAppendix", id: "LIST" },
      ],
    }),

    deleteContractAppendix: builder.mutation<void, string>({
      query: (id) => ({
        url: `/contract-appendices/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "ContractAppendix", id: "LIST" }],
    }),

    submitAppendixApproval: builder.mutation<ContractAppendixDetail, string>({
      query: (id) => ({
        url: `/contract-appendices/${id}/submit-approval`,
        method: "POST",
      }),
      transformResponse: (res: ApiResponse<ContractAppendixDetail>) => res.data,
      invalidatesTags: (_res, _err, id) => [
        { type: "ContractAppendix", id },
        { type: "ContractAppendix", id: "LIST" },
      ],
    }),

    approveContractAppendix: builder.mutation<ContractAppendixDetail, string>({
      query: (id) => ({
        url: `/contract-appendices/${id}/approve`,
        method: "POST",
      }),
      transformResponse: (res: ApiResponse<ContractAppendixDetail>) => res.data,
      invalidatesTags: (_res, _err, id) => [
        { type: "ContractAppendix", id },
        { type: "ContractAppendix", id: "LIST" },
      ],
    }),

    rejectContractAppendix: builder.mutation<ContractAppendixDetail, { id: string; body: RejectContractInput }>({
      query: ({ id, body }) => ({
        url: `/contract-appendices/${id}/reject`,
        method: "POST",
        body,
      }),
      transformResponse: (res: ApiResponse<ContractAppendixDetail>) => res.data,
      invalidatesTags: (_res, _err, { id }) => [
        { type: "ContractAppendix", id },
        { type: "ContractAppendix", id: "LIST" },
      ],
    }),

    sendAppendixSigning: builder.mutation<ContractAppendixDetail, string>({
      query: (id) => ({
        url: `/contract-appendices/${id}/send-signing`,
        method: "POST",
      }),
      transformResponse: (res: ApiResponse<ContractAppendixDetail>) => res.data,
      invalidatesTags: (_res, _err, id) => [
        { type: "ContractAppendix", id },
        { type: "ContractAppendix", id: "LIST" },
      ],
    }),

    activateContractAppendix: builder.mutation<ContractAppendixDetail, string>({
      query: (id) => ({
        url: `/contract-appendices/${id}/activate`,
        method: "POST",
      }),
      transformResponse: (res: ApiResponse<ContractAppendixDetail>) => res.data,
      invalidatesTags: (_res, _err, id) => [
        { type: "ContractAppendix", id },
        { type: "ContractAppendix", id: "LIST" },
      ],
    }),

    getAppendixPreviewPdf: builder.query<{ pdfUrl: string; base64Content?: string }, string>({
      query: (id) => ({
        url: `/contract-appendices/${id}/preview-pdf`,
        method: "GET",
      }),
      transformResponse: (res: ApiResponse<{ pdfUrl: string; base64Content?: string }>) => res.data,
    }),

    // ═══════════════════════════════════════════════════════════════════════════
    // 4. TIẾN ĐỘ KÝ & KIỂM TOÁN CHỮ KÝ SỐ (SIGNERS & AUDIT)
    // ═══════════════════════════════════════════════════════════════════════════

    getContractSigners: builder.query<ContractSigner[], string>({
      query: (contractId) => ({
        url: `/contracts/${contractId}/signers`,
        method: "GET",
      }),
      transformResponse: (res: ApiResponse<ContractSigner[]>) => res.data,
      providesTags: [{ type: "ContractSigner", id: "LIST" }],
    }),

    resendSignerOtp: builder.mutation<{ message: string }, string>({
      query: (signerId) => ({
        url: `/contract-signers/${signerId}/resend-otp`,
        method: "POST",
      }),
      transformResponse: (res: ApiResponse<{ message: string }>) => res.data,
    }),

    verifySignerAudit: builder.mutation<VerifyAuditResult, string>({
      query: (signerId) => ({
        url: `/contract-signers/${signerId}/verify-audit`,
        method: "POST",
      }),
      transformResponse: (res: ApiResponse<VerifyAuditResult>) => res.data,
    }),

    cancelSignerRequest: builder.mutation<void, string>({
      query: (signerId) => ({
        url: `/contract-signers/${signerId}/cancel-request`,
        method: "POST",
      }),
      invalidatesTags: [
        { type: "ContractSigner", id: "LIST" },
        { type: "Contract", id: "LIST" },
      ],
    }),

    // ═══════════════════════════════════════════════════════════════════════════
    // 5. CỔNG TỰ PHỤC VỤ NHÂN VIÊN (CONTRACT SELF-SERVICE)
    // ═══════════════════════════════════════════════════════════════════════════

    getMyContracts: builder.query<ContractSummary[], void>({
      query: () => ({ url: "/me/contracts", method: "GET" }),
      transformResponse: (res: ApiResponse<ContractSummary[]>) => res.data,
      providesTags: [{ type: "Contract", id: "MY_LIST" }],
    }),

    getMyContractById: builder.query<ContractDetail, string>({
      query: (id) => ({ url: `/me/contracts/${id}`, method: "GET" }),
      transformResponse: (res: ApiResponse<ContractDetail>) => res.data,
      providesTags: (_res, _err, id) => [{ type: "Contract", id }],
    }),

    requestMyContractOtp: builder.mutation<{ message: string; expiredAt: string }, string>({
      query: (contractId) => ({
        url: `/me/contracts/${contractId}/request-otp`,
        method: "POST",
      }),
      transformResponse: (res: ApiResponse<{ message: string; expiredAt: string }>) => res.data,
    }),

    signMyContract: builder.mutation<ContractDetail, { contractId: string; body: ContractSigningInput }>({
      query: ({ contractId, body }) => ({
        url: `/me/contracts/${contractId}/sign`,
        method: "POST",
        body,
      }),
      transformResponse: (res: ApiResponse<ContractDetail>) => res.data,
      invalidatesTags: (_res, _err, { contractId }) => [
        { type: "Contract", id: contractId },
        { type: "Contract", id: "MY_LIST" },
        { type: "Contract", id: "LIST" },
        { type: "ContractSigner", id: "LIST" },
      ],
    }),
  }),
});

export const {
  // Biểu mẫu
  useGetContractTemplatesQuery,
  useGetContractTemplateByIdQuery,
  useCreateContractTemplateMutation,
  useUpdateContractTemplateMutation,
  useCreateTemplateVersionMutation,
  useGetTemplateVersionsQuery,
  useGetTemplateVersionByIdQuery,
  usePublishTemplateVersionMutation,
  useRenderTemplatePreviewMutation,

  // Hợp đồng
  useGetContractsQuery,
  useGetContractByIdQuery,
  useCreateContractMutation,
  useUpdateContractMutation,
  useDeleteContractMutation,
  useSubmitContractApprovalMutation,
  useApproveContractMutation,
  useRejectContractMutation,
  useSendContractSigningMutation,
  useActivateContractMutation,
  useTerminateContractMutation,
  useGetContractPreviewPdfQuery,
  useGetContractVersionsQuery,
  useCheckContractComplianceQuery,

  // Phụ lục
  useGetContractAppendicesQuery,
  useCreateContractAppendixMutation,
  useGetContractAppendixByIdQuery,
  useUpdateContractAppendixMutation,
  useDeleteContractAppendixMutation,
  useSubmitAppendixApprovalMutation,
  useApproveContractAppendixMutation,
  useRejectContractAppendixMutation,
  useSendAppendixSigningMutation,
  useActivateContractAppendixMutation,
  useGetAppendixPreviewPdfQuery,

  // Ký & Audit
  useGetContractSignersQuery,
  useResendSignerOtpMutation,
  useVerifySignerAuditMutation,
  useCancelSignerRequestMutation,

  // Self service
  useGetMyContractsQuery,
  useGetMyContractByIdQuery,
  useRequestMyContractOtpMutation,
  useSignMyContractMutation,
} = contractApi;

