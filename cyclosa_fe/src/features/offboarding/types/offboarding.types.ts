export type OffboardingType = "RESIGNATION" | "TERMINATION";

export type OffboardingStatus =
  | "PENDING"
  | "APPROVED"
  | "PROCESSING"
  | "COMPLETED"
  | "REJECTED"
  | "CANCELLED";

export type ResignationReason =
  | "BETTER_OPPORTUNITY"
  | "PERSONAL_FAMILY"
  | "HEALTH"
  | "RELOCATION"
  | "CAREER_CHANGE"
  | "WORK_ENVIRONMENT"
  | "COMPENSATION"
  | "OTHER";

export type TerminationReason =
  | "PERFORMANCE"
  | "DISCIPLINARY_DISMISSAL"
  | "RESTRUCTURING_DOWNSIZING"
  | "CONTRACT_EXPIRED_NOT_RENEWED"
  | "MUTUAL_AGREEMENT"
  | "PROBATION_FAILED"
  | "OTHER";

export type ClearanceType =
  | "JOB_HANDOVER"
  | "ASSET"
  | "IT_ACCOUNT"
  | "FINANCE"
  | "DOCUMENT";

export type ClearanceStatus = "PENDING" | "CLEARED" | "REJECTED";

export interface OffboardingRequest {
  id: string;
  employeeId: string;
  employeeCode: string;
  employeeName: string;
  departmentName?: string;
  positionName?: string;
  avatarUrl?: string;
  type: OffboardingType;
  status: OffboardingStatus;
  resignationReason?: ResignationReason;
  noticeDate?: string;
  desiredLastWorkingDate?: string;
  terminationReason?: TerminationReason;
  disciplineId?: string;
  decisionNumber?: string;
  decisionDate?: string;
  actualLastWorkingDate: string;
  successorId?: string;
  successorName?: string;
  reasonDetail?: string;
  notes?: string;
  approverId?: string;
  approverName?: string;
  approvedAt?: string;
  rejectionReason?: string;
  completedAt?: string;
  totalClearanceItems: number;
  clearedItemsCount: number;
  clearanceProgressPercent: number;
  createdAt: string;
  updatedAt?: string;
}

export interface OffboardingClearanceItem {
  id: string;
  offboardingRequestId: string;
  clearanceType: ClearanceType;
  status: ClearanceStatus;
  clearedById?: string;
  clearedByName?: string;
  clearedAt?: string;
  notes?: string;
  createdAt: string;
}

export interface ExitInterview {
  id: string;
  offboardingRequestId: string;
  interviewerId: string;
  interviewerName: string;
  interviewDate: string;
  primaryReason?: string;
  workingEnvironmentFeedback?: string;
  managementFeedback?: string;
  compensationFeedback?: string;
  improvementSuggestions?: string;
  willingToRecommend: boolean;
  notes?: string;
  createdAt: string;
}

export interface OffboardingSummary {
  request: OffboardingRequest;
  clearanceItems: OffboardingClearanceItem[];
  exitInterview?: ExitInterview;
  unreturnedAssetsCount: number;
  canComplete: boolean;
  missingPrerequisites: string[];
}

export interface OffboardingStatistics {
  totalRequests: number;
  pendingApproval: number;
  processingClearance: number;
  completed: number;
  resignations: number;
  terminations: number;
}

export interface OffboardingFilterParams {
  search?: string;
  type?: OffboardingType | "ALL";
  status?: OffboardingStatus | "ALL";
  departmentId?: string;
  fromDate?: string;
  toDate?: string;
  page?: number;
  size?: number;
  sort?: string;
  direction?: "ASC" | "DESC";
}

export interface CreateResignationPayload {
  employeeId: string;
  resignationReason: ResignationReason;
  noticeDate: string;
  desiredLastWorkingDate: string;
  actualLastWorkingDate: string;
  successorId?: string;
  reasonDetail?: string;
  notes?: string;
}

export interface CreateTerminationPayload {
  employeeId: string;
  terminationReason: TerminationReason;
  disciplineId?: string;
  decisionNumber: string;
  decisionDate: string;
  actualLastWorkingDate: string;
  successorId?: string;
  reasonDetail?: string;
  notes?: string;
}

export interface ApproveResignationPayload {
  actualLastWorkingDate?: string;
  notes?: string;
}

export interface RejectResignationPayload {
  rejectionReason: string;
}

export interface UpdateClearanceItemPayload {
  status: ClearanceStatus;
  notes?: string;
}

export interface SaveExitInterviewPayload {
  interviewerId: string;
  interviewDate: string;
  primaryReason?: string;
  workingEnvironmentFeedback?: string;
  managementFeedback?: string;
  compensationFeedback?: string;
  improvementSuggestions?: string;
  willingToRecommend: boolean;
  notes?: string;
}

export interface ReleasedSeatInfo {
  seatId?: string;
  seatCode: string;
  floorName?: string;
  siteName?: string;
  zoneName?: string;
  assignedAt?: string;
  releasedAt?: string;
  isReleased?: boolean;
  releaseNote?: string;
}

export interface HandoverAssetInfo {
  assignmentId: string;
  assetId: string;
  assetCode: string;
  assetName: string;
  categoryName?: string;
  serialNumber?: string;
  assignedAt: string;
  returnedAt?: string;
  conditionOnAssign?: string;
  conditionOnReturn?: string;
  isReturned?: boolean;
  status?: string;
}

export interface OffboardingHandoverProtocol {
  requestId: string;
  employeeId: string;
  employeeCode: string;
  employeeName: string;
  departmentName?: string;
  jobTitleName?: string;
  effectiveDate: string;
  status: OffboardingStatus;
  releasedSeat?: ReleasedSeatInfo;
  assets: HandoverAssetInfo[];
  totalAssets: number;
  returnedAssets: number;
  approvedByName?: string;
  successorName?: string;
}

export interface ReturnOffboardingAssetsPayload {
  condition?: string;
  notes?: string;
  specificAssignmentIds?: string[];
}
