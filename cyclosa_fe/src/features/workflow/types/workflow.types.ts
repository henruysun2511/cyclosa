// ============================================================================
// ĐỊNH NGHĨA KIỂU DỮ LIỆU PHÂN HỆ QUY TRÌNH PHÊ DUYỆT DÙNG CHUNG (MODULE 09)
// ============================================================================

export type RequestType =
  | "CONTRACT"
  | "RESIGNATION"
  | "OVERTIME"
  | "LEAVE"
  | "SALARY_ADJUSTMENT";

export type ApproverType =
  | "DIRECT_MANAGER"
  | "DEPARTMENT_HEAD"
  | "ROLE"
  | "SPECIFIC_EMPLOYEE";

export type StepConditionType =
  | "ALWAYS"
  | "AMOUNT_ABOVE_THRESHOLD"
  | "SALARY_ABOVE_BAND";

export type StepDecision = "APPROVED" | "REJECTED" | "SKIPPED";

export type WorkflowOverallStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";

// ── CẤU HÌNH BƯỚC DUYỆT (STEP DEFINITIONS) ──────────────────────────────────

export interface CreateWorkflowStepRequest {
  stepOrder: number;
  stepName: string;
  approverType: ApproverType;
  approverRoleId?: string | null;
  approverEmployeeId?: string | null;
  conditionType: StepConditionType;
  conditionThreshold?: number | null;
}

export interface WorkflowStepDefinitionResponse {
  id: string;
  stepOrder: number;
  stepName: string;
  approverType: ApproverType;
  approverRoleId?: string | null;
  approverRoleName?: string | null;
  approverEmployeeId?: string | null;
  approverEmployeeName?: string | null;
  conditionType: StepConditionType;
  conditionThreshold?: number | null;
}

// ── ĐỊNH NGHĨA QUY TRÌNH (WORKFLOW DEFINITIONS) ──────────────────────────────

export interface CreateWorkflowDefinitionRequest {
  companyId: string;
  requestType: RequestType;
  name: string;
  description?: string;
  steps: CreateWorkflowStepRequest[];
}

export interface UpdateWorkflowDefinitionRequest {
  name?: string;
  description?: string;
  isActive?: boolean;
  steps?: CreateWorkflowStepRequest[];
}

export interface WorkflowDefinitionFilterRequest {
  page?: number;
  size?: number;
  keyword?: string;
  companyId?: string;
  requestType?: RequestType;
  isActive?: boolean;
  sortBy?: string;
  sortDir?: "asc" | "desc";
}

export interface WorkflowDefinitionResponse {
  id: string;
  companyId: string;
  companyName?: string;
  requestType: RequestType;
  name: string;
  description?: string;
  isActive: boolean;
  stepCount: number;
  createdAt: string;
  updatedAt?: string;
}

export interface WorkflowDefinitionDetailResponse extends WorkflowDefinitionResponse {
  steps: WorkflowStepDefinitionResponse[];
}

// ── YÊU CẦU & BƯỚC THỰC THI (WORKFLOW REQUESTS & STEPS) ──────────────────────

export interface SubmitWorkflowRequest {
  companyId: string;
  requestType: RequestType;
  referenceId: string;
  referenceCode?: string;
  title: string;
  requestAmount?: number;
  metadata?: string;
}

export interface ApproveStepRequest {
  comment?: string;
}

export interface RejectStepRequest {
  comment: string;
}

export interface CancelWorkflowRequest {
  reason?: string;
}

export interface WorkflowInboxFilterRequest {
  page?: number;
  size?: number;
  keyword?: string;
  requestType?: RequestType;
  sortBy?: string;
  sortDir?: "asc" | "desc";
}

export interface WorkflowRequestStepResponse {
  id: string;
  definitionStepId: string;
  stepOrder: number;
  stepName: string;
  assigneeEmployeeId: string;
  assigneeName: string;
  assigneeCode?: string;
  assigneeJobTitle?: string;
  decision?: StepDecision | null;
  decidedAt?: string | null;
  comment?: string | null;
  isCurrent: boolean;
}

export interface WorkflowRequestResponse {
  id: string;
  definitionId?: string;
  requestType: RequestType;
  referenceId: string;
  referenceCode?: string;
  title: string;
  requestedByUserId: string;
  requesterName: string;
  requesterEmployeeId?: string;
  requestAmount?: number;
  overallStatus: WorkflowOverallStatus;
  currentStepOrder?: number;
  currentStepName?: string;
  currentAssigneeName?: string;
  submittedAt: string;
  cancelledAt?: string;
  cancelReason?: string;
}

export interface WorkflowRequestDetailResponse extends WorkflowRequestResponse {
  definitionName?: string;
  metadata?: string;
  steps: WorkflowRequestStepResponse[];
}

export interface WorkflowStatsResponse {
  pendingMyApproval: number;
  approvedByMe: number;
  mySubmittedTotal: number;
  totalActiveDefinitions: number;
}

