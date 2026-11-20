export interface DashboardFilterParams {
  period?: "DAY" | "WEEK" | "MONTH" | "QUARTER" | "YEAR" | "ALL" | string;
  startDate?: string;
  endDate?: string;
  branchId?: string;
  departmentId?: string;
}

// ── 1. EXECUTIVE DASHBOARD DATA ──
export interface HeadcountTrendPoint {
  period: string;
  count: number;
  joined: number;
  left: number;
}

export interface DepartmentSharePoint {
  departmentId: string;
  departmentName: string;
  employeeCount: number;
  percentage: number;
}

export interface GenderDistribution {
  maleCount: number;
  femaleCount: number;
  otherCount: number;
}

export interface ExecutiveWatchlistItem {
  title: string;
  count: number;
  severity: "CRITICAL" | "WARNING" | "INFO" | string;
  targetUrl: string;
}

export interface ExecutiveDashboardData {
  totalEmployees: number;
  employeeGrowthPercentage: number;
  turnoverRate: number;
  turnoverComparison: number;
  overallAttendanceRate: number;
  attendanceComparison: number;
  estimatedMonthlyPayroll: number;
  formattedPayroll: string;
  headcountTrend: HeadcountTrendPoint[];
  departmentDistribution: DepartmentSharePoint[];
  genderDistribution: GenderDistribution;
  executiveWatchlist: ExecutiveWatchlistItem[];
}

// ── 2. PERSONNEL DASHBOARD DATA ──
export interface BranchSharePoint {
  branchId: string;
  branchName: string;
  employeeCount: number;
  percentage: number;
}

export interface ContractTypeSharePoint {
  contractType: string;
  label: string;
  count: number;
  percentage: number;
}

export interface TenureGroupPoint {
  label: string;
  count: number;
  percentage: number;
}

export interface ExpiringContractSummary {
  contractId: string;
  contractNumber: string;
  employeeName: string;
  employeeCode: string;
  contractType: string;
  expiryDate: string;
  daysRemaining: number;
}

export interface PersonnelDashboardData {
  activeEmployees: number;
  probationEmployees: number;
  expiringContractsCount: number;
  averageTenureYears: number;
  branchDistribution: BranchSharePoint[];
  contractTypeDistribution: ContractTypeSharePoint[];
  tenureDistribution: TenureGroupPoint[];
  expiringContracts: ExpiringContractSummary[];
}

// ── 3. ATTENDANCE DASHBOARD DATA ──
export interface DailyTrendPoint {
  dayOfWeek: string;
  onTimeCount: number;
  lateCount: number;
  absentCount: number;
}

export interface DepartmentOvertimePoint {
  departmentName: string;
  totalOvertimeHours: number;
  averageHoursPerEmployee: number;
}

export interface LeaveTypeSharePoint {
  leaveType: string;
  label: string;
  daysCount: number;
  percentage: number;
}

export interface ShiftAttendanceSummary {
  shiftName: string;
  totalScheduled: number;
  presentCount: number;
  lateCount: number;
  absentCount: number;
}

export interface AttendanceDashboardData {
  onTimeRateToday: number;
  lateEarlyCountMonth: number;
  totalOvertimeHours: number;
  pendingLeaveRequests: number;
  dailyLateTrend: DailyTrendPoint[];
  topOvertimeDepartments: DepartmentOvertimePoint[];
  leaveTypeDistribution: LeaveTypeSharePoint[];
  shiftAttendanceSummary: ShiftAttendanceSummary[];
}

// ── 4. RECRUITMENT DASHBOARD DATA ──
export interface FunnelStagePoint {
  stageKey: string;
  stageName: string;
  count: number;
  conversionRate: number;
}

export interface SourceSharePoint {
  sourceName: string;
  count: number;
  percentage: number;
}

export interface OnboardingMilestonePoint {
  milestone: string;
  completedTasks: number;
  pendingTasks: number;
}

export interface UrgentJobOpeningSummary {
  jobTitle: string;
  departmentName: string;
  applicantsCount: number;
  daysOpen: number;
}

export interface RecruitmentDashboardData {
  activeJobOpenings: number;
  averageTimeToFillDays: number;
  averageCostPerHire: number;
  onboardingInProgress: number;
  funnelStages: FunnelStagePoint[];
  candidateSources: SourceSharePoint[];
  onboardingProgress: OnboardingMilestonePoint[];
  urgentJobOpenings: UrgentJobOpeningSummary[];
}

// ── 5. PERFORMANCE DASHBOARD DATA ──
export interface BellCurveGradePoint {
  grade: string;
  label: string;
  targetPercentage: number;
  actualPercentage: number;
  actualCount: number;
}

export interface DepartmentPerformanceRank {
  departmentName: string;
  averageScore: number;
  completionRate: number;
}

export interface NineBoxGridBoxPoint {
  boxKey: string;
  label: string;
  count: number;
  percentage: number;
}

export interface PerformanceDashboardData {
  cycleCompletionRate: number;
  averageScore: number;
  okrAchievementRate: number;
  pipCount: number;
  bellCurveDistribution: BellCurveGradePoint[];
  departmentRanking: DepartmentPerformanceRank[];
  nineBoxGridSummary: NineBoxGridBoxPoint[];
}

// ── 6. WORKPLACE DASHBOARD DATA ──
export interface FloorOccupancyPoint {
  floorName: string;
  totalSeats: number;
  occupiedSeats: number;
  occupancyRate: number;
}

export interface PeakMeetingHourPoint {
  hourSlot: string;
  bookingCount: number;
}

export interface AssetCategorySharePoint {
  categoryName: string;
  totalQuantity: number;
  assignedQuantity: number;
  assignedPercentage: number;
}

export interface WorkplaceDashboardData {
  deskOccupancyRateToday: number;
  meetingRoomOccupancyRate: number;
  totalAssignedAssetValue: number;
  formattedAssetValue: string;
  damagedOrPendingAssetsCount: number;
  floorOccupancy: FloorOccupancyPoint[];
  peakMeetingHours: PeakMeetingHourPoint[];
  assetCategoryDistribution: AssetCategorySharePoint[];
}
