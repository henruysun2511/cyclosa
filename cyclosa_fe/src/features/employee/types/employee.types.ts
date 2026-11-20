export type Gender = "MALE" | "FEMALE" | "OTHER";

export type EmployeeStatus =
  | "PROBATION"
  | "ACTIVE"
  | "SUSPENDED"
  | "ON_LEAVE"
  | "TERMINATED";

export type EmploymentType =
  | "FULL_TIME"
  | "PART_TIME"
  | "INTERN"
  | "CONTRACTOR";

export type IdentityDocumentType = "CITIZEN_ID" | "PASSPORT";

export type DependentRelationship =
  | "SPOUSE"
  | "CHILD"
  | "PARENT"
  | "SIBLING"
  | "OTHER";

export type ProbationResult = "PASSED" | "FAILED" | "EXTENDED";

export interface EmployeeSummary {
  id: string;
  companyId: string;
  userId?: string | null;
  employeeCode: string;
  fullName: string;
  lastName: string;
  firstName: string;
  dateOfBirth: string;
  gender: Gender;
  phone: string;
  personalEmail?: string | null;
  startDate: string;
  probationEndDate?: string | null;
  portraitUrl?: string | null;

  // Chiều 1: Tổ chức
  currentDepartmentId?: string | null;
  currentDepartmentName?: string | null;

  // Chiều 2: Địa lý
  currentBranchId?: string | null;
  currentBranchName?: string | null;

  // Chiều 3: Chức danh & Cấp bậc
  currentJobTitleId?: string | null;
  currentJobTitleName?: string | null;
  currentJobLevelId?: string | null;
  currentJobLevelName?: string | null;

  // Quản lý trực tiếp
  currentManagerId?: string | null;
  currentManagerName?: string | null;

  currentEmploymentType?: EmploymentType | null;
  currentStatus: EmployeeStatus;
  createdAt: string;
}

export interface WorkAssignment {
  id: string;
  employeeId: string;
  effectiveFrom: string;
  departmentId?: string | null;
  departmentName?: string | null;
  departmentCode?: string | null;
  branchId?: string | null;
  branchName?: string | null;
  branchCode?: string | null;
  jobTitleId?: string | null;
  jobTitleName?: string | null;
  jobTitleCode?: string | null;
  jobLevelId?: string | null;
  jobLevelName?: string | null;
  jobLevelRank?: number | null;
  managerEmployeeId?: string | null;
  managerEmployeeName?: string | null;
  employmentType: EmploymentType;
  changeReason: string;
  createdAt?: string;
}

export interface StatusHistory {
  id: string;
  employeeId: string;
  status: EmployeeStatus;
  effectiveFrom: string;
  note?: string | null;
  createdAt?: string;
}

export interface IdentityDocument {
  id: string;
  employeeId: string;
  documentType: IdentityDocumentType;
  documentNumber: string;
  issueDate: string;
  issuePlace: string;
  expiryDate?: string | null;
}

export interface BankAccount {
  id: string;
  employeeId: string;
  bankName: string;
  bankBranchName?: string | null;
  accountNumber: string;
}

export interface Dependent {
  id: string;
  employeeId: string;
  fullName: string;
  dateOfBirth: string;
  relationship: DependentRelationship;
  identityNumber?: string | null;
  taxDeductionFrom?: string | null;
  taxDeductionTo?: string | null;
}

export interface EmergencyContact {
  id: string;
  employeeId: string;
  fullName: string;
  relationship: string;
  phone: string;
  address?: string | null;
}

export interface ProbationEvaluation {
  id: string;
  employeeId: string;
  result: ProbationResult;
  evaluationDate: string;
  evaluatedByEmployeeId?: string | null;
  evaluatedByEmployeeName?: string | null;
  comment?: string | null;
  createdAt?: string;
}

export interface FaceEnrollment {
  id: string;
  employeeId: string;
  templateRef: string;
  qualityScore: number;
  livenessVerified: boolean;
  consentGivenAt: string;
  enrolledAt: string;
  revokedAt?: string | null;
  revokeReason?: string | null;
}

export interface EmployeeDetail extends EmployeeSummary {
  address?: string | null;
  personalTaxCode?: string | null;
  socialInsuranceNumber?: string | null;
  currentAssignment?: WorkAssignment | null;
  bankAccount?: BankAccount | null;
  identityDocuments: IdentityDocument[];
  dependents: Dependent[];
  emergencyContacts: EmergencyContact[];
  workAssignments: WorkAssignment[];
  statusHistory: StatusHistory[];
  probationEvaluations: ProbationEvaluation[];
  faceEnrollment?: FaceEnrollment | null;
  updatedAt?: string | null;
}

export interface CreateEmployeeInput {
  companyId: string;
  lastName: string;
  firstName: string;
  dateOfBirth: string;
  gender: Gender;
  phone: string;
  personalEmail?: string;
  address?: string;
  startDate: string;
  probationEndDate?: string;
  personalTaxCode?: string;
  socialInsuranceNumber?: string;
  portraitUrl?: string;

  // Giấy tờ ban đầu
  identityDocumentType?: IdentityDocumentType;
  identityDocumentNumber?: string;
  identityIssueDate?: string;
  identityIssuePlace?: string;

  // Bộ 3 chiều
  departmentId: string;
  branchId: string;
  jobTitleId: string;
  jobLevelId: string;
  managerEmployeeId?: string;
  employmentType?: EmploymentType;

  // Cấp user
  createSystemUser?: boolean;
  userEmail?: string;
}

export interface UpdateEmployeeInput {
  lastName: string;
  firstName: string;
  dateOfBirth: string;
  gender: Gender;
  phone: string;
  personalEmail?: string;
  address?: string;
  startDate?: string;
  probationEndDate?: string;
  personalTaxCode?: string;
  socialInsuranceNumber?: string;
  portraitUrl?: string;
}

export interface EmployeeFilterParams {
  companyId?: string;
  keyword?: string;
  departmentId?: string;
  branchId?: string;
  jobTitleId?: string;
  status?: EmployeeStatus;
  page?: number;
  size?: number;
  [key: string]: unknown;
}

