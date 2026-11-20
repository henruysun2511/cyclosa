import type { BaseFilterParams } from "@/types/api.types";

// ==========================================
// 1. Enums Nghiệp Vụ Chấm Công (Đối ứng cyclosa_be)
// ==========================================

export type AttendanceEventType = "CHECK_IN" | "CHECK_OUT";

export type VerificationResult =
  | "SUCCESS"
  | "OUT_OF_RANGE"
  | "FACE_MISMATCH"
  | "LIVENESS_FAILED"
  | "NO_ENROLLMENT"
  | "LOW_IMAGE_QUALITY"
  | "DUPLICATE_OR_SEQUENCE_ERROR";

export type AttendanceRequestType =
  | "FORGOT_PUNCH"
  | "TIME_DEVIATION"
  | "DEVICE_FAILURE"
  | "BUSINESS_TRIP"
  | "OTHER";

export type AttendanceRequestStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";

export type DailyAttendanceStatus =
  | "ON_TIME"
  | "LATE"
  | "EARLY"
  | "LATE_AND_EARLY"
  | "MISSING_CHECK_OUT"
  | "ABSENT"
  | "REST_DAY"
  | "LEAVE_PAID"
  | "LEAVE_UNPAID"
  | "HOLIDAY"
  | "EXPLAINED";

export type OvertimeDayType = "NORMAL_DAY" | "WEEKEND" | "PUBLIC_HOLIDAY";

export type TimesheetPeriodStatus = "OPEN" | "LOCKED";

// ==========================================
// 2. Ca Làm Việc (Shifts)
// ==========================================

