import { baseApi } from '@/store/base-api-rtk';
import type { ApiResponse, PageData } from '@/types/api.types';
import type {
  RetentionPolicy,
  CreateRetentionPolicyRequest,
  UpdateRetentionPolicyRequest,
  DocumentType,
  DocumentTypeSimple,
  CreateDocumentTypeRequest,
  UpdateDocumentTypeRequest,
  DocumentMetadataField,
  CreateDocumentMetadataFieldRequest,
  DossierSummary,
  DossierDetail,
  CreateDossierRequest,
  UpdateDossierRequest,
  DocumentSummary,
  DocumentDetail,
  CreateDocumentRequest,
  VerifyMetadataRequest,
  DigitizationSignRequest,
  DigitizationSignResponse,
  DocumentVersion,
  CreateDocumentVersionRequest,
  DocumentFilterParams,
  DocumentLegalHold,
  PlaceHoldRequest,
  ReleaseHoldRequest,
  DestructionProposalSummary,
  DestructionProposalDetail,
  CreateDestructionProposalRequest,
  VoteDestructionRequest,
  ExecuteDestructionRequest,
  DocumentSourceFile,
  DossierExportRequest,
  CreateDossierExportRequest,
} from '../types/digital-records.types';

export const digitalRecordsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ── RETENTION POLICIES ──────────────────────────────────────────────────
    getRetentionPolicies: builder.query<PageData<RetentionPolicy>, { page?: number; size?: number }>({
      query: (params) => ({
        url: '/retention-policies',
        method: 'GET',
        params,
      }),
      transformResponse: (res: ApiResponse<PageData<RetentionPolicy>>) => res.data,
      providesTags: ['RetentionPolicy'],
    }),

    getActiveRetentionPolicies: builder.query<RetentionPolicy[], void>({
      query: () => ({
        url: '/retention-policies/active',
        method: 'GET',
      }),
      transformResponse: (res: ApiResponse<RetentionPolicy[]>) => res.data,
      providesTags: ['RetentionPolicy'],
    }),

    getRetentionPolicyById: builder.query<RetentionPolicy, string>({
      query: (id) => ({
        url: `/retention-policies/${id}`,
        method: 'GET',
      }),
      transformResponse: (res: ApiResponse<RetentionPolicy>) => res.data,
      providesTags: (_res, _err, id) => [{ type: 'RetentionPolicy', id }],
    }),

    createRetentionPolicy: builder.mutation<RetentionPolicy, CreateRetentionPolicyRequest>({
      query: (body) => ({
        url: '/retention-policies',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['RetentionPolicy'],
    }),

    updateRetentionPolicy: builder.mutation<RetentionPolicy, { id: string; data: UpdateRetentionPolicyRequest }>({
      query: ({ id, data }) => ({
        url: `/retention-policies/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['RetentionPolicy'],
    }),

    deleteRetentionPolicy: builder.mutation<void, string>({
      query: (id) => ({
        url: `/retention-policies/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['RetentionPolicy'],
    }),

    // ── DOCUMENT TYPES & FIELDS ─────────────────────────────────────────────
    getDocumentTypes: builder.query<PageData<DocumentType>, { page?: number; size?: number }>({
      query: (params) => ({
        url: '/document-types',
        method: 'GET',
        params,
      }),
      transformResponse: (res: ApiResponse<PageData<DocumentType>>) => res.data,
      providesTags: ['DocumentType'],
    }),

    getSimpleDocumentTypes: builder.query<DocumentTypeSimple[], void>({
      query: () => ({
        url: '/document-types/simple',
        method: 'GET',
      }),
      transformResponse: (res: ApiResponse<DocumentTypeSimple[]>) => res.data,
      providesTags: ['DocumentType'],
    }),

    getDocumentTypeById: builder.query<DocumentType, string>({
      query: (id) => ({
        url: `/document-types/${id}`,
        method: 'GET',
      }),
      transformResponse: (res: ApiResponse<DocumentType>) => res.data,
      providesTags: (_res, _err, id) => [{ type: 'DocumentType', id }],
    }),

    createDocumentType: builder.mutation<DocumentType, CreateDocumentTypeRequest>({
      query: (body) => ({
        url: '/document-types',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['DocumentType'],
    }),

    updateDocumentType: builder.mutation<DocumentType, { id: string; data: UpdateDocumentTypeRequest }>({
      query: ({ id, data }) => ({
        url: `/document-types/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['DocumentType'],
    }),

    deleteDocumentType: builder.mutation<void, string>({
      query: (id) => ({
        url: `/document-types/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['DocumentType'],
    }),

    addMetadataField: builder.mutation<DocumentMetadataField, { typeId: string; data: CreateDocumentMetadataFieldRequest }>({
      query: ({ typeId, data }) => ({
        url: `/document-types/${typeId}/fields`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['DocumentType'],
    }),

    deleteMetadataField: builder.mutation<void, { typeId: string; fieldId: string }>({
      query: ({ typeId, fieldId }) => ({
        url: `/document-types/${typeId}/fields/${fieldId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['DocumentType'],
    }),

    // ── DOSSIERS ────────────────────────────────────────────────────────────
    getDossiers: builder.query<PageData<DossierSummary>, { page?: number; size?: number }>({
      query: (params) => ({
        url: '/dossiers',
        method: 'GET',
        params,
      }),
      transformResponse: (res: ApiResponse<PageData<DossierSummary>>) => res.data,
      providesTags: ['Dossier'],
    }),

    getDossiersByEmployee: builder.query<DossierSummary[], string>({
      query: (employeeId) => ({
        url: `/dossiers/employee/${employeeId}`,
        method: 'GET',
      }),
      transformResponse: (res: ApiResponse<DossierSummary[]>) => res.data,
      providesTags: ['Dossier'],
    }),

    getDossierById: builder.query<DossierDetail, string>({
      query: (id) => ({
        url: `/dossiers/${id}`,
        method: 'GET',
      }),
      transformResponse: (res: ApiResponse<DossierDetail>) => res.data,
      providesTags: (_res, _err, id) => [{ type: 'Dossier', id }],
    }),

    createDossier: builder.mutation<DossierSummary, CreateDossierRequest>({
      query: (body) => ({
        url: '/dossiers',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Dossier'],
    }),

    updateDossier: builder.mutation<DossierSummary, { id: string; data: UpdateDossierRequest }>({
      query: ({ id, data }) => ({
        url: `/dossiers/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Dossier'],
    }),

    deleteDossier: builder.mutation<void, string>({
      query: (id) => ({
        url: `/dossiers/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Dossier'],
    }),

    // ── DIGITAL DOCUMENTS ───────────────────────────────────────────────────
    getDocuments: builder.query<PageData<DocumentSummary>, DocumentFilterParams>({
      query: (params) => ({
        url: '/documents',
        method: 'GET',
        params: {
          ...params,
          status: params.status === 'ALL' ? undefined : params.status,
        },
      }),
      transformResponse: (res: ApiResponse<PageData<DocumentSummary>>) => res.data,
      providesTags: ['DigitalDocument'],
    }),

    getDocumentDetail: builder.query<DocumentDetail, string>({
      query: (id) => ({
        url: `/documents/${id}`,
        method: 'GET',
      }),
      transformResponse: (res: ApiResponse<DocumentDetail>) => res.data,
      providesTags: (_res, _err, id) => [{ type: 'DigitalDocument', id }],
    }),

    createDocument: builder.mutation<DocumentSummary, CreateDocumentRequest>({
      query: (body) => ({
        url: '/documents',
        method: 'POST',
        body,
      }),
      transformResponse: (res: ApiResponse<DocumentSummary>) => res.data,
      invalidatesTags: ['DigitalDocument', 'Dossier'],
    }),

    performDocumentOcr: builder.mutation<DocumentDetail, string>({
      query: (id) => ({
        url: `/documents/${id}/ocr`,
        method: 'POST',
      }),
      invalidatesTags: (_res, _err, id) => [{ type: 'DigitalDocument', id }, 'DigitalDocument'],
    }),

    verifyDocumentMetadata: builder.mutation<DocumentDetail, { id: string; data: VerifyMetadataRequest }>({
      query: ({ id, data }) => ({
        url: `/documents/${id}/verify`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (_res, _err, { id }) => [{ type: 'DigitalDocument', id }, 'DigitalDocument'],
    }),

    archiveDocument: builder.mutation<DocumentSummary, string>({
      query: (id) => ({
        url: `/documents/${id}/archive`,
        method: 'POST',
      }),
      invalidatesTags: (_res, _err, id) => [{ type: 'DigitalDocument', id }, 'DigitalDocument'],
    }),

    digitizationSign: builder.mutation<DigitizationSignResponse, { id: string; data: DigitizationSignRequest }>({
      query: ({ id, data }) => ({
        url: `/documents/${id}/digitization-sign`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (_res, _err, { id }) => [{ type: 'DigitalDocument', id }, 'DigitalDocument'],
    }),

    createDocumentVersion: builder.mutation<DocumentVersion, { id: string; data: CreateDocumentVersionRequest }>({
      query: ({ id, data }) => ({
        url: `/documents/${id}/versions`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (_res, _err, { id }) => [{ type: 'DigitalDocument', id }, 'DigitalDocument'],
    }),

    deleteDocument: builder.mutation<void, string>({
      query: (id) => ({
        url: `/documents/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['DigitalDocument', 'Dossier'],
    }),

    // ── SOURCE FILES (SIP) ──────────────────────────────────────────────────
    uploadSourceFile: builder.mutation<DocumentSourceFile, FormData>({
      query: (formData) => ({
        url: '/document-uploads',
        method: 'POST',
        body: formData,
      }),
      transformResponse: (res: ApiResponse<DocumentSourceFile>) => res.data,
    }),

    // ── LEGAL HOLDS ─────────────────────────────────────────────────────────
    getLegalHolds: builder.query<PageData<DocumentLegalHold>, { page?: number; size?: number }>({
      query: (params) => ({
        url: '/legal-holds',
        method: 'GET',
        params,
      }),
      transformResponse: (res: ApiResponse<PageData<DocumentLegalHold>>) => res.data,
      providesTags: ['LegalHold'],
    }),

    getHoldsByDocumentId: builder.query<DocumentLegalHold[], string>({
      query: (docId) => ({
        url: `/legal-holds/document/${docId}`,
        method: 'GET',
      }),
      transformResponse: (res: ApiResponse<DocumentLegalHold[]>) => res.data,
      providesTags: ['LegalHold'],
    }),

    placeLegalHold: builder.mutation<DocumentLegalHold, { documentId: string; data: PlaceHoldRequest }>({
      query: ({ documentId, data }) => ({
        url: `/legal-holds/document/${documentId}`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['LegalHold', 'DigitalDocument'],
    }),

    releaseLegalHold: builder.mutation<DocumentLegalHold, { holdId: string; data: ReleaseHoldRequest }>({
      query: ({ holdId, data }) => ({
        url: `/legal-holds/${holdId}/release`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['LegalHold', 'DigitalDocument'],
    }),

    // ── DESTRUCTION GOVERNANCE ──────────────────────────────────────────────
    getDestructionCandidates: builder.query<DocumentSummary[], void>({
      query: () => ({
        url: '/destruction-proposals/candidates',
        method: 'GET',
      }),
      transformResponse: (res: ApiResponse<DocumentSummary[]>) => res.data,
      providesTags: ['DestructionProposal', 'DigitalDocument'],
    }),

    getDestructionProposals: builder.query<PageData<DestructionProposalSummary>, { status?: string; page?: number; size?: number }>({
      query: (params) => ({
        url: '/destruction-proposals',
        method: 'GET',
        params,
      }),
      transformResponse: (res: ApiResponse<PageData<DestructionProposalSummary>>) => res.data,
      providesTags: ['DestructionProposal'],
    }),

    getDestructionProposalDetail: builder.query<DestructionProposalDetail, string>({
      query: (id) => ({
        url: `/destruction-proposals/${id}`,
        method: 'GET',
      }),
      transformResponse: (res: ApiResponse<DestructionProposalDetail>) => res.data,
      providesTags: (_res, _err, id) => [{ type: 'DestructionProposal', id }],
    }),

    createDestructionProposal: builder.mutation<DestructionProposalSummary, CreateDestructionProposalRequest>({
      query: (body) => ({
        url: '/destruction-proposals',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['DestructionProposal', 'DigitalDocument'],
    }),

    voteDestructionProposal: builder.mutation<DestructionProposalSummary, { id: string; data: VoteDestructionRequest }>({
      query: ({ id, data }) => ({
        url: `/destruction-proposals/${id}/vote`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (_res, _err, { id }) => [{ type: 'DestructionProposal', id }, 'DestructionProposal'],
    }),

    executeDestruction: builder.mutation<DestructionProposalSummary, { id: string; data: ExecuteDestructionRequest }>({
      query: ({ id, data }) => ({
        url: `/destruction-proposals/${id}/execute`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['DestructionProposal', 'DigitalDocument'],
    }),

    // ── EXPORT REQUESTS (DIP) ───────────────────────────────────────────────
    requestDossierExport: builder.mutation<DossierExportRequest, CreateDossierExportRequest>({
      query: (body) => ({
        url: '/dossier-exports',
        method: 'POST',
        body,
      }),
    }),

    getMyExportRequests: builder.query<DossierExportRequest[], string>({
      query: (employeeId) => ({
        url: `/dossier-exports/employee/${employeeId}`,
        method: 'GET',
      }),
      transformResponse: (res: ApiResponse<DossierExportRequest[]>) => res.data,
    }),
  }),
});

export const {
  useGetRetentionPoliciesQuery,
  useGetActiveRetentionPoliciesQuery,
  useGetRetentionPolicyByIdQuery,
  useCreateRetentionPolicyMutation,
  useUpdateRetentionPolicyMutation,
  useDeleteRetentionPolicyMutation,
  useGetDocumentTypesQuery,
  useGetSimpleDocumentTypesQuery,
  useGetDocumentTypeByIdQuery,
  useCreateDocumentTypeMutation,
  useUpdateDocumentTypeMutation,
  useDeleteDocumentTypeMutation,
  useAddMetadataFieldMutation,
  useDeleteMetadataFieldMutation,
  useGetDossiersQuery,
  useGetDossiersByEmployeeQuery,
  useGetDossierByIdQuery,
  useCreateDossierMutation,
  useUpdateDossierMutation,
  useDeleteDossierMutation,
  useGetDocumentsQuery,
  useGetDocumentDetailQuery,
  useCreateDocumentMutation,
  usePerformDocumentOcrMutation,
  useVerifyDocumentMetadataMutation,
  useArchiveDocumentMutation,
  useDigitizationSignMutation,
  useCreateDocumentVersionMutation,
  useDeleteDocumentMutation,
  useUploadSourceFileMutation,
  useGetLegalHoldsQuery,
  useGetHoldsByDocumentIdQuery,
  usePlaceLegalHoldMutation,
  useReleaseLegalHoldMutation,
  useGetDestructionCandidatesQuery,
  useGetDestructionProposalsQuery,
  useGetDestructionProposalDetailQuery,
  useCreateDestructionProposalMutation,
  useVoteDestructionProposalMutation,
  useExecuteDestructionMutation,
  useRequestDossierExportMutation,
  useGetMyExportRequestsQuery,
} = digitalRecordsApi;
