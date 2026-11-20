// ============================================================================
// ĐỊNH NGHĨA KIỂU DỮ LIỆU PHÂN HỆ HỢP ĐỒNG LAO ĐỘNG & KÝ ĐIỆN TỬ (MODULE 08)
// ============================================================================

export type TemplateKind =
  | "LABOR_CONTRACT"
  | "PROBATION_CONTRACT"
  | "SEASONAL_CONTRACT"
  | "COLLABORATOR_AGREEMENT"
  | "APPENDIX_ADJUSTMENT"
  | "TERMINATION_AGREEMENT";

export type TemplateFormat = "HTML" | "DOCX" | "PDF_FORM";

export type ContractType =
  | "PROBATION"
  | "FIXED_TERM"
  | "INDEFINITE"
  | "SERVICE"
  | "SEASONAL"
  | "APPRENTICESHIP"
  | "COLLABORATOR";

export type ContractStatus =
  | "DRAFT"
  | "PENDING_APPROVAL"
  | "APPROVED"
  | "IN_SIGNING"
  | "ACTIVE"
  | "EXPIRED"
  | "TERMINATED";

export type SigningForm = "ELECTRONIC" | "WET_INK" | "HYBRID";

export type SalaryPaymentMethod = "BANK_TRANSFER" | "CASH" | "OTHER";

export type SignerSide = "PARTY_A" | "PARTY_B";

export type SigningMethod =
  | "OTP_SMS"
  | "OTP_EMAIL"
  | "DIGITAL_CERT"
  | "SMART_CA"
  | "BIOMETRIC";

export type SignerStatus =
  | "WAITING"
  | "NOTIFIED"
  | "SIGNED"
  | "REJECTED"
  | "EXPIRED"
  | "CANCELLED";

export type CertificateValidity = "VALID" | "REVOKED" | "EXPIRED" | "UNCHECKED";

// ── BIỂU MẪU HỢP ĐỒNG (CONTRACT TEMPLATES) ───────────────────────────────────

export interface ContractTemplateVersion {
  id: string;
  templateId: string;
  versionNumber: number;
  format: TemplateFormat;
  contentRaw: string;
  sampleDataJson?: string | null;
  cssStyle?: string | null;
  headerFooterConfig?: string | null;
  isActive: boolean;
  isPublished: boolean;
  publishedAt?: string | null;
  publishedBy?: string | null;
  createdAt: string;
}

