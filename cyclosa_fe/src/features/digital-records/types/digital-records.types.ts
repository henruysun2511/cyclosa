export type RetentionStartEvent =
  | 'ARCHIVED_DATE'
  | 'EMPLOYMENT_END_DATE'
  | 'CONTRACT_END_DATE'
  | 'DOCUMENT_EXPIRY_DATE';

export type MetadataDataType = 'TEXT' | 'DATE' | 'NUMBER' | 'BOOLEAN' | 'SELECT';

export type DossierPurpose =
  | 'RECRUITMENT'
  | 'CONTRACT'
  | 'INSURANCE'
  | 'MEDICAL'
  | 'TERMINATION'
  | 'OTHER';

export type DossierStatus = 'ACTIVE' | 'CLOSED' | 'ARCHIVED';

export type SourceQualityStatus = 'PENDING_CHECK' | 'ACCEPTED' | 'REJECTED';

export type OcrStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

export type DocumentStatus =
  | 'DRAFT'
  | 'VERIFIED'
  | 'PENDING_ARCHIVE'
  | 'ARCHIVED'
  | 'DESTROYED';

export type DocumentFormat = 'PDF_A' | 'PDF' | 'JPG' | 'PNG';

export type LegalHoldReason =
  | 'DISPUTE'
  | 'AUDIT'
  | 'INSPECTION'
  | 'LEGAL_REQUEST'
  | 'OTHER';

export type DestructionStatus =
  | 'DRAFT'
  | 'COUNCIL_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'EXECUTED'
  | 'CANCELLED';

export type CouncilRole = 'CHAIRPERSON' | 'SECRETARY' | 'MEMBER';

export type CouncilVote = 'PENDING' | 'APPROVE' | 'REJECT';

export type ExportFormat = 'PDF_A_WATERMARKED' | 'ZIP_AIP';

export type ExportStatus = 'PENDING' | 'PROCESSING' | 'READY' | 'FAILED';

