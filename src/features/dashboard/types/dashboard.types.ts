export interface DashboardKPIs {
  totalEmployees: {
    value: number;
    changeText?: string;
    isPositive?: boolean;
    periodComparison?: string;
  };
  newEmployees: {
    value: number;
    periodText: string;
  };
  activeRecruitments: {
    value: number;
    openPositionsCount: number;
  };
  onLeave: {
    value: number;
    unit: string;
    periodText: string;
  };
  totalPayroll: {
    value: number;
    formatted: string;
    periodText: string;
  };
}

export interface HeadcountTrendPoint {
  period: string;
  count: number;
  joined: number;
  left: number;
}

export interface DepartmentDistribution {
  id: string;
  name: string;
  employeeCount: number;
  percentage: number;
}

export interface RecruitmentFunnelStage {
  stage: string;
  stageName: string;
  count: number;
}

export interface PendingTaskItem {
  id: string;
  title: string;
  category: "RECRUITMENT" | "LEAVE" | "CONTRACT" | "WORKFLOW" | "COMPLIANCE";
  categoryLabel: string;
  targetObject: string;
  submitterName: string;
  submitterRole?: string;
  timeAgo: string;
  status: string;
  actionUrl: string;
  actionLabel: string;
}

export interface RecentActivityItem {
  id: string;
  actorName: string;
  actorRole?: string;
  action: string;
  targetObject: string;
  timeAgo: string;
  entityType: string;
}

export interface DashboardOverviewResponse {
  role: string;
  period: string;
  periodLabel: string;
  lastUpdated: string;
  kpis: DashboardKPIs;
  headcountTrend: HeadcountTrendPoint[];
  departmentDistribution: DepartmentDistribution[];
  recruitmentFunnel: RecruitmentFunnelStage[];
  pendingTasks: PendingTaskItem[];
  recentActivities: RecentActivityItem[];
}

export interface DashboardFilterParams {
  period?: "month" | "quarter" | "year";
  role?: "HR" | "MANAGER" | "EXECUTIVE" | "EMPLOYEE" | "ADMIN";
}
