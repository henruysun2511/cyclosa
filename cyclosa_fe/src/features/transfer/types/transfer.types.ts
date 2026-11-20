export type TransferType =
  | "INTERNAL_DEPARTMENT"
  | "BRANCH_TRANSFER"
  | "INTER_COMPANY"
  | "ROLE_PROMOTION_DEMOTION"
  | "TEMPORARY_DISPATCH";

export type TransferStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "PENDING_APPROVAL"
  | "APPROVED"
  | "REJECTED"
  | "COMPLETED"
  | "CANCELLED";

export type TransferReason =
  | "BUSINESS_NEED"
  | "PROMOTION"
  | "CAREER_DEVELOPMENT"
  | "PERFORMANCE"
  | "RESTRUCTURING"
  | "EMPLOYEE_REQUEST"
  | "TEMPORARY_PROJECT"
  | "OTHER";

export interface TransferAllowance {
  id?: string;
  allowanceName: string;
  amount: number;
  notes?: string;
  createdAt?: string;
}

export interface CurrentWorkSnapshot {
  employeeId: string;
  employeeCode: string;
  employeeName: string;
  portraitUrl?: string;
  departmentId?: string;
  departmentName?: string;
  branchId?: string;
  branchName?: string;
  jobTitleId?: string;
  jobTitleName?: string;
  jobLevelId?: string;
  jobLevelName?: string;
  managerId?: string;
  managerName?: string;
  currentBaseSalary?: number;
  effectiveFrom?: string;
}

export interface TransferSummary {
  id: string;
  employeeId: string;
  employeeCode: string;
  employeeName: string;
  employeePortraitUrl?: string;
  transferType: TransferType;
  transferTypeDescription?: string;
  status: TransferStatus;
  statusDescription?: string;
  fromDepartmentName: string;
  fromBranchName?: string;
  fromJobTitleName: string;
  fromManagerName?: string;
  toDepartmentName: string;
  toBranchName?: string;
  toJobTitleName: string;
  toManagerName?: string;
  effectiveDate: string;
  endDate?: string;
  reason: TransferReason;
  reasonDescription?: string;
  hasSalaryAdjustment?: boolean;
  isReturned?: boolean;
  createdAt: string;
}

export interface TransferDetail {
  id: string;
  employeeId: string;
  employeeCode: string;
  employeeName: string;
  employeePortraitUrl?: string;
  employeeEmail?: string;
  employeePhone?: string;

  transferType: TransferType;
  transferTypeDescription?: string;
  status: TransferStatus;
  statusDescription?: string;

  fromDepartmentId: string;
  fromDepartmentName: string;
  fromBranchId?: string;
  fromBranchName?: string;
  fromJobTitleId: string;
  fromJobTitleName: string;
  fromJobLevelId?: string;
  fromJobLevelName?: string;
  fromManagerId?: string;
  fromManagerName?: string;
  fromBaseSalary?: number;

  toDepartmentId: string;
  toDepartmentName: string;
  toBranchId?: string;
  toBranchName?: string;
  toJobTitleId: string;
  toJobTitleName: string;
  toJobLevelId?: string;
  toJobLevelName?: string;
  toManagerId?: string;
  toManagerName?: string;
  toBaseSalary?: number;

  effectiveDate: string;
  endDate?: string;
  reason: TransferReason;
  reasonDescription?: string;
  reasonDetail?: string;
  notes?: string;

  hasSalaryAdjustment: boolean;
  salaryNotes?: string;
  allowances: TransferAllowance[];

  workflowRequestId?: string;
  approvedBy?: string;
  approvedByName?: string;
  approvedAt?: string;
  rejectionReason?: string;

  completedBy?: string;
  completedByName?: string;
  completedAt?: string;
  isReturned: boolean;

  createdAt: string;
  updatedAt?: string;
}

export interface TransferStatistics {
  total: number;
  pendingApprovalCount: number;
  approvedCount: number;
  temporaryDispatchCount: number;
}

export interface TransferFilterParams {
  keyword?: string;
  status?: string;
  transferType?: string;
  departmentId?: string;
  isTemporary?: boolean;
  page?: number;
  size?: number;
}

export interface CreateTransferPayload {
  employeeId: string;
  transferType: TransferType;
  toDepartmentId: string;
  toBranchId?: string;
  toJobTitleId: string;
  toJobLevelId?: string;
  toManagerId?: string;
  toBaseSalary?: number;
  effectiveDate: string;
  endDate?: string;
  reason: TransferReason;
  reasonDetail?: string;
  notes?: string;
  hasSalaryAdjustment?: boolean;
  salaryNotes?: string;
  allowances?: {
    allowanceName: string;
    amount: number;
    notes?: string;
  }[];
}

export interface UpdateTransferPayload {
  transferType: TransferType;
  toDepartmentId: string;
  toBranchId?: string;
  toJobTitleId: string;
  toJobLevelId?: string;
  toManagerId?: string;
  toBaseSalary?: number;
  effectiveDate: string;
  endDate?: string;
  reason: TransferReason;
  reasonDetail?: string;
  notes?: string;
  hasSalaryAdjustment?: boolean;
  salaryNotes?: string;
  allowances?: {
    allowanceName: string;
    amount: number;
    notes?: string;
  }[];
}

export interface RejectTransferPayload {
  rejectionReason: string;
}

export interface ApproveTransferPayload {
  notes?: string;
}

export interface ExtendTransferPayload {
  newEndDate: string;
  notes?: string;
}