export interface ContractTemplate {
  id: string;
  companyId: string;
  templateCode: string;
  name: string;
  kind: TemplateKind;
  description?: string | null;
  isActive: boolean;
  activeVersionId?: string | null;
  activeVersion?: ContractTemplateVersion | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTemplateInput {
  companyId: string;
  templateCode: string;
  name: string;
  kind: TemplateKind;
  description?: string;
  format: TemplateFormat;
  contentRaw: string;
  sampleDataJson?: string;
  cssStyle?: string;
  headerFooterConfig?: string;
}

export interface UpdateTemplateInput {
  name: string;
  kind: TemplateKind;
  description?: string;
}

export interface CreateTemplateVersionInput {
  format: TemplateFormat;
  contentRaw: string;
  sampleDataJson?: string;
  cssStyle?: string;
  headerFooterConfig?: string;
}

export interface RenderPreviewInput {
  templateId?: string;
  versionId?: string;
  contentRaw?: string;
  data: Record<string, unknown>;
}

// ── HỢP ĐỒNG LAO ĐỘNG (CONTRACTS) ───────────────────────────────────────────

export interface ContractAllowance {
  id?: string;
  contractId?: string;
  allowanceType: string;
  amount: number;
  isInsuranceInclusive: boolean;
  isTaxable: boolean;
  notes?: string | null;
}

export interface ContractSigner {
  id: string;
  contractId?: string | null;
  appendixId?: string | null;
  side: SignerSide;
  signerUserId?: string | null;
  signerEmployeeId?: string | null;
  signerName: string;
  signerEmail?: string | null;
  signerPhone?: string | null;
  signerRoleTitle?: string | null;
  signingOrder: number;
  signingMethod: SigningMethod;
  status: SignerStatus;
  signedAt?: string | null;
  certificateSerial?: string | null;
  certificateIssuer?: string | null;
  certificateValidity: CertificateValidity;
  otpExpiredAt?: string | null;
  ipAddress?: string | null;
  auditTrailNotes?: string | null;
}

export interface ContractSummary {
  id: string;
  companyId: string;
  employeeId: string;
  employeeCode: string;
  employeeName: string;
  contractNumber: string;
  contractType: ContractType;
  status: ContractStatus;
  signingForm: SigningForm;
  signingDate: string;
  startDate: string;
  endDate?: string | null;
  baseSalary: number;
  jobTitleName?: string | null;
  departmentName?: string | null;
  createdAt: string;
}

export interface ContractDetail extends ContractSummary {
  templateVersionId?: string | null;
  templateName?: string | null;
  jobTitleId?: string | null;
  departmentId?: string | null;
  workLocation?: string | null;
  workingTimeNote?: string | null;
  salaryPaymentMethod: SalaryPaymentMethod;
  bankAccount?: string | null;
  bankName?: string | null;
  probationPercentage?: number | null;
  otherBenefits?: string | null;
  contractFileUrl?: string | null;
  signedFileUrl?: string | null;
  fileHashSha256?: string | null;
  allowances: ContractAllowance[];
  signers: ContractSigner[];
  appendicesCount: number;
  rejectionReason?: string | null;
  terminationDate?: string | null;
  terminationReason?: string | null;
  liquidationNotes?: string | null;
  updatedAt: string;
}

export interface ContractFilterParams {
  [key: string]: unknown;
  page?: number;
  size?: number;
  employeeId?: string;
  companyId?: string;
  status?: ContractStatus;
  contractType?: ContractType;
  expiringBefore?: string; // YYYY-MM-DD
  search?: string;
}

export interface CreateContractInput {
  companyId: string;
  employeeId: string;
  templateVersionId?: string;
  contractNumber: string;
  contractType: ContractType;
  signingForm: SigningForm;
  signingDate: string;
  startDate: string;
  endDate?: string;
  baseSalary: number;
  jobTitleId?: string;
  departmentId?: string;
  workLocation?: string;
  workingTimeNote?: string;
  salaryPaymentMethod: SalaryPaymentMethod;
  bankAccount?: string;
  bankName?: string;
  probationPercentage?: number;
  otherBenefits?: string;
  allowances?: ContractAllowance[];
  signers?: {
    side: SignerSide;
    signerUserId?: string;
    signerEmployeeId?: string;
    signerName: string;
    signerEmail?: string;
    signerPhone?: string;
    signerRoleTitle?: string;
    signingOrder: number;
    signingMethod: SigningMethod;
  }[];
}

export interface UpdateContractInput extends CreateContractInput {}

export interface TerminateContractInput {
  terminationDate: string;
  terminationReason: string;
  liquidationNotes?: string;
}

export interface RejectContractInput {
  reason: string;
}

export interface ComplianceCheckResult {
  allowed: boolean;
  reason?: string;
  previousFixedTermContractsCount: number;
  requiresIndefinite: boolean;
  maxDurationMonths?: number;
}

export interface ContractVersionHistory {
  id: string;
  contractId: string;
  versionNumber: number;
  changeSummary: string;
  changedBy: string;
  changedByName?: string;
  changedAt: string;
  fileUrl?: string;
}

// ── PHỤ LỤC HỢP ĐỒNG (APPENDICES) ───────────────────────────────────────────

export interface ContractAppendixSummary {
  id: string;
  contractId: string;
  contractNumber: string;
  appendixNumber: string;
  appendixType: string;
  effectiveDate: string;
  status: ContractStatus;
  signerAStatus: SignerStatus;
  signerBStatus: SignerStatus;
  createdAt: string;
}

export interface ContractAppendixDetail extends ContractAppendixSummary {
  reason?: string | null;
  newJobTitleId?: string | null;
  newJobTitleName?: string | null;
  newDepartmentId?: string | null;
  newDepartmentName?: string | null;
  newBaseSalary?: number | null;
  contentChanges?: string | null;
  appendixFileUrl?: string | null;
  signedFileUrl?: string | null;
  fileHashSha256?: string | null;
  rejectionReason?: string | null;
  allowances: ContractAllowance[];
  signers: ContractSigner[];
}

export interface CreateAppendixInput {
  appendixNumber: string;
  appendixType: string;
  effectiveDate: string;
  reason?: string;
  newJobTitleId?: string;
  newDepartmentId?: string;
  newBaseSalary?: number;
  contentChanges?: string;
  allowances?: ContractAllowance[];
  signers?: {
    side: SignerSide;
    signerUserId?: string;
    signerEmployeeId?: string;
    signerName: string;
    signerEmail?: string;
    signerPhone?: string;
    signerRoleTitle?: string;
    signingOrder: number;
    signingMethod: SigningMethod;
  }[];
}

export interface UpdateAppendixInput extends CreateAppendixInput {}

// ── KÝ ĐIỆN TỬ & KIỂM TOÁN CHỮ KÝ SỐ (E-SIGN & AUDIT) ────────────────────────

export interface ContractSigningInput {
  otpCode: string;
  signingMethod?: SigningMethod;
  certificateSerial?: string;
  certificateIssuer?: string;
}

export interface VerifyAuditResult {
  valid: boolean;
  fileHashSha256?: string;
  calculatedHash?: string;
  tampered: boolean;
  allSignersVerified: boolean;
  message: string;
}

