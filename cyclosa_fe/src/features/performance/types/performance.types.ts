export type PerformanceCycleType =
  | "MONTHLY"
  | "QUARTERLY"
  | "HALF_YEAR"
  | "ANNUAL"
  | "PROBATION";

export type PerformanceCycleStatus = "DRAFT" | "ACTIVE" | "CLOSED";

export type ReviewStatus =
  | "DRAFT"
  | "SELF_REVIEWED"
  | "MANAGER_REVIEWED"
  | "FINALIZED";

export type PerformanceRating =
  | "EXCELLENT"
  | "GOOD"
  | "SATISFACTORY"
  | "NEEDS_IMPROVEMENT"
  | "POOR";

export type GoalStatus =
  | "NOT_STARTED"
  | "IN_PROGRESS"
  | "ACHIEVED"
  | "CANCELLED";

export interface PerformanceCycleDto {
  id: string;
  name: string;
  cycleType: PerformanceCycleType;
  year: number;
  startDate: string;
  endDate: string;
  selfReviewDeadline?: string;
  managerReviewDeadline?: string;
  status: PerformanceCycleStatus;
  description?: string;
  totalReviews: number;
  completedReviews: number;
  finalizedReviews: number;
  createdAt: string;
  updatedAt: string;
}

export interface PerformanceCycleSummaryDto {
  cycleId: string;
  cycleName: string;
  status: PerformanceCycleStatus;
  totalReviews: number;
  finalizedReviews: number;
  averageScore?: number;
  ratingDistribution: Record<PerformanceRating, number>;
}

export interface KpiDto {
  id: string;
  code: string;
  name: string;
  description?: string;
  unit: string;
  defaultTarget?: number;
  departmentId?: string;
  departmentName?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PerformanceGoalDto {
  id: string;
  reviewId: string;
  name: string;
  targetValue?: number;
  kpiId?: string;
  kpiCode?: string;
  kpiName?: string;
  kpiUnit?: string;
  weight: number;
  status: GoalStatus;
  selfScore?: number;
  selfComment?: string;
  managerScore?: number;
  managerComment?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PerformanceReviewDto {
  id: string;
  cycleId: string;
  cycleName: string;
  employeeId: string;
  employeeCode: string;
  employeeName: string;
  departmentName?: string;
  jobTitleName?: string;
  managerEmployeeId?: string;
  managerEmployeeName?: string;
  status: ReviewStatus;
  finalScore?: number;
  finalRating?: PerformanceRating;
  totalGoals: number;
  totalWeight: number;
  createdAt: string;
  updatedAt: string;
}

export interface PerformanceReviewDetailDto {
  id: string;
  cycleId: string;
  cycleName: string;
  employeeId: string;
  employeeCode: string;
  employeeName: string;
  departmentName?: string;
  jobTitleName?: string;
  managerEmployeeId?: string;
  managerEmployeeName?: string;
  status: ReviewStatus;
  selfComment?: string;
  managerComment?: string;
  selfSubmittedAt?: string;
  managerSubmittedAt?: string;
  finalScore?: number;
  finalRating?: PerformanceRating;
  finalizedByUserId?: string;
  finalizedAt?: string;
  goals: PerformanceGoalDto[];
  totalWeight: number;
  createdAt: string;
  updatedAt: string;
}

export interface ScorePreviewDto {
  reviewId: string;
  calculatedScore: number;
  calculatedRating: PerformanceRating;
  totalWeight: number;
  totalGoals: number;
  evaluatedGoalsCount: number;
  isReadyToFinalize: boolean;
  validationMessage: string;
}

// ── Query Filters ─────────────────────────────────────────────────────────────
export interface PerformanceCycleFilters {
  search?: string;
  status?: PerformanceCycleStatus | "ALL";
  year?: number | string;
  page?: number;
  size?: number;
  sortBy?: string;
  direction?: "asc" | "desc";
}

export interface KpiFilters {
  search?: string;
  departmentId?: string | "ALL";
  isActive?: boolean | "ALL";
  page?: number;
  size?: number;
  sortBy?: string;
  direction?: "asc" | "desc";
}

export interface PerformanceReviewFilters {
  search?: string;
  cycleId?: string | "ALL";
  employeeId?: string;
  departmentId?: string | "ALL";
  status?: ReviewStatus | "ALL";
  page?: number;
  size?: number;
  sortBy?: string;
  direction?: "asc" | "desc";
}

// ── Mutation Payloads ─────────────────────────────────────────────────────────
export interface CreatePerformanceCyclePayload {
  name: string;
  cycleType: PerformanceCycleType;
  year: number;
  startDate: string;
  endDate: string;
  selfReviewDeadline?: string;
  managerReviewDeadline?: string;
  description?: string;
}

export interface UpdatePerformanceCyclePayload {
  name: string;
  startDate: string;
  endDate: string;
  selfReviewDeadline?: string;
  managerReviewDeadline?: string;
  description?: string;
}

export interface CreateKpiPayload {
  code: string;
  name: string;
  description?: string;
  unit: string;
  defaultTarget?: number;
  departmentId?: string;
  isActive?: boolean;
}

export interface UpdateKpiPayload {
  name: string;
  description?: string;
  unit: string;
  defaultTarget?: number;
  departmentId?: string;
  isActive?: boolean;
}

export interface InitializeReviewsPayload {
  employeeIds: string[];
}

export interface CreateGoalPayload {
  name: string;
  targetValue?: number;
  kpiId?: string;
  weight: number;
}

export interface UpdateGoalPayload {
  name: string;
  targetValue?: number;
  kpiId?: string;
  weight: number;
}

export interface UpdateGoalStatusPayload {
  status: GoalStatus;
}

export interface GoalManagerScoreItem {
  goalId: string;
  managerScore?: number;
  managerComment?: string;
}

export interface ManagerAssessmentPayload {
  generalComment?: string;
  goalScores: GoalManagerScoreItem[];
}