export interface ShiftResponse {
  id: string;
  companyId: string;
  code: string;
  name: string;
  shiftCode?: string;
  shiftName?: string;
  startTime: string; // "08:00"
  endTime: string;   // "17:00"
  breakStartTime?: string;
  breakEndTime?: string;
  lateGraceMinutes: number;
  earlyGraceMinutes: number;
  workCredit: number; // 1.0
  isNightShift: boolean;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateShiftRequest {
  code: string;
  name: string;
  startTime: string;
  endTime: string;
  breakStartTime?: string;
  breakEndTime?: string;
  breakMinutes?: number;
  lateGraceMinutes?: number;
  earlyGraceMinutes?: number;
  workCredit?: number;
  isActive?: boolean;
}

export interface UpdateShiftRequest {
  name: string;
  startTime: string;
  endTime: string;
  breakStartTime?: string;
  breakEndTime?: string;
  breakMinutes?: number;
  lateGraceMinutes?: number;
  earlyGraceMinutes?: number;
  workCredit?: number;
  isActive?: boolean;
}

export interface ShiftFilter extends BaseFilterParams {
  isActive?: boolean;
  isNightShift?: boolean;
}

// ==========================================
// 3. Phân Ca Làm Việc (Shift Assignments)
// ==========================================

export interface ShiftAssignmentResponse {
  id: string;
  employeeId: string;
  employeeCode?: string;
  employeeName?: string;
  departmentName?: string;
  workDate: string; // "YYYY-MM-DD"
  assignmentDate?: string;
  startTime?: string;
  endTime?: string;
  shiftId: string;
  shiftCode: string;
  shiftName: string;
  shiftHours: string;
  note?: string;
}

export interface BulkShiftAssignmentRequest {
  employeeIds: string[];
  shiftId: string;
  startDate?: string; // "YYYY-MM-DD"
  endDate?: string;   // "YYYY-MM-DD"
  fromDate?: string;
  toDate?: string;
  daysOfWeek?: number[];
  skipWeekends?: boolean;
  overwriteExisting?: boolean;
  note?: string;
}

export interface ShiftAssignmentFilter extends BaseFilterParams {
  employeeId?: string;
  departmentId?: string;
  shiftId?: string;
  startDate?: string;
  endDate?: string;
  year?: number;
  month?: number;
}

// ==========================================
// 4. Chấm Công & Nhật Ký Quẹt Thẻ (Punch & Logs)
// ==========================================

export interface PunchRequest {
  transactionCode?: string;
  liveImageBase64?: string;
  latitude?: number;
  longitude?: number;
  accuracyMeters?: number;
  deviceInfo?: string;
}

export interface CheckInRequest extends PunchRequest {}
export interface CheckOutRequest extends PunchRequest {}

export interface AttendanceLogResponse {
  id: string;
  transactionCode: string;
  employeeId: string;
  employeeName?: string;
  employeeCode?: string;
  shiftAssignmentId?: string;
  eventType: AttendanceEventType;
  occurredAt: string; // ISO-8601
  punchTime?: string;
  verificationResult: VerificationResult;
  faceMatchScore?: number;
  latitude?: number;
  longitude?: number;
  distanceMeters?: number;
  deviceInfo?: string;
  createdAt: string;
}

export interface AttendanceLogFilter extends BaseFilterParams {
  employeeId?: string;
  eventType?: AttendanceEventType;
  verificationResult?: VerificationResult;
  from?: string; // ISO-8601
  to?: string;   // ISO-8601
  date?: string;
}

export interface TodayAttendanceStatusResponse {
  employeeId: string;
  employeeName: string;
  todayDate: string; // "YYYY-MM-DD"
  shiftName?: string;
  shiftHours?: string;
  currentShift?: {
    id?: string;
    shiftCode?: string;
    shiftName?: string;
    startTime?: string;
    endTime?: string;
    breakStartTime?: string;
    breakEndTime?: string;
  };
  firstCheckInTime?: string;
  lastCheckOutTime?: string;
  firstInTime?: string;
  lastOutTime?: string;
  status: DailyAttendanceStatus;
  lateMinutes: number;
  earlyMinutes: number;
  workCredit: number;
  canCheckIn: boolean;
  canCheckOut: boolean;
}

// ==========================================
// 5. Bảng Công Ngày & Bảng Công Tháng (Timesheets)
// ==========================================

export interface DailyAttendanceRecordResponse {
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  workDate: string; // "YYYY-MM-DD"
  attendanceDate?: string;
  shiftName?: string;
  shiftCode?: string;
  shiftHours?: string;
  checkInTime?: string;
  checkOutTime?: string;
  firstInTime?: string;
  lastOutTime?: string;
  status: DailyAttendanceStatus;
  dailyStatus?: DailyAttendanceStatus;
  lateMinutes: number;
  earlyMinutes: number;
  earlyDepartureMinutes?: number;
  workCredit: number;
  actualWorkHours?: number;
  overtimeMinutes?: number;
  isAdjusted: boolean;
  adjustmentReason?: string;
}

export interface DailyRecordFilter extends BaseFilterParams {
  employeeId?: string;
  workDate?: string;
  date?: string;
  status?: DailyAttendanceStatus;
}

export interface MonthlyTimesheetDayCell {
  day: number;
  status: DailyAttendanceStatus;
  workCredit: number;
  lateMinutes: number;
  earlyMinutes: number;
  isAdjusted: boolean;
}

export interface MonthlyTimesheetRow {
  employeeId: string;
  employeeCode: string;
  employeeName: string;
  departmentName: string;
  totalWorkCredits: number;
  totalLateMinutes: number;
  totalEarlyMinutes: number;
  totalLateCount: number;
  totalEarlyCount: number;
  totalAbsentCount: number;
  totalOvertimeHours: number;
  days: Record<number, MonthlyTimesheetDayCell>;
}

export interface MonthlyTimesheetSummaryResponse {
  companyId?: string;
  year: number;
  month: number;
  rows?: MonthlyTimesheetRow[];
  dailyRecords?: DailyAttendanceRecordResponse[];
  totalWorkDays?: number;
  totalWorkHours?: number;
  lateTimes?: number;
  earlyTimes?: number;
  totalOvertimeHours?: number;
  employeeId?: string;
  employeeName?: string;
  employeeCode?: string;
}

export interface MonthlySummaryFilter extends BaseFilterParams {
  year: number;
  month: number;
  departmentId?: string;
}

// ==========================================
// 6. Ngoại Lệ & Đơn Giải Trình (Exceptions & Requests)
// ==========================================

export interface AttendanceExceptionSummaryResponse {
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  workDate: string;
  exceptionType: string;
  details: string;
  hasPendingRequest: boolean;
  missingPunchInCount?: number;
  missingPunchOutCount?: number;
  outOfRangeCount?: number;
  faceMismatchCount?: number;
  pendingRequestCount?: number;
}

export interface AttendanceRequestResponse {
  id: string;
  companyId?: string;
  employeeId: string;
  employeeName?: string;
  employeeCode?: string;
  departmentName?: string;
  workDate: string;
  attendanceDate?: string;
  requestType: AttendanceRequestType;
  proposedCheckIn?: string;
  proposedCheckOut?: string;
  proposedInTime?: string;
  proposedOutTime?: string;
  reason: string;
  attachmentFileId?: string;
  submittedAt?: string;
  status: AttendanceRequestStatus;
  reviewedByUserId?: string;
  reviewerName?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  reviewerNotes?: string;
  reviewerComment?: string;
  isAdjusted?: boolean;
  adjustedCheckIn?: string;
  adjustedCheckOut?: string;
  adjustedInTime?: string;
  adjustedOutTime?: string;
}

export interface CreateAttendanceRequest {
  workDate?: string;
  attendanceDate?: string;
  targetShiftId?: string;
  requestType: AttendanceRequestType;
  proposedCheckIn?: string;
  proposedCheckOut?: string;
  proposedInTime?: string;
  proposedOutTime?: string;
  reason: string;
  attachmentFileId?: string;
}

export interface ApproveAttendanceRequest {
  comment?: string;
  approvedCheckIn?: string;
  approvedCheckOut?: string;
  adjustedInTime?: string;
  adjustedOutTime?: string;
  reviewerNotes?: string;
}

export interface AttendanceRequestFilter extends BaseFilterParams {
  employeeId?: string;
  status?: AttendanceRequestStatus;
  requestType?: AttendanceRequestType;
  attendanceDate?: string;
  search?: string;
  from?: string;
  to?: string;
}

export interface AttendanceAdjustmentResponse {
  id: string;
  attendanceRequestId?: string;
  workDate?: string;
  attendanceDate?: string;
  employeeId?: string;
  employeeCode?: string;
  employeeName?: string;
  originalInTime?: string;
  originalOutTime?: string;
  adjustedInTime?: string;
  adjustedOutTime?: string;
  adjustedCheckIn?: string;
  adjustedCheckOut?: string;
  adjustedWorkHours?: number;
  reason?: string;
  reviewerNotes?: string;
  approvedByUserId?: string;
  approverName?: string;
  adjustedByName?: string;
  createdAt: string;
}

// ==========================================
// 7. Kỳ Công & Chốt Snapshot (Periods & Snapshots)
// ==========================================

export interface TimesheetPeriodResponse {
  id: string;
  companyId?: string;
  periodCode?: string;
  periodName?: string;
  year?: number;
  month?: number;
  startDate: string;
  endDate: string;
  cutoffDate?: string;
  status: TimesheetPeriodStatus;
  standardWorkingDays?: number;
  lockedAt?: string;
  lockedByUserId?: string;
  lockerName?: string;
  unlockReason?: string;
  unlockedAt?: string;
  createdAt?: string;
}

export interface CreateTimesheetPeriodRequest {
  periodCode?: string;
  periodName?: string;
  year?: number;
  month?: number;
  startDate?: string;
  endDate?: string;
  cutoffDate?: string;
  standardWorkingDays?: number;
}

export interface TimesheetPeriodFilter extends BaseFilterParams {
  year?: number;
  status?: TimesheetPeriodStatus;
}

export interface TimesheetPreLockCheckResponse {
  periodId?: string;
  readyToLock?: boolean;
  canLock?: boolean;
  pendingRequestsCount?: number;
  unresolvedAnomaliesCount?: number;
  missingPunchesCount?: number;
  unresolvedAbsencesCount?: number;
  eligibleEmployeesCount?: number;
  exceptions?: AttendanceExceptionSummaryResponse[];
}

export interface LockTimesheetPeriodRequest {
  note?: string;
}

export interface UnlockPeriodRequest {
  reason: string;
}

export interface TimesheetSnapshotOvertimeResponse {
  id: string;
  dayType: OvertimeDayType;
  hours: number;
  rateMultiplier: number;
}

export interface TimesheetSnapshotResponse {
  id: string;
  timesheetPeriodId?: string;
  periodCode?: string;
  periodName?: string;
  year?: number;
  month?: number;
  employeeId: string;
  employeeCode?: string;
  employeeName?: string;
  departmentName?: string;
  standardWorkingDays?: number;
  standardWorkDays?: number;
  actualWorkingDays?: number;
  actualWorkDays?: number;
  totalWorkHours?: number;
  paidLeaveDays?: number;
  unpaidLeaveDays?: number;
  totalLateMinutes?: number;
  totalEarlyMinutes?: number;
  totalOvertimeHours?: number;
  overtimeHours?: number;
  lockedAt?: string;
  overtimes?: TimesheetSnapshotOvertimeResponse[];
}

