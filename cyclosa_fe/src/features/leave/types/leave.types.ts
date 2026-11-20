export type LeaveGroup =
  | "ANNUAL"
  | "PUBLIC_HOLIDAY"
  | "PERSONAL_PAID"
  | "PERSONAL_UNPAID"
  | "SICK"
  | "MATERNITY";

export type LeavePayer = "EMPLOYER" | "SOCIAL_INSURANCE" | "NONE";

export type DayPortion = "FULL_DAY" | "MORNING" | "AFTERNOON";

export type LeaveRequestStatus =
  | "DRAFT"
  | "PENDING_APPROVAL"
  | "APPROVED"
  | "REJECTED"
  | "CANCELLED";

export type ContractType =
  | "FIXED_TERM"
  | "INDEFINITE"
  | "PROBATION"
  | "SERVICE";

// ── Leave Type ──────────────────────────────────────────────────────────────
export interface LeaveTypeDto {
  id: string;
  companyId: string;
  code: string;
  name: string;
  leaveGroup: LeaveGroup;
  payer: LeavePayer;
  fixedDays: number | null;
  requiresApproval: boolean;
  isActive: boolean;
  description?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateLeaveTypeDto {
  code: string;
  name: string;
  leaveGroup: LeaveGroup;
  payer: LeavePayer;
  fixedDays?: number | null;
  requiresApproval?: boolean;
  isActive?: boolean;
  description?: string | null;
}

export interface UpdateLeaveTypeDto {
  name: string;
  leaveGroup: LeaveGroup;
  payer: LeavePayer;
  fixedDays?: number | null;
  requiresApproval: boolean;
  isActive: boolean;
  description?: string | null;
}

export interface LeaveTypeFilterParams {
  keyword?: string;
  leaveGroup?: LeaveGroup | "ALL";
  payer?: LeavePayer | "ALL";
  isActive?: boolean | "ALL";
  page?: number;
  size?: number;
  sortBy?: string;
  direction?: "ASC" | "DESC";
}

// ── Leave Policy ────────────────────────────────────────────────────────────
export interface LeavePolicyDto {
  id: string;
  companyId: string;
  leaveTypeId: string;
  leaveTypeCode: string;
  leaveTypeName: string;
  contractType?: ContractType | null;
  effectiveFrom: string;
  annualEntitlementDays: number;
  seniorityStepYears?: number | null;
  seniorityBonusDays?: number | null;
  maxCarryoverDays: number;
  carryoverDeadlineMonth?: number | null;
  description?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateLeavePolicyDto {
  leaveTypeId: string;
  contractType?: ContractType | null;
  effectiveFrom: string;
  annualEntitlementDays: number;
  seniorityStepYears?: number | null;
  seniorityBonusDays?: number | null;
  maxCarryoverDays?: number;
  carryoverDeadlineMonth?: number | null;
  description?: string | null;
}

export interface UpdateLeavePolicyDto {
  contractType?: ContractType | null;
  effectiveFrom: string;
  annualEntitlementDays: number;
  seniorityStepYears?: number | null;
  seniorityBonusDays?: number | null;
  maxCarryoverDays: number;
  carryoverDeadlineMonth?: number | null;
  description?: string | null;
}

export interface LeavePolicyFilterParams {
  keyword?: string;
  leaveTypeId?: string | "ALL";
  contractType?: ContractType | "ALL";
  page?: number;
  size?: number;
  sortBy?: string;
  direction?: "ASC" | "DESC";
}

// ── Leave Balance ───────────────────────────────────────────────────────────
export interface LeaveBalanceDto {
  id: string;
  companyId: string;
  employeeId: string;
  employeeCode: string;
  employeeFullName: string;
  departmentName?: string | null;
  jobTitleName?: string | null;
  leaveTypeId: string;
  leaveTypeCode: string;
  leaveTypeName: string;
  leaveGroup: LeaveGroup;
  year: number;
  entitledDays: number;
  carriedOverDays: number;
  totalEntitledDays: number;
  usedDays: number;
  pendingDays: number;
  remainingDays: number;
  notes?: string | null;
  updatedAt?: string;
}

export interface GenerateLeaveBalancesDto {
  year: number;
  employeeIds?: string[];
  notes?: string | null;
}

export interface RecalculateLeaveBalanceDto {
  year: number;
  leaveTypeId: string;
}

export interface CarryOverLeaveDto {
  fromYear: number;
}

export interface LeaveBalanceFilterParams {
  keyword?: string;
  year?: number;
  leaveTypeId?: string | "ALL";
  employeeId?: string;
  departmentId?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  direction?: "ASC" | "DESC";
}

// ── Leave Request ───────────────────────────────────────────────────────────
export interface LeaveRequestDto {
  id: string;
  companyId: string;
  employeeId: string;
  employeeCode: string;
  employeeFullName: string;
  departmentName?: string | null;
  jobTitleName?: string | null;
  requestedByUserId: string;
  requestedByUserName?: string | null;
  leaveTypeId: string;
  leaveTypeCode: string;
  leaveTypeName: string;
  leaveGroup: LeaveGroup;
  payer: LeavePayer;
  startDate: string;
  endDate: string;
  dayPortion: DayPortion;
  daysCount: number;
  reason?: string | null;
  submittedAt: string;
  status: LeaveRequestStatus;
  workflowRequestId?: string | null;
  rejectionReason?: string | null;
  cancelledAt?: string | null;
  cancelledBy?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface LeavePreviewRequestDto {
  employeeId?: string;
  leaveTypeId: string;
  startDate: string;
  endDate: string;
  dayPortion: DayPortion;
}

export interface LeavePreviewResponseDto {
  daysCount: number;
  weekendDays: number;
  holidayDays: number;
  holidayDates: string[];
  currentRemainingDays: number;
  projectedRemainingDays: number;
  isBalanceSufficient: boolean;
  requiresApproval: boolean;
}

export interface CreateLeaveRequestDto {
  employeeId?: string;
  leaveTypeId: string;
  startDate: string;
  endDate: string;
  dayPortion: DayPortion;
  reason?: string | null;
}

export interface LeaveRequestFilterParams {
  keyword?: string;
  employeeId?: string;
  departmentId?: string;
  leaveTypeId?: string | "ALL";
  status?: LeaveRequestStatus | "ALL";
  from?: string;
  to?: string;
  year?: number;
  page?: number;
  size?: number;
  sortBy?: string;
  direction?: "ASC" | "DESC";
}

export interface LeaveCalendarFilterParams {
  departmentId?: string;
  from: string;
  to: string;
}

export interface LeaveCalendarEventDto {
  id: string;
  employeeId: string;
  employeeCode: string;
  employeeFullName: string;
  departmentName?: string | null;
  leaveTypeCode: string;
  leaveTypeName: string;
  leaveGroup: LeaveGroup;
  startDate: string;
  endDate: string;
  dayPortion: DayPortion;
  daysCount: number;
  status: LeaveRequestStatus;
}

