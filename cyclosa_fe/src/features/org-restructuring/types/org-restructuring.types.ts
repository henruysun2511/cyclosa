export type ScenarioScope = "COMPANY_WIDE" | "DIVISION_LEVEL" | "DEPARTMENT_LEVEL";

export type ScenarioStatus =
  | "DRAFT"
  | "ANALYZING"
  | "SUBMITTED"
  | "APPROVED"
  | "REJECTED"
  | "EXECUTED"
  | "CANCELLED";

export type RestructureActionType =
  | "CREATE_DEPT"
  | "RENAME_DEPT"
  | "MOVE_DEPT"
  | "MERGE_DEPTS"
  | "SPLIT_DEPT"
  | "DISSOLVE_DEPT"
  | "REASSIGN_EMP"
  | "REASSIGN_MANAGER";

export type DepartmentScenarioStatus =
  | "UNCHANGED"
  | "ADDED"
  | "MODIFIED"
  | "MERGED"
  | "SPLIT"
  | "DISSOLVED";

export type AssignmentStatus =
  | "UNCHANGED"
  | "TRANSFERRED"
  | "PROMOTED"
  | "REDUNDANT";

export type ConflictSeverity = "CRITICAL" | "WARNING" | "INFO";

export interface OrgScenarioItem {
  id: string;
  companyId: string;
  name: string;
  code: string;
  description?: string;
  scope: ScenarioScope;
  status: ScenarioStatus;
  targetEffectiveDate: string;
  executedAt?: string;
  executedBy?: string;
  executedByName?: string;
  createdBy: string;
  createdByName?: string;
  createdAt: string;
  updatedAt?: string;
  departmentCount: number;
  employeeCount: number;
  criticalConflictCount: number;
}

export interface OrgScenarioStatistics {
  totalScenarios: number;
  draftScenarios: number;
  submittedScenarios: number;
  approvedScenarios: number;
  executedScenarios: number;
}

export interface ScenarioDepartmentItem {
  id: string;
  scenarioId: string;
  originalDepartmentId?: string;
  parentScenarioDeptId?: string;
  parentDepartmentName?: string;
  code: string;
  name: string;
  managerEmployeeId?: string;
  managerEmployeeName?: string;
  statusInScenario: DepartmentScenarioStatus;
  targetHeadcount: number;
  currentHeadcount: number;
  isPermissionInherited: boolean;
  notes?: string;
  createdAt: string;
}

export interface ScenarioDepartmentTreeNode {
  id: string;
  scenarioId: string;
  originalDepartmentId?: string;
  parentScenarioDeptId?: string;
  code: string;
  name: string;
  managerEmployeeId?: string;
  managerEmployeeName?: string;
  statusInScenario: DepartmentScenarioStatus;
  targetHeadcount: number;
  currentHeadcount: number;
  isPermissionInherited: boolean;
  notes?: string;
  children: ScenarioDepartmentTreeNode[];
}

export interface ScenarioActionItem {
  id: string;
  scenarioId: string;
  actionType: RestructureActionType;
  payload: string;
  summary: string;
  executedBy: string;
  executedByName?: string;
  createdAt: string;
}

export interface ScenarioEmployeeAssignmentItem {
  id: string;
  scenarioId: string;
  employeeId: string;
  employeeCode: string;
  employeeName: string;
  originalDepartmentId?: string;
  originalDepartmentName?: string;
  newScenarioDeptId: string;
  newScenarioDeptName: string;
  originalJobTitleId?: string;
  originalJobTitleName?: string;
  newJobTitleId: string;
  newJobTitleName: string;
  originalManagerId?: string;
  originalManagerName?: string;
  newManagerId?: string;
  newManagerName?: string;
  assignmentStatus: AssignmentStatus;
  proposedSalary?: number;
  notes?: string;
  createdAt: string;
}

export interface WhatIfImpactAnalysis {
  scenarioId: string;
  asIsHeadcount: number;
  toBeHeadcount: number;
  deltaHeadcount: number;
  transferredCount: number;
  promotedCount: number;
  redundantCount: number;
  asIsMonthlyPayroll: number;
  toBeMonthlyPayroll: number;
  deltaMonthlyPayroll: number;
  deltaAnnualPayroll: number;
  asIsAverageSpanOfControl: number;
  toBeAverageSpanOfControl: number;
  asIsMaxHierarchyDepth: number;
  toBeMaxHierarchyDepth: number;
  departmentImpacts: {
    departmentId: string;
    departmentName: string;
    asIsHeadcount: number;
    toBeHeadcount: number;
    deltaHeadcount: number;
    targetHeadcount: number;
    isOverCapacity: boolean;
  }[];
}

export interface RestructureConflictItem {
  code: string;
  severity: ConflictSeverity;
  title: string;
  description: string;
  targetEntity: string;
  targetId: string;
  suggestion: string;
}

export interface RestructureConflicts {
  scenarioId: string;
  hasCriticalErrors: boolean;
  criticalCount: number;
  warningCount: number;
  infoCount: number;
  conflicts: RestructureConflictItem[];
}

export interface RestructureDiff {
  scenarioId: string;
  departmentDiffs: {
    departmentId: string;
    code: string;
    name: string;
    changeType: string;
    oldParentName?: string;
    newParentName?: string;
    oldManagerName?: string;
    newManagerName?: string;
    details?: string;
  }[];
  employeeDiffs: {
    employeeId: string;
    employeeCode: string;
    employeeName: string;
    changeType: string;
    oldDepartmentName?: string;
    newDepartmentName?: string;
    oldJobTitleName?: string;
    newJobTitleName?: string;
  }[];
}

export interface OrgScenarioFilterParams {
  keyword?: string;
  status?: string;
  scope?: string;
  page: number;
  size: number;
}
