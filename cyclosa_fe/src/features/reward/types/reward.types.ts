export type RewardType =
  | "MONETARY_BONUS"
  | "CERTIFICATE"
  | "TROPHY"
  | "PROMOTION_RECOMMENDATION"
  | "OTHER";

export type ViolationCategory =
  | "ATTENDANCE_BREACH"
  | "PROCESS_POLICY_VIOLATION"
  | "INTERNAL_SECURITY_DISCLOSURE"
  | "FINANCIAL_ASSET_SECRET"
  | "HARASSMENT_DISORDER"
  | "INSUBORDINATION_DEFIANCE"
  | "OTHER";

export type DisciplineForm =
  | "KHIEN_TRACH"
  | "KEO_DAI_NANG_LUONG"
  | "CACH_CHUC"
  | "SA_THAI";

export type DisciplineStatus =
  | "DRAFT"
  | "PENDING_DISMISSAL_APPROVAL"
  | "DECIDED"
  | "CANCELLED";

export type ComplaintCategory =
  | "SALARY_BENEFIT"
  | "COLLEAGUE_CONFLICT"
  | "HARASSMENT_BULLYING"
  | "WORKING_CONDITIONS"
  | "APPRAISAL_PROMOTION"
  | "OTHER";

export type ComplaintStatus =
  | "OPEN"
  | "INVESTIGATING"
  | "RESOLVED"
  | "CLOSED";

// ── REWARD ──
export interface RewardDecision {
  id: string;
  companyId: string;
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  departmentName?: string;
  rewardType: RewardType;
  title: string;
  reason?: string;
  amount?: number;
  decidedByEmployeeId?: string;
  decidedByEmployeeName?: string;
  decisionDate: string;
  pushedToPayroll?: boolean;
  createdAt: string;
}

export interface CreateRewardDecisionRequest {
  employeeId: string;
  rewardType: RewardType;
  title: string;
  reason?: string;
  amount?: number;
  decidedByEmployeeId: string;
  decisionDate: string;
}

export interface UpdateRewardDecisionRequest {
  rewardType?: RewardType;
  title?: string;
  reason?: string;
  amount?: number;
  decidedByEmployeeId?: string;
  decisionDate?: string;
}

export interface RewardDecisionFilter {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: "ASC" | "DESC";
  keyword?: string;
  employeeId?: string;
  rewardType?: RewardType;
  from?: string;
  to?: string;
}

// ── DISCIPLINE ──
export interface DisciplineParticipant {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  departmentName?: string;
  participantRole: string;
}

export interface DisciplineEvidence {
  id: string;
  description: string;
  fileId?: string;
  fileUrl?: string;
  fileName?: string;
  createdAt: string;
}

export interface DisciplineCase {
  id: string;
  companyId: string;
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  departmentName?: string;
  violationDate: string;
  violationCategory: ViolationCategory;
  violationDescription: string;
  disciplineForm?: DisciplineForm;
  salaryExtensionMonths?: number;
  status: DisciplineStatus;
  decidedByEmployeeId?: string;
  decidedByEmployeeName?: string;
  decidedAt?: string;
  expiryDate?: string;
  isExpired?: boolean;
  remainingLimitationMonths?: number;
  pushedToPayroll?: boolean;
  createdAt: string;
}

export interface DisciplineCaseDetail {
  caseInfo: DisciplineCase;
  ruleBasis?: string;
  meetingDate?: string;
  meetingNote?: string;
  reason?: string;
  participants: DisciplineParticipant[];
  evidences: DisciplineEvidence[];
}

export interface DisciplineEligibility {
  eligible: boolean;
  remainingLimitationMonths: number;
  isLimitationExpired: boolean;
  isRestricted: boolean;
  restrictionReasons: string[];
}

export interface CreateDisciplineCaseRequest {
  employeeId: string;
  violationDate: string;
  violationCategory: ViolationCategory;
  violationDescription: string;
}

export interface UpdateDisciplineCaseRequest {
  violationDate?: string;
  violationCategory?: ViolationCategory;
  violationDescription?: string;
  ruleBasis?: string;
  meetingDate?: string;
  meetingNote?: string;
  reason?: string;
  decidedByEmployeeId?: string;
}

export interface ParticipantItem {
  employeeId: string;
  participantRole: string;
}

export interface UpdateParticipantsRequest {
  participants: ParticipantItem[];
}

export interface AddEvidenceRequest {
  description: string;
  fileId?: string;
  fileUrl?: string;
  fileName?: string;
}

export interface DecideDisciplineRequest {
  disciplineForm: DisciplineForm;
  salaryExtensionMonths?: number;
  ruleBasis: string;
  meetingDate: string;
  meetingNote?: string;
  reason?: string;
  decidedByEmployeeId: string;
  decidedAt: string;
}

export interface DisciplineCaseFilter {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: "ASC" | "DESC";
  keyword?: string;
  employeeId?: string;
  status?: DisciplineStatus;
  disciplineForm?: DisciplineForm;
}

// ── COMPLAINT ──
export interface Complaint {
  id: string;
  companyId: string;
  complainantEmployeeId: string;
  complainantEmployeeName: string;
  complainantEmployeeCode: string;
  departmentName?: string;
  category: ComplaintCategory;
  subject: string;
  content: string;
  submittedAt: string;
  status: ComplaintStatus;
  handlerEmployeeId?: string;
  handlerEmployeeName?: string;
  resolution?: string;
  resolvedAt?: string;
  closedAt?: string;
  createdAt: string;
}

export interface CreateComplaintRequest {
  category: ComplaintCategory;
  subject: string;
  content: string;
}

export interface AssignComplaintRequest {
  handlerEmployeeId: string;
}

export interface ResolveComplaintRequest {
  resolution: string;
}

export interface ComplaintFilter {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: "ASC" | "DESC";
  keyword?: string;
  status?: ComplaintStatus;
  category?: ComplaintCategory;
}