// ── RETENTION POLICIES ──────────────────────────────────────────────────────
export interface RetentionPolicy {
  id: string;
  companyId: string;
  name: string;
  description?: string;
  retentionMonths: number;
  startEvent: RetentionStartEvent;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateRetentionPolicyRequest {
  name: string;
  description?: string;
  retentionMonths: number;
  startEvent: RetentionStartEvent;
}

export interface UpdateRetentionPolicyRequest {
  name: string;
  description?: string;
  retentionMonths: number;
  startEvent: RetentionStartEvent;
  isActive: boolean;
}

// ── DOCUMENT TYPES & METADATA FIELDS ───────────────────────────────────────
export interface DocumentMetadataField {
  id: string;
  documentTypeId: string;
  fieldKey: string;
  label: string;
  dataType: MetadataDataType;
  isRequired: boolean;
  displayOrder: number;
  validationRegex?: string;
  optionsJson?: string;
}

export interface CreateDocumentMetadataFieldRequest {
  fieldKey: string;
  label: string;
  dataType: MetadataDataType;
  isRequired?: boolean;
  displayOrder?: number;
  validationRegex?: string;
  optionsJson?: string;
}

export interface DocumentTypeSimple {
  id: string;
  code: string;
  name: string;
  isSensitive: boolean;
}

export interface DocumentType {
  id: string;
  companyId: string;
  code: string;
  name: string;
  retentionPolicyId?: string;
  retentionPolicyName?: string;
  retentionMonths?: number;
  isSensitive: boolean;
  description?: string;
  metadataFields: DocumentMetadataField[];
  createdAt: string;
  updatedAt?: string;
}

export interface CreateDocumentTypeRequest {
  code: string;
  name: string;
  retentionPolicyId?: string;
  isSensitive?: boolean;
  description?: string;
  metadataFields?: CreateDocumentMetadataFieldRequest[];
}

export interface UpdateDocumentTypeRequest {
  name: string;
  retentionPolicyId?: string;
  isSensitive?: boolean;
  description?: string;
}

// ── DOSSIERS ────────────────────────────────────────────────────────────────
export interface DossierSummary {
  id: string;
  companyId: string;
  employeeId: string;
  employeeCode?: string;
  employeeFullName?: string;
  dossierCode: string;
  title: string;
  purpose: DossierPurpose;
  status: DossierStatus;
  documentCount: number;
  createdAt: string;
}

export interface DossierDetail {
  id: string;
  companyId: string;
  employeeId: string;
  employeeCode?: string;
  employeeFullName?: string;
  departmentName?: string;
  positionTitle?: string;
  dossierCode: string;
  title: string;
  purpose: DossierPurpose;
  status: DossierStatus;
  description?: string;
  documents: DocumentSummary[];
  createdAt: string;
  updatedAt?: string;
}

export interface CreateDossierRequest {
  employeeId: string;
  dossierCode: string;
  title: string;
  purpose: DossierPurpose;
  description?: string;
}

export interface UpdateDossierRequest {
  title: string;
  purpose?: DossierPurpose;
  status?: DossierStatus;
  description?: string;
}

// ── SOURCE FILES (SIP) ──────────────────────────────────────────────────────
export interface DocumentSourceFile {
  id: string;
  companyId: string;
  fileId?: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  dpi?: number;
  totalPages: number;
  qualityStatus: SourceQualityStatus;
  rejectionReason?: string;
  ocrRawText?: string;
  ocrStatus: OcrStatus;
  uploadedByUserId?: string;
  uploadedAt: string;
}

// ── VERSIONS ────────────────────────────────────────────────────────────────
export interface DocumentVersion {
  id: string;
  documentId: string;
  versionNo: number;
  sourceFileId?: string;
  fileUrl: string;
  fileFormat: DocumentFormat;
  fileSize: number;
  sha256Checksum: string;
  pageFrom: number;
  pageTo: number;
  changeReason?: string;
  isCurrent: boolean;
  createdAt: string;
}

export interface CreateDocumentVersionRequest {
  sourceFileId?: string;
  fileUrl: string;
  fileFormat?: DocumentFormat;
  fileSize?: number;
  sha256Checksum: string;
  pageFrom?: number;
  pageTo?: number;
  changeReason: string;
}

// ── METADATA VALUES ────────────────────────────────────────────────────────
export interface DocumentMetadataValue {
  id: string;
  fieldId: string;
  fieldKey: string;
  label: string;
  value: string;
  ocrConfidence: number;
  isVerified: boolean;
}

// ── DOCUMENTS (AIP) ─────────────────────────────────────────────────────────
export interface DocumentSummary {
  id: string;
  companyId: string;
  documentCode: string;
  title: string;
  dossierId?: string;
  dossierTitle?: string;
  documentTypeId: string;
  documentTypeCode: string;
  documentTypeName: string;
  isSensitive: boolean;
  employeeId: string;
  employeeCode?: string;
  employeeFullName?: string;
  status: DocumentStatus;
  isLegalHold: boolean;
  issueDate?: string;
  expiryDate?: string;
  retentionUntil?: string;
  isDigitallySigned: boolean;
  digitallySignedAt?: string;
  currentVersionNo?: number;
  currentFileUrl?: string;
  currentSha256?: string;
  createdAt: string;
}

export interface DocumentDetail {
  id: string;
  companyId: string;
  documentCode: string;
  title: string;
  dossierId?: string;
  dossierTitle?: string;
  documentTypeId: string;
  documentTypeCode: string;
  documentTypeName: string;
  isSensitive: boolean;
  employeeId: string;
  employeeCode?: string;
  employeeFullName?: string;
  departmentName?: string;
  positionTitle?: string;
  status: DocumentStatus;
  isLegalHold: boolean;
  issueDate?: string;
  expiryDate?: string;
  retentionPolicyId?: string;
  retentionPolicyName?: string;
  retentionMonths?: number;
  retentionUntil?: string;
  verifiedByUserId?: string;
  verifiedByUserName?: string;
  verifiedAt?: string;
  archivedByUserId?: string;
  archivedByUserName?: string;
  archivedAt?: string;
  isDigitallySigned: boolean;
  digitallySignedAt?: string;
  signedByUserId?: string;
  signedByUserName?: string;
  digitalSignatureValue?: string;
  destroyedAt?: string;
  destructionProposalId?: string;
  metadataValues: DocumentMetadataValue[];
  versions: DocumentVersion[];
  currentVersion?: DocumentVersion;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateDocumentRequest {
  employeeId: string;
  dossierId?: string;
  documentTypeId: string;
  documentCode: string;
  title: string;
  issueDate?: string;
  expiryDate?: string;
  sourceFileId?: string;
  fileUrl?: string;
  sha256Checksum?: string;
  fileFormat?: DocumentFormat;
  fileSize?: number;
  pageFrom?: number;
  pageTo?: number;
  metadata?: Record<string, string>;
}

export interface VerifyMetadataRequest {
  metadataValues: Record<string, string>;
  syncToEmployeeProfile?: boolean;
}

export interface DigitizationSignRequest {
  signatureValue: string;
}

export interface DigitizationSignResponse {
  documentId: string;
  documentCode: string;
  isDigitallySigned: boolean;
  digitallySignedAt: string;
  signedByUserId: string;
  signedByUserName?: string;
  sha256Checksum: string;
}

export interface DocumentFilterParams {
  employeeId?: string;
  dossierId?: string;
  documentTypeId?: string;
  status?: string;
  isLegalHold?: boolean;
  search?: string;
  page?: number;
  size?: number;
  sort?: string;
}

// ── LEGAL HOLDS ─────────────────────────────────────────────────────────────
export interface DocumentLegalHold {
  id: string;
  companyId: string;
  documentId: string;
  documentCode?: string;
  documentTitle?: string;
  holdCode: string;
  reason: LegalHoldReason;
  note: string;
  placedByUserId: string;
  placedByUserName?: string;
  placedAt: string;
  releasedByUserId?: string;
  releasedByUserName?: string;
  releasedAt?: string;
  releaseNote?: string;
  isReleased: boolean;
}

export interface PlaceHoldRequest {
  reason: LegalHoldReason;
  note: string;
}

export interface ReleaseHoldRequest {
  releaseNote: string;
}

// ── DESTRUCTION GOVERNANCE ──────────────────────────────────────────────────
export interface CouncilMemberVote {
  id: string;
  memberEmployeeId: string;
  memberEmployeeCode?: string;
  memberFullName?: string;
  departmentName?: string;
  positionTitle?: string;
  councilRole: CouncilRole;
  vote: CouncilVote;
  votedAt?: string;
  comment?: string;
}

export interface ProposalItem {
  id: string;
  documentId: string;
  documentCode?: string;
  documentTitle?: string;
  documentTypeName?: string;
  employeeFullName?: string;
  retentionUntil?: string;
}

export interface DestructionProposalSummary {
  id: string;
  companyId: string;
  proposalCode: string;
  retentionPolicyName?: string;
  proposedByEmployeeId: string;
  proposedByEmployeeName?: string;
  reason: string;
  proposedAt: string;
  status: DestructionStatus;
  requiredApprovalRatio: number;
  totalItems: number;
  totalCouncilMembers: number;
  approvedVotes: number;
  rejectedVotes: number;
  executedAt?: string;
  evidenceFileUrl?: string;
}

export interface DestructionProposalDetail {
  id: string;
  companyId: string;
  proposalCode: string;
  retentionPolicyId?: string;
  retentionPolicyName?: string;
  proposedByEmployeeId: string;
  proposedByEmployeeName?: string;
  reason: string;
  proposedAt: string;
  status: DestructionStatus;
  requiredApprovalRatio: number;
  executedByUserId?: string;
  executedByUserName?: string;
  executedAt?: string;
  evidenceFileUrl?: string;
  certificateSha256?: string;
  items: ProposalItem[];
  councilMembers: CouncilMemberVote[];
  createdAt: string;
  updatedAt?: string;
}

export interface CouncilMemberInput {
  employeeId: string;
  councilRole: CouncilRole;
}

export interface CreateDestructionProposalRequest {
  proposalCode: string;
  retentionPolicyId?: string;
  reason: string;
  requiredApprovalRatio?: number;
  documentIds: string[];
  councilMembers: CouncilMemberInput[];
}

export interface VoteDestructionRequest {
  vote: CouncilVote;
  comment?: string;
}

export interface ExecuteDestructionRequest {
  evidenceFileUrl: string;
  certificateSha256: string;
}

// ── EXPORT REQUESTS (DIP) ───────────────────────────────────────────────────
export interface DossierExportRequest {
  id: string;
  companyId: string;
  employeeId: string;
  employeeCode?: string;
  employeeFullName?: string;
  dossierId?: string;
  dossierTitle?: string;
  requestedByUserId: string;
  exportFormat: ExportFormat;
  watermarkText?: string;
  status: ExportStatus;
  downloadUrl?: string;
  expiresAt?: string;
  createdAt: string;
}

export interface CreateDossierExportRequest {
  employeeId: string;
  dossierId?: string;
  exportFormat?: ExportFormat;
  watermarkText?: string;
}
